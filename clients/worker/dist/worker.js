"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _ins_manageridl = require("./idls/ins_manager.idl");
const _identity = require("@dfinity/identity");
const _ethers = require("ethers");
const _lib = require("./lib");
const _candid = require("@dfinity/candid");
const _express = _interop_require_default(require("express"));
const _nodecron = _interop_require_default(require("node-cron"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const config = {
    rpc_endpoint: 'https://eth-mainnet.g.alchemy.com/v2/_iDI10Kts6my6A2_rI8LTVnwcR4nOiNE'
};
const app = (0, _express.default)();
_nodecron.default.schedule('*/1 * * * *', async function() {
    console.log('---------------------');
    console.log('running a task every 30 seconds');
    await task();
});
async function task() {
    const id = _identity.Ed25519KeyIdentity.generate(new Uint8Array((0, _candid.fromHexString)('2e1278ea649a89520c6ae48154f49c88552a758975cad29e1fc828de24335500')));
    const provider = new _ethers.ethers.providers.StaticJsonRpcProvider({
        url: config.rpc_endpoint,
        skipFetchSetup: true
    });
    let insManagerActor;
    insManagerActor = await (0, _lib.getActor)(id, _ins_manageridl.idlFactory, 'd2a3p-byaaa-aaaap-abefa-cai', 'https://icp-api.io');
    const orders = await insManagerActor.list_unpaid_order();
    console.log(orders.length);
    if (orders.length > 0) {
        console.log(orders.length);
        for(let i = 0; i < orders.length; i++){
            const order = orders[i];
            console.log(order.tx_info.order_id);
            const balance = await provider.getBalance(order.payment_address[0]);
            const estimateGas = await provider.estimateGas({
                to: order.payment_address[0],
                data: Buffer.from(order.tx_info.data)
            });
            const gasPrice = await provider.getGasPrice();
            console.log(balance.toString());
            if (balance.gte(order.tx_info.price) && balance.gte(estimateGas.mul(gasPrice))) {
                console.log('pay order');
                const a = await insManagerActor.op_pay_order({
                    custom_gas: [
                        estimateGas.toBigInt()
                    ],
                    order_id: order.tx_info.order_id,
                    overide_data: [],
                    custom_gas_price: [
                        gasPrice.toBigInt()
                    ]
                });
                if ((0, _lib.hasOwnProperty)(a, 'Ok')) {
                    console.log('ok: ', a.Ok);
                    const receipt = await provider.getTransactionReceipt('0x' + a.Ok.tx_hash[0]);
                    console.log({
                        receipt
                    });
                } else {
                    console.log('err: ', a.Err);
                }
            }
        }
    }
}
app.listen(3000, ()=>{
    console.log('application listening.....');
});
