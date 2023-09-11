// Use Jest to test

import { idlFactory as intentsIDL, idlFactory as egoIDL } from '@/idls/eth_tents.idl';
import { _SERVICE as intentsService, _SERVICE as egoService, IntentItem } from '@/idls/eth_tents';
import { idlFactory as usersIDL } from '@/idls/eth_users.idl';
import { _SERVICE as usersService } from '@/idls/eth_users';
import { getCanisterId, getActor, identity, hasOwnProperty } from '@ego-js/utils';
import { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import crypto, { BinaryLike } from 'crypto';

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
  test('create wallets', async () => {
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
