/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { idlFactory as intentIDL } from './idls/eth_tents.idl';
import { IntentItem, _SERVICE as intentService } from './idls/eth_tents';
// import { getCanisterId, getActor, identity, hasOwnProperty } from '@ego-js/utils';
import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { ethers } from 'ethers';
import { getActor, hasOwnProperty } from './lib';
import { fromHexString } from '@dfinity/candid';
import contract from './vault';

import express from 'express';
import cron from 'node-cron';
import { parseEther } from 'ethers/lib/utils';

const config = {
	rpc_endpoint: 'https://rpc.testnet.mantle.xyz/', // 'https://eth-mainnet.g.alchemy.com/v2/_iDI10Kts6my6A2_rI8LTVnwcR4nOiNE', //'https://41bc-219-137-141-232.ngrok-free.app',
};

const app = express();

cron.schedule('*/1 * * * *', async function () {
	console.log('---------------------');
	console.log('running a task every 30 seconds');
	await task();
});

function fromIntentItem(item: IntentItem): Record<string, any> {
	return {
		intender: `0x${item.intender.replace('0x', '')}`,
		destinationChain: item.destinationChain,
		recipient: `0x${item.recipient.replace('0x', '')}`,
		tokenOutSymbol: item.tokenOutSymbol,
		tokenIn: `0x${item.tokenIn.replace('0x', '')}`,
		tokenOut: `0x${item.tokenOut.replace('0x', '')}`,
		amount: ethers.utils.parseUnits(item.amount.toString(), 'gwei'),
		num: ethers.utils.parseUnits(item.num == BigInt(0) ? '1' : item.num.toString(), 'wei'),
		feeRate: ethers.utils.parseUnits(item.feeRate.toString(), 'wei'),
		expiration: ethers.utils.parseUnits((Math.ceil(Date.now() / 1000) + 1 * 3600 * 24).toString(), 'wei'),
		taskId: ethers.utils.parseUnits('2', 'wei'),
		signatureHash: item.signatureHash,
	};
}

function getVaultFromDaiContract(addr: string) {
	switch (addr.toLowerCase()) {
		case '0xDDD657ebc496DDB74Fb96F21C861bd9A1807f68e'.toLowerCase(): {
			return {
				vault: '0x3Fe2f27E3831eF836137A38e7895B6DdB48E4D1C',
				rpc: 'https://rpc.ankr.com/polygon_mumbai',
				chainId: 80001,
				name: 'polygon',
			};
		}
		case '0x99f3eB619d84337070f41D15b95A2Dffad76F550'.toLowerCase(): {
			return {
				vault: '0xB45966E75317c30610223ed5D26851a80C4F5420',
				rpc: 'https://rpc.testnet.mantle.xyz/',
				chainId: 5001,
				name: 'mantle',
			};
		}
		case '0x6DAB7981876a351A0b4E9A299ECD2F5c8462eDA6'.toLowerCase(): {
			return {
				vault: '0xFFc8B7feE0ad0Dc3e64b75ac85000aE28057f52A',
				rpc: 'https://rpc.testnet.mantle.xyz/',
				chainId: 59140,
				name: 'linea',
			};
		}
		default:
			return {
				vault: '0xB45966E75317c30610223ed5D26851a80C4F5420',
				rpc: 'https://rpc.testnet.mantle.xyz/',
				chainId: 5001,
				name: 'mantle',
			};
	}
}

async function task() {
	const id = Ed25519KeyIdentity.generate(new Uint8Array(fromHexString(process.env.SK!)));

	let intentActor: ActorSubclass<intentService>;
	intentActor =
		// getActor use idl types
		await getActor<intentService>(
			// use credential identity, owner of canister
			id,
			// use idlFactory from generated file
			intentIDL,
			// get canister ID for 'ins_wallet', `configs/ins_wallet.json` is generated
			process.env.ETH_TENTS!,
			// use icp-api.io as endpoint
			'https://icp-api.io'
		);
	const intents_every = await intentActor.get_all_intents([false]);

	if (intents_every.length > 0) {
		for (let i = 0; i < intents_every.length; i++) {
			const intent = intents_every[i];
			const intent_item = intent.intent_item;
			const user_address = intent.user_address;

			const { vault, rpc, chainId, name } = getVaultFromDaiContract(intent_item.tokenIn);

			const provider = new ethers.providers.StaticJsonRpcProvider({
				url: rpc,
				skipFetchSetup: true,
			});

			const { abi, bytecode } = contract;

			const vaultContract = new ethers.Contract(vault, abi, provider);

			const data = fromIntentItem(intent_item);

			console.log(data);

			const encodedData = vaultContract.interface.encodeFunctionData('executeBatch', [[data]]);

			const nonce = await provider.getTransactionCount('0xea8369fb765c5a99c732a529ba6e31edca263188');

			const balance = await provider.getBalance('0xea8369fb765c5a99c732a529ba6e31edca263188');
			console.log({ balance });
			console.log({ nonce });

			const signed = await intentActor.send_from_address({
				gas: [BigInt(2100000)],
				value: [],
				data: [Array.from(new Uint8Array(fromHexString(encodedData.replace('0x', ''))))],
				to_address: vault,
				address_info: {
					derived_path_hash: '0000000000000000000000000000000000000000000000000000000000003132',
					address_for: { Platform: null },
					key_name: 'test_key_1',
					order_id: '12',
					chain_type: { MANTLE: null },
					last_update: BigInt(1694446540812992769),
					address_string: 'ea8369fb765c5a99c732a529ba6e31edca263188',
				},
				chain_id: [BigInt(5001)],
				nonce: [BigInt(nonce)],
				sign_only: true,
				gas_price: [BigInt(10000000000)],
			});

			if (hasOwnProperty(signed, 'Ok')) {
				console.log({ signed: signed.Ok });
				const tx = await provider.sendTransaction(`0x${signed.Ok}`);
				console.log({ tx });
				await intentActor.update_intent_hash(intent.intent_id[0]!, tx.hash);
				await intentActor.finish_intent(intent.intent_id[0]!, true);
			} else {
				console.log(signed);
			}
		}
	}

	// const orders = await intentActor.list_unpaid_order();
	// console.log(orders.length);

	// if (orders.length > 0) {
	// 	console.log(orders.length);

	// 	for (let i = 0; i < orders.length; i++) {
	// 		const order = orders[i];
	// 		console.log(order.tx_info.order_id);
	// 		const balance = await provider.getBalance(order.payment_address[0]!);
	// 		const estimateGas = await provider.estimateGas({
	// 			to: order.payment_address[0]!,
	// 			data: Buffer.from(order.tx_info.data),
	// 		});

	// 		const gasPrice = await provider.getGasPrice();

	// 		console.log(balance.toString());
	// 		if (balance.gte(order.tx_info.price) && balance.gte(estimateGas.mul(gasPrice))) {
	// 			console.log('pay order');
	// 			const a = await intentActor.op_pay_order({
	// 				custom_gas: [estimateGas.toBigInt()],
	// 				order_id: order.tx_info.order_id,
	// 				overide_data: [],
	// 				custom_gas_price: [gasPrice.toBigInt()],
	// 			});
	// 			if (hasOwnProperty(a, 'Ok')) {
	// 				console.log('ok: ', a.Ok);
	// 				const receipt = await provider.getTransactionReceipt('0x' + a.Ok.tx_hash[0]!);
	// 				console.log({ receipt });
	// 			} else {
	// 				console.log('err: ', a.Err);
	// 			}
	// 		}
	// 	}
	// }
}

app.listen(3000, () => {
	console.log('application listening.....');
});
