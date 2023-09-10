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
