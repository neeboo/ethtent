"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _eth_tentsidl = require("./idls/eth_tents.idl");
const _identity = require("@dfinity/identity");
const _ethers = require("ethers");
const _lib = require("./lib");
const _candid = require("@dfinity/candid");
const _vault = _interop_require_default(require("./vault"));
const _express = _interop_require_default(require("express"));
const _nodecron = _interop_require_default(require("node-cron"));
const _utils = require("ethers/lib/utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const config = {
    rpc_endpoint: 'https://rpc.testnet.mantle.xyz/'
};
const app = (0, _express.default)();
_nodecron.default.schedule('*/1 * * * *', async function() {
    console.log('---------------------');
    console.log('running a task every 30 seconds');
    await task();
});
function fromIntentItem(item) {
    console.log((0, _utils.parseEther)('1.0'));
    return [
        `0x${item.intender.replace('0x', '')}`,
        item.destinationChain,
        `0x${item.recipient.replace('0x', '')}`,
        item.tokenOutSymbol,
        `0x${item.tokenIn.replace('0x', '')}`,
        `0x${item.tokenOut.replace('0x', '')}`,
        (0, _utils.parseEther)(item.amount.toString()),
        (0, _utils.parseEther)(item.num.toString()),
        (0, _utils.parseEther)(item.feeRate.toString()),
        (0, _utils.parseEther)(item.expiration.toString()),
        (0, _utils.parseEther)(item.taskId.toString()),
        item.signatureHash
    ];
}
async function task() {
    const id = _identity.Ed25519KeyIdentity.generate(new Uint8Array((0, _candid.fromHexString)(process.env.SK)));
    const provider = new _ethers.ethers.providers.StaticJsonRpcProvider({
        url: config.rpc_endpoint,
        skipFetchSetup: true
    });
    let intentActor;
    intentActor = await (0, _lib.getActor)(id, _eth_tentsidl.idlFactory, process.env.ETH_TENTS, 'https://icp-api.io');
    const intents_every = await intentActor.get_all_intents([
        false
    ]);
    console.log({
        intents_every: intents_every.map((e)=>e.intent_item)
    });
    const vault = '0xB45966E75317c30610223ed5D26851a80C4F5420';
    if (intents_every.length > 0) {
        for(let i = 0; i < intents_every.length; i++){
            const intent = intents_every[i];
            const intent_item = intent.intent_item;
            const user_address = intent.user_address;
            const { abi, bytecode } = _vault.default;
            const vaultContract = new _ethers.ethers.Contract(vault, abi, provider);
            const data = fromIntentItem(intent_item);
            console.log(data);
            const encodedData = vaultContract.interface.encodeFunctionData('executeBatch', [
                data
            ]);
            console.log(encodedData);
        }
    }
}
app.listen(3000, ()=>{
    console.log('application listening.....');
});
