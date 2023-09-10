// Use Jest to test

import { idlFactory as intentsIDL, idlFactory as egoIDL } from '@/idls/eth_tents.idl';
import { _SERVICE as intentsService, _SERVICE as egoService } from '@/idls/eth_tents';
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
    const pid = (await intentsActor.whoAmI()).toText();

    usersActor = await getActor<usersService>(
      // use credential identity, owner of canister
      identity(),
      // use idlFactory from generated file
      usersIDL,
      // get canister ID for 'eth_tents', `configs/eth_tents.json` is generated
      getCanisterId('eth_users')!,
    );

    const s = await usersActor.ensureSaltSet();

    const prefix = await usersActor.setLoginPrefix({ EVM: null }, 'You are logging in to ETHtents');

    console.log({ s, prefix });

    expect(pid).toBe(identity().getPrincipal().toText());
  });
});
