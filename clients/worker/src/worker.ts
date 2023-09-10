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

import { idlFactory as insManagerIDL } from './idls/ins_manager.idl';
import { _SERVICE as insManagerService } from './idls/ins_manager';
// import { getCanisterId, getActor, identity, hasOwnProperty } from '@ego-js/utils';
import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { ethers } from 'ethers';
import { getActor, hasOwnProperty } from './lib';
import { fromHexString } from '@dfinity/candid';

import express from 'express';
import cron from 'node-cron';

const config = {
	rpc_endpoint: 'https://eth-mainnet.g.alchemy.com/v2/_iDI10Kts6my6A2_rI8LTVnwcR4nOiNE', //'https://41bc-219-137-141-232.ngrok-free.app',
};

const app = express();

cron.schedule('*/1 * * * *', async function () {
	console.log('---------------------');
	console.log('running a task every 30 seconds');
	await task();
});

async function task() {
	const id = Ed25519KeyIdentity.generate(new Uint8Array(fromHexString('2e1278ea649a89520c6ae48154f49c88552a758975cad29e1fc828de24335500')));
	const provider = new ethers.providers.StaticJsonRpcProvider({
		url: config.rpc_endpoint,
		skipFetchSetup: true,
	});
	let insManagerActor: ActorSubclass<insManagerService>;
	insManagerActor =
		// getActor use idl types
		await getActor<insManagerService>(
			// use credential identity, owner of canister
			id,
			// use idlFactory from generated file
			insManagerIDL,
			// get canister ID for 'ins_wallet', `configs/ins_wallet.json` is generated
			'd2a3p-byaaa-aaaap-abefa-cai',
			// use icp-api.io as endpoint
			'https://icp-api.io'
		);

	const orders = await insManagerActor.list_unpaid_order();
	console.log(orders.length);

	if (orders.length > 0) {
		console.log(orders.length);

		for (let i = 0; i < orders.length; i++) {
			const order = orders[i];
			console.log(order.tx_info.order_id);
			const balance = await provider.getBalance(order.payment_address[0]!);
			const estimateGas = await provider.estimateGas({
				to: order.payment_address[0]!,
				data: Buffer.from(order.tx_info.data),
			});

			const gasPrice = await provider.getGasPrice();

			console.log(balance.toString());
			if (balance.gte(order.tx_info.price) && balance.gte(estimateGas.mul(gasPrice))) {
				console.log('pay order');
				const a = await insManagerActor.op_pay_order({
					custom_gas: [estimateGas.toBigInt()],
					order_id: order.tx_info.order_id,
					overide_data: [],
					custom_gas_price: [gasPrice.toBigInt()],
				});
				if (hasOwnProperty(a, 'Ok')) {
					console.log('ok: ', a.Ok);
					const receipt = await provider.getTransactionReceipt('0x' + a.Ok.tx_hash[0]!);
					console.log({ receipt });
				} else {
					console.log('err: ', a.Err);
				}
			}
		}
	}
}

app.listen(3000, () => {
	console.log('application listening.....');
});
