// Use Jest to test

import { idlFactory as exampleIDL, idlFactory as egoIDL } from '@/idls/eth_tents.idl';
import { _SERVICE as exampleService, _SERVICE as egoService } from '@/idls/eth_tents';
import { getCanisterId, getActor, identity } from '@ego-js/utils';
import { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import crypto, { BinaryLike } from 'crypto';

describe('eth_tents', () => {
  let exampleActor: ActorSubclass<exampleService>;
  test('who am i', async () => {
    exampleActor =
      // getActor use idl types
      await getActor<exampleService>(
        // use credential identity, owner of canister
        identity(),
        // use idlFactory from generated file
        exampleIDL,
        // get canister ID for 'eth_tents', `configs/eth_tents.json` is generated
        getCanisterId('eth_tents')!,
      );
    const pid = (await exampleActor.whoAmI()).toText();

    let id2 = Secp256k1KeyIdentity.generate();
    let actor2 = await getActor<exampleService>(
      // use credential identity, owner of canister
      id2,
      // use idlFactory from generated file
      exampleIDL,
      // get canister ID for 'eth_tents', `configs/eth_tents.json` is generated
      getCanisterId('eth_tents')!,
    );

    expect(pid).toBe(identity().getPrincipal().toText());
  });
});
test('state test', async () => {
  const actor =
    // getActor use idl types
    await getActor<egoService>(
      // use credential identity, owner of canister
      identity(),
      // use idlFactory from generated file
      egoIDL,
      // get canister ID for 'ego_deployer', `configs/ego_deployer.json` is generated
      getCanisterId('eth_tents')!,
    );

  const resutl1 = await actor.ego_canister_list();
  console.log(resutl1);

  await actor.ego_canister_add('ego_store', Principal.fromText('2222s-4iaaa-aaaaf-ax2uq-cai'));

  const resutl2 = await actor.ego_canister_list();
  console.log(resutl2);
});

describe('btree test', () => {
  test('btree test', async () => {
    const actor =
      // getActor use idl types
      await getActor<egoService>(
        // use credential identity, owner of canister
        identity(),
        // use idlFactory from generated file
        egoIDL,
        // get canister ID for 'ego_deployer', `configs/ego_deployer.json` is generated
        getCanisterId('eth_tents')!,
      );

    await actor.insert_user(6, 'user_6');
    await actor.insert_wallet(6, 10);

    await debug_info(actor);

    await actor.insert_user(7, 'user_7');
    await actor.insert_wallet(7, 20);

    await debug_info(actor);
  });
});

const debug_info = async (actor: ActorSubclass<exampleService>) => {
  const result1 = await actor.get_all_users();
  console.log(result1);

  const result2 = await actor.get_all_wallets();
  console.log(result2);
};
