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

function fromIntentItem(item: IntentItem): Array<any> {
	console.log(parseEther('1.0'));
	return [
		`0x${item.intender.replace('0x', '')}`,
		item.destinationChain,
		`0x${item.recipient.replace('0x', '')}`,
		item.tokenOutSymbol,
		`0x${item.tokenIn.replace('0x', '')}`,
		`0x${item.tokenOut.replace('0x', '')}`,
		parseEther(item.amount.toString()),
		parseEther(item.num.toString()),
		parseEther(item.feeRate.toString()),
		parseEther(item.expiration.toString()),
		parseEther(item.taskId.toString()),
		item.signatureHash,
	];
}

async function task() {
	const id = Ed25519KeyIdentity.generate(new Uint8Array(fromHexString(process.env.SK!)));
	const provider = new ethers.providers.StaticJsonRpcProvider({
		url: config.rpc_endpoint,
		skipFetchSetup: true,
	});
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
	console.log({ intents_every: intents_every.map((e) => e.intent_item) });
	const vault = '0xB45966E75317c30610223ed5D26851a80C4F5420';
	// const bytecode =

	if (intents_every.length > 0) {
		for (let i = 0; i < intents_every.length; i++) {
			const intent = intents_every[i];
			const intent_item = intent.intent_item;
			const user_address = intent.user_address;

			const { abi, bytecode } = contract;

			const vaultContract = new ethers.Contract(vault, abi, provider);

			const data = fromIntentItem(intent_item);

			console.log(data);

			const encodedData = vaultContract.interface.encodeFunctionData('executeBatch', [data]);

			console.log(encodedData);

			// const balance = await provider.getBalance(order.payment_address[0]!);
			// const estimateGas = await provider.estimateGas({
			// 	to: vault,
			// 	data: Buffer.from(order.tx_info.data),
			// });
			// intentActor.send_from_address({
			// 	gas: [] | [bigint],
			// 	value: [] | [bigint],
			// 	data: [] | [Array<number>],
			// 	to_address: string,
			// 	address_info: AddressInfo,
			// 	chain_id: [] | [bigint],
			// 	nonce: [] | [bigint],
			// 	sign_only: boolean,
			// 	gas_price: [] | [bigint],
			// });
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
