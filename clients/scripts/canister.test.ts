// Use Jest to test

import { idlFactory as intentsIDL, idlFactory as egoIDL } from '@/idls/eth_tents.idl';
import { _SERVICE as intentsService, _SERVICE as egoService, IntentItem } from '@/idls/eth_tents';
import { idlFactory as usersIDL } from '@/idls/eth_users.idl';
import { _SERVICE as usersService } from '@/idls/eth_users';
import { getCanisterId, getActor, identity, hasOwnProperty, fromHexString } from '@ego-js/utils';
import { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import crypto, { BinaryLike } from 'crypto';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import contract from './vault';

describe('eth_tents', () => {
  let intentsActor: ActorSubclass<intentsService>;
  let usersActor: ActorSubclass<usersService>;
  test('who am i', async () => {
    intentsActor =
      // getActor use idl types
      await getActor<intentsService>(
        // use credential identity, owner of canister
        identity(),
        // use idlFactory from generated file
        intentsIDL,
        // get canister ID for 'eth_tents', `configs/eth_tents.json` is generated
        getCanisterId('eth_tents')!,
      );

    usersActor = await getActor<usersService>(
      // use credential identity, owner of canister
      identity(),
      // use idlFactory from generated file
      usersIDL,
      // get canister ID for 'eth_tents', `configs/eth_tents.json` is generated
      getCanisterId('eth_users')!,
    );
  });

  test('init', async () => {
    const pid = (await intentsActor.whoAmI()).toText();
    const s = await usersActor.ensureSaltSet();

    const prefix = await usersActor.setLoginPrefix({ EVM: null }, 'You are logging in to ETHtents');

    console.log({ s, prefix });

    expect(pid).toBe(identity().getPrincipal().toText());
  });
  test.skip('create wallets', async () => {
    let mantleWalet, lineaWallet, maticWallet;
    const mantle_wallet = await intentsActor.wallet_get_address_for_platform({
      platform_uuid: '12',
      key_name: 'test_key_1',
      chain_type: { MANTLE: null },
    });
    if (hasOwnProperty(mantle_wallet, 'Ok')) {
      mantleWalet = mantle_wallet.Ok;
    }

    const linea_wallet = await intentsActor.wallet_get_address_for_platform({
      platform_uuid: '12',
      key_name: 'test_key_1',
      chain_type: { LINEA: null },
    });
    if (hasOwnProperty(linea_wallet, 'Ok')) {
      lineaWallet = linea_wallet.Ok;
    }
    const matic_wallet = await intentsActor.wallet_get_address_for_platform({
      platform_uuid: '12',
      key_name: 'test_key_1',
      chain_type: { MATIC: null },
    });
    if (hasOwnProperty(matic_wallet, 'Ok')) {
      maticWallet = matic_wallet.Ok;
    }

    console.log({
      lineaWallet,
      mantleWalet,
      maticWallet,
    });
  });
  test.skip('create intent and save', async () => {
    const added = await intentsActor.add_user_intent({
      is_finished: false,
      user_address: '0x123',
      intent_item: {
        num: BigInt(3),
        tokenIn: '0xDDD657ebc496DDB74Fb96F21C861bd9A1807f68e',
        intender: '0xD59d0eB6CB13664d9A68df6F46BA75430d400f55',
        tokenOut: '0x2c852e740b62308c46dd29b982fbb650d063bd07',
        feeRate: BigInt(30),
        recipient: '0xD59d0eB6CB13664d9A68df6F46BA75430d400f55',
        taskId: BigInt(0),
        signatureHash: '0x',
        expiration: BigInt(1694496830),
        order_detail: [],
        to_chain_id: BigInt(0),
        tokenOutSymbol: 'aUSDC',
        destinationChain: 'ethereum-2',
        amount: BigInt(5000000),
        intent_id: [],
      },
      intent_id: [],
      tx_hash: [],
    });
    console.log({ added });
  });

  test('get user intents', async () => {
    const intent = await intentsActor.get_user_intent('0x123');
    console.log({
      intent: intent.map(e => e.intent_item),
    });

    const intents_every = await intentsActor.get_all_intents([false]);
    console.log({ intents_every: intents_every.map(e => e.intent_item) });

    for (let i = 0; i < intents_every.length; i++) {
      const s = await intentsActor.finish_intent(intents_every[i].intent_id[0]!, true);
      const s2 = await intentsActor.get_intent_by_id(intents_every[i].intent_id[0]!);
      console.log({
        s,
        s2,
      });
    }

    // await intentsActor.remove_user_intent_by_id(intents_every[0].intent_id[0]!);

    // console.log(intents_every[0].intent_item);

    // const { abi, bytecode } = contract;

    // const vault = '0xB45966E75317c30610223ed5D26851a80C4F5420';

    // const provider = new ethers.providers.StaticJsonRpcProvider({
    //   url: 'https://rpc.testnet.mantle.xyz/',

    //   skipFetchSetup: true,
    // });

    // const vaultContract = new ethers.Contract(vault, abi, provider);

    // const data = fromIntentItem2(intents_every[intents_every.length - 1].intent_item);
    // console.log(data['amount'].toString());

    // const encodedData = vaultContract.interface.encodeFunctionData('executedBatch', [[data]]);

    // const nonce = await provider.getTransactionCount('0xea8369fb765c5a99c732a529ba6e31edca263188');

    // const balance = await provider.getBalance('0xea8369fb765c5a99c732a529ba6e31edca263188');
    // console.log({ balance });
    // console.log({ nonce });

    // const signed = await intentsActor.send_from_address({
    //   gas: [BigInt(2100000)],
    //   value: [],
    //   data: [Array.from(new Uint8Array(fromHexString(encodedData.replace('0x', ''))))],
    //   to_address: vault,
    //   address_info: {
    //     derived_path_hash: '0000000000000000000000000000000000000000000000000000000000003132',
    //     address_for: { Platform: null },
    //     key_name: 'test_key_1',
    //     order_id: '12',
    //     chain_type: { MANTLE: null },
    //     last_update: BigInt(1694446540812992769),
    //     address_string: 'ea8369fb765c5a99c732a529ba6e31edca263188',
    //   },
    //   chain_id: [BigInt(5001)],
    //   nonce: [BigInt(nonce)],
    //   sign_only: true,
    //   gas_price: [BigInt(10000000000)],
    // });

    // if (hasOwnProperty(signed, 'Ok')) {
    //   console.log({ signed: signed.Ok });
    //   const tx = await provider.sendTransaction(`0x${signed.Ok}`);
    //   console.log({ tx });
    // } else {
    //   console.log(signed);
    // }
  });
});

export function fromIntentItem(item: IntentItem): Array<any> {
  return [
    item.intender,
    item.destinationChain,
    item.recipient,
    item.tokenOutSymbol,
    item.tokenIn,
    item.tokenOut,
    item.amount,
    item.num,
    item.feeRate,
    item.expiration,
    item.taskId,
    item.signatureHash,
  ];
}

function fromIntentItem2(item: IntentItem): Record<string, any> {
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

// {
//   lineaWallet: {
//     derived_path_hash: '0000000000000000000000000000000000000000000000000000000000003132',
//     address_for: { Platform: null },
//     key_name: 'test_key_1',
//     order_id: '12',
//     chain_type: { LINEA: null },
//     last_update: 1694446548927416081n,
//     address_string: 'ea8369fb765c5a99c732a529ba6e31edca263188'
//   },
//   mantleWalet: {
//     derived_path_hash: '0000000000000000000000000000000000000000000000000000000000003132',
//     address_for: { Platform: null },
//     key_name: 'test_key_1',
//     order_id: '12',
//     chain_type: { MANTLE: null },
//     last_update: 1694446540812992769n,
//     address_string: 'ea8369fb765c5a99c732a529ba6e31edca263188'
//   },
//   maticWallet: {
//     derived_path_hash: '0000000000000000000000000000000000000000000000000000000000003132',
//     address_for: { Platform: null },
//     key_name: 'test_key_1',
//     order_id: '12',
//     chain_type: { MATIC: null },
//     last_update: 1694446558897292725n,
//     address_string: 'ea8369fb765c5a99c732a529ba6e31edca263188'
//   }
// }

// (0xd59d0eb6cb13664d9a68df6f46ba75430d400f55,ethereum-2,0xD59d0eB6CB13664d9A68df6F46BA75430d400f55,aUSDC,0x99f3eb619d84337070f41d15b95a2dffad76f550,0x254d06f33bdc5b8ee05b2ea472107e300226659a,100000000000000000,10,30,1695496830,1,0x),
// (0xe0aab758f0c7eca6c0e429e41c41ee7733354d8f,ethereum-2,0xE0Aab758f0c7ecA6C0e429E41C41ee7733354D8F,aUSDC,0x99f3eb619d84337070f41d15b95a2dffad76f550,0x254d06f33bdc5b8ee05b2ea472107e300226659a,5000000,0,30,1695464172605,0,0x)
