// import { Signer } from '@ethersproject/abstract-signer';
// import { Bytes, BytesLike, hexDataSlice, joinSignature } from '@ethersproject/bytes';
// import { Provider, TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
// import { keccak256 } from '@ethersproject/keccak256';
// import { Deferrable, resolveProperties } from '@ethersproject/properties';
// import { hashMessage } from '@ethersproject/hash';
// import { serialize, UnsignedTransaction } from '@ethersproject/transactions';

// import { getAddress } from '@ethersproject/address';
// import { Logger } from '@ethersproject/logger';
// import { computePublicKey } from '@ethersproject/signing-key';
// import { ActorSubclass, DerEncodedPublicKey } from '@dfinity/agent';
// import { _SERVICE as ECDSAService } from './idls/eth_tents';
// import { fromHexString } from '@dfinity/candid/lib/cjs/utils/buffer';
// import { hasOwnProperty } from '@ego-js/utils';
// import { Secp256k1PublicKey } from '@dfinity/identity-secp256k1';
// const logger = new Logger('beta');

// export function computeAddress(key: BytesLike | string): string {
// 	const publicKey = computePublicKey(key);
// 	return getAddress(hexDataSlice(keccak256(hexDataSlice(publicKey, 1)), 12));
// }

// // const testKey = process.env.isProduction ? 'test_key_1' : 'dfx_test_key'; //  'test_key_1'
// const testKey = process.env.isProduction ? 'test_key_1' : 'test_key_1'; //  'test_key_1'

// export class ECDSASigner extends Signer {
// 	private _address = '';
// 	private _publicKey = '';
// 	private actor?: ActorSubclass<ECDSAService>;
// 	private path?: string;
// 	public declare provider?: Provider;
// 	constructor(bytesLike: BytesLike | ECDSASigner, provider?: Provider) {
// 		super();
// 		if (bytesLike instanceof ECDSASigner) {
// 			// assert(bytesLike.actor, 'Actor is not set');
// 			// assert(bytesLike.path, 'Actor is not set');
// 			this.setActor(bytesLike.actor!);
// 			this.setPath(bytesLike.path!);
// 		} else {
// 			this._publicKey = computePublicKey(
// 				bytesLike
// 				// bytesLike.length > 33 ? false : true,
// 			);

// 			this._address = computeAddress(
// 				bytesLike
// 				// bytesLike.length > 33 ? false : true,
// 			);
// 		}
// 		this.setProvider(provider);
// 	}
// 	get publicKey(): string {
// 		return this._publicKey;
// 	}
// 	public setActor(actor: ActorSubclass<ECDSAService>) {
// 		this.actor = actor;
// 	}
// 	public setPath(path: string) {
// 		this.path = path;
// 	}
// 	public setProvider(provider?: Provider) {
// 		this.provider = provider;
// 	}

// 	async signMessage(message: Bytes | string): Promise<string> {
// 		const toSignMessage = new Uint8Array(fromHexString(hashMessage(message).replace('0x', '')));
// 		const cid = await this.getChainId();

// 		return joinSignature(await this._signDigest(toSignMessage, cid, 'ECDSASigner.signMessage'));
// 	}

// 	public static async fromActor(path: string, actor: ActorSubclass<ECDSAService>, provider?: Provider): Promise<ECDSASigner> {
// 		try {
// 			const pubRes = await actor.ecGetPublicKey(path, [testKey]);

// 			if (hasOwnProperty(pubRes, 'Ok')) {
// 				const public_key = pubRes.Ok.public_key;
// 				const pk = Secp256k1PublicKey.fromRaw(new Uint8Array(public_key));

// 				const bytesLike = public_key.length > 33 ? new Uint8Array(pk.toRaw()) : public_key;

// 				const signer = new ECDSASigner(bytesLike, provider);
// 				signer.setActor(actor);
// 				signer.setPath(path);
// 				return signer;
// 			} else {
// 				throw new Error(pubRes.Err);
// 			}
// 		} catch (error) {
// 			console.log({ error });
// 			logger.throwArgumentError('ECDSASigner.fromActor failed', 'ECDSASigner.fromActor', error);
// 			throw new Error(`ECDSASigner.fromActor failed: ${(error as Error).message}`);
// 		}
// 	}

// 	connect(provider: Provider): ECDSASigner {
// 		this.setProvider(provider);
// 		return this;
// 		// return new ECDSASigner(this, provider);
// 	}

// 	async getAddress(): Promise<string> {
// 		return Promise.resolve(this._address);
// 	}

// 	async _signDigest(message: Uint8Array, chainId: number, signingFunctionName: string): Promise<Uint8Array> {
// 		try {
// 			const now = Date.now();
// 			console.log('ecSignRecoverable gaVerify');
// 			const bytesResult = await this.actor?.ecSignRecoverable(this.path!, Array.from(message), [chainId]);
// 			const then = Date.now();
// 			console.log(then - now);
// 			if (bytesResult && hasOwnProperty(bytesResult, 'Ok')) {
// 				return new Uint8Array(bytesResult.Ok.signature);
// 			} else {
// 				throw new Error(`${signingFunctionName} Error: ${bytesResult === undefined ? 'Actor is not set' : bytesResult?.Err}`);
// 			}
// 		} catch (error) {
// 			throw error;
// 		}
// 	}

// 	async signTransaction(transaction: TransactionRequest): Promise<string> {
// 		console.log({ transaction });
// 		return resolveProperties(transaction).then(async (tx) => {
// 			if (tx.from != null) {
// 				if (getAddress(tx.from) !== this._address) {
// 					logger.throwArgumentError('transaction from address mismatch', 'transaction.from', transaction.from);
// 				}
// 				delete tx.from;
// 			}
// 			const actorSignatureRes = await this._signDigest(
// 				new Uint8Array(fromHexString(keccak256(serialize(<UnsignedTransaction>tx)).replace('0x', ''))),
// 				tx.chainId!,
// 				'ECDSASigner.signTransaction'
// 			);
// 			return serialize(<UnsignedTransaction>tx, actorSignatureRes);
// 		});
// 	}

// 	async sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse> {
// 		console.log('sendTransaction transaction', transaction);
// 		this._checkProvider('sendTransaction');
// 		const tx = await this.populateTransaction(transaction);
// 		console.log('sendTransaction tx', tx);
// 		console.log('sendTransaction tx gasPrice', tx.gasPrice?.toString(), tx.gasLimit?.toString());
// 		const signedTx = await this.signTransaction({ ...tx });
// 		console.log('sendTransaction signedTx', signedTx);
// 		return await this.provider!.sendTransaction(signedTx);
// 	}
// }
