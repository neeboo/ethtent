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
function fromIntentItem(item, amount) {
    return {
        intender: `0x${item.intender.replace('0x', '')}`,
        destinationChain: item.destinationChain,
        recipient: `0x${item.recipient.replace('0x', '')}`,
        tokenOutSymbol: item.tokenOutSymbol,
        tokenIn: `0x${item.tokenIn.replace('0x', '')}`,
        tokenOut: `0x${item.tokenOut.replace('0x', '')}`,
        amount: _ethers.ethers.utils.parseUnits(amount ? amount.toString() : item.amount.toString(), 'wei'),
        num: _ethers.ethers.utils.parseUnits(item.num == BigInt(0) ? '1' : item.num.toString(), 'wei'),
        feeRate: _ethers.ethers.utils.parseUnits(item.feeRate.toString(), 'wei'),
        expiration: _ethers.ethers.utils.parseUnits((Math.ceil(Date.now() / 1000) + 1 * 3600 * 24).toString(), 'wei'),
        taskId: _ethers.ethers.utils.parseUnits(item.taskId.toString(), 'wei'),
        signatureHash: item.signatureHash
    };
}
function getVaultFromDaiContract(addr) {
    switch(addr.toLowerCase()){
        case '0xDDD657ebc496DDB74Fb96F21C861bd9A1807f68e'.toLowerCase():
            {
                return {
                    vault: '0x3Fe2f27E3831eF836137A38e7895B6DdB48E4D1C',
                    rpc: 'https://rpc.ankr.com/polygon_mumbai',
                    chainId: 80001,
                    name: 'polygon',
                    explorer: 'https://mumbai.polygonscan.com/tx/',
                    chain: {
                        MATIC: null
                    }
                };
            }
        case '0x99f3eB619d84337070f41D15b95A2Dffad76F550'.toLowerCase():
            {
                return {
                    vault: '0xB45966E75317c30610223ed5D26851a80C4F5420',
                    rpc: 'https://rpc.testnet.mantle.xyz/',
                    chainId: 5001,
                    name: 'mantle',
                    explorer: 'https://explorer.testnet.mantle.xyz/tx/',
                    chain: {
                        MANTLE: null
                    }
                };
            }
        case '0x6DAB7981876a351A0b4E9A299ECD2F5c8462eDA6'.toLowerCase():
            {
                return {
                    vault: '0xFFc8B7feE0ad0Dc3e64b75ac85000aE28057f52A',
                    rpc: 'https://rpc.goerli.linea.build/',
                    chainId: 59140,
                    name: 'linea',
                    explorer: 'https://explorer.goerli.linea.build/tx/',
                    chain: {
                        LINEA: null
                    }
                };
            }
        default:
            return {
                vault: '0xB45966E75317c30610223ed5D26851a80C4F5420',
                rpc: 'https://rpc.testnet.mantle.xyz/',
                chainId: 5001,
                name: 'mantle',
                explorer: 'https://explorer.testnet.mantle.xyz/tx/',
                chain: {
                    LINEA: null
                }
            };
    }
}
async function task() {
    const id = _identity.Ed25519KeyIdentity.generate(new Uint8Array((0, _candid.fromHexString)(process.env.SK)));
    let intentActor;
    intentActor = await (0, _lib.getActor)(id, _eth_tentsidl.idlFactory, process.env.ETH_TENTS, 'https://icp-api.io');
    const intents_every = await intentActor.get_all_intents([
        false
    ]);
    console.log(intents_every.length);
    if (intents_every.length > 0) {
        for(let i = 0; i < intents_every.length; i++){
            const intent = intents_every[i];
            const intent_item = intent.intent_item;
            const user_address = intent.user_address;
            const { vault, rpc, chainId, name, chain } = getVaultFromDaiContract(intent_item.tokenIn);
            const provider = new _ethers.ethers.providers.StaticJsonRpcProvider({
                url: rpc,
                skipFetchSetup: true
            });
            const { abi, bytecode } = _vault.default;
            const vaultContract = new _ethers.ethers.Contract(vault, abi, provider);
            const data = fromIntentItem(intent_item, chainId === 80001 ? intent_item.amount / BigInt(1000000000000) : undefined);
            console.log(data);
            const encodedData = vaultContract.interface.encodeFunctionData('executedBatch', [
                [
                    data
                ]
            ]);
            const nonce = await provider.getTransactionCount('0xea8369fb765c5a99c732a529ba6e31edca263188');
            const balance = await provider.getBalance('0xea8369fb765c5a99c732a529ba6e31edca263188');
            console.log({
                balance
            });
            console.log({
                nonce
            });
            const estimateGas = await provider.estimateGas({});
            console.log(estimateGas.toString());
            const gasPrice = await provider.getGasPrice();
            console.log(gasPrice.toString());
            const signed = await intentActor.send_from_address({
                gas: [
                    BigInt(10000000)
                ],
                value: [],
                data: [
                    Array.from(new Uint8Array((0, _candid.fromHexString)(encodedData.replace('0x', ''))))
                ],
                to_address: vault,
                address_info: {
                    derived_path_hash: '0000000000000000000000000000000000000000000000000000000000003132',
                    address_for: {
                        Platform: null
                    },
                    key_name: 'test_key_1',
                    order_id: '12',
                    chain_type: chain,
                    last_update: BigInt(1694446540812992769),
                    address_string: 'ea8369fb765c5a99c732a529ba6e31edca263188'
                },
                chain_id: [
                    BigInt(chainId)
                ],
                nonce: [
                    BigInt(nonce)
                ],
                sign_only: true,
                gas_price: [
                    BigInt(30000000000)
                ]
            });
            if ((0, _lib.hasOwnProperty)(signed, 'Ok')) {
                console.log({
                    signed: signed.Ok
                });
                const tx = await provider.sendTransaction(`0x${signed.Ok}`);
                console.log({
                    tx
                });
                await intentActor.update_intent_hash(intent.intent_id[0], tx.hash);
                await intentActor.finish_intent(intent.intent_id[0], true);
            } else {
                console.log(signed);
            }
        }
    }
}
app.listen(3000, ()=>{
    console.log('application listening.....');
});
