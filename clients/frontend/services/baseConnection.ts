import { Actor, ActorSubclass, DerEncodedPublicKey, HttpAgent, Signature, SignIdentity } from '@dfinity/agent';
// import { blobFromUint8Array, derBlobFromBlob } from '@dfinity/candid';
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl';
import { Delegation, DelegationChain, DelegationIdentity, Ed25519KeyIdentity } from '@dfinity/identity';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { Principal } from '@dfinity/principal';

export interface CreateActorResult<T> {
  actor: ActorSubclass<T>;
  agent: HttpAgent;
}

export function createConnection<T>(
  delegationIdentity: DelegationIdentity,
  canisterId: string,
  interfaceFactory: InterfaceFactory,
  actor?: ActorSubclass<T>,
  agent?: HttpAgent,
): BaseConnection<T> {
  return new BaseConnection<T>(delegationIdentity, canisterId, interfaceFactory, actor, agent);
}

export const requestDelegation = async (
  identity: SignIdentity,
  { canisterId, date }: { canisterId?: string; date?: Date },
): Promise<DelegationIdentity> => {
  const sessionKey = Ed25519KeyIdentity.generate();
  const chain = await DelegationChain.create(identity, sessionKey.getPublicKey(), date || new Date(Date.parse('2100-01-01')), {
    targets: canisterId != undefined ? [Principal.fromText(canisterId)] : undefined,
  });

  return DelegationIdentity.fromDelegation(sessionKey, chain);
};

export const requestDelegation2 = async (
  identity: SignIdentity,
  { canisterId, date }: { canisterId?: string; date?: Date },
): Promise<DelegationIdentity> => {
  const sessionKey = Secp256k1KeyIdentity.generate();
  const chain = await DelegationChain.create(identity, sessionKey.getPublicKey(), date || new Date(Date.parse('2100-01-01')), {
    targets: canisterId != undefined ? [Principal.fromText(canisterId)] : undefined,
  });

  return DelegationIdentity.fromDelegation(sessionKey, chain);
};

export async function _createActor<T>(
  interfaceFactory: InterfaceFactory,
  canisterId: string,
  identity?: SignIdentity,
  host?: string,
): Promise<CreateActorResult<T>> {
  const agent = new HttpAgent({
    identity,
    host: host ? host : process.env.NODE_ENV === 'development' ? process.env.IC_HOST : process.env.IC_HOST,
  });
  // Only fetch the root key when we're not in prod
  // if (process.env.NODE_ENV === 'development') {
  //   await agent.fetchRootKey();
  // }
  const actor = Actor.createActor<T>(interfaceFactory, {
    agent,
    canisterId,
  });
  return { actor, agent };
}

export interface AbstractConnection<T> {
  delegationIdentity: SignIdentity;
  actor?: ActorSubclass<T>;
  agent?: HttpAgent;
  canisterId?: string;
  getActor(): Promise<ActorSubclass<T>>;
}

export class BaseConnection<T> implements AbstractConnection<T> {
  constructor(
    public delegationIdentity: SignIdentity,
    public canisterId: string,
    public interfaceFactory: InterfaceFactory,
    public actor?: ActorSubclass<T>,
    public agent?: HttpAgent,
  ) {}
  async getActor(): Promise<ActorSubclass<T>> {
    throw new Error('Method not implemented.');
  }

  protected async _getActor(canisterId: string, interfaceFactory: InterfaceFactory, date?: Date): Promise<ActorSubclass<T>> {
    // for (const { delegation } of this.delegationIdentity.getDelegation().delegations) {
    //   // prettier-ignore
    //   if (+new Date(Number(delegation.expiration / BigInt(1000000))) <= +Date.now()) {
    //     this.actor = undefined;
    //     break;
    //   }
    // }
    if (this.actor === undefined) {
      this.actor = (await _createActor<T>(interfaceFactory, this.canisterId ?? canisterId, this.delegationIdentity)).actor as ActorSubclass<T>;
    }
    return this.actor;
  }
}

export interface IIDelegationResult {
  delegation: {
    pubkey: Uint8Array;
    expiration: bigint;
    targets?: Principal[] | string[];
  };
  signature: Uint8Array;
}

export interface DelegationMessage {
  kind: string;
  delegations: IIDelegationResult[];
  userPublicKey: Uint8Array;
}

export interface DelegationResult {
  delegationIdentity: DelegationIdentity;
  delegationChain: DelegationChain;
}

export async function handleDelegation(message: DelegationMessage, key: SignIdentity): Promise<DelegationResult> {
  const delegations = message.delegations.map(signedDelegation => {
    return {
      delegation: new Delegation(
        signedDelegation.delegation.pubkey,
        signedDelegation.delegation.expiration,
        signedDelegation.delegation.targets as Principal[],
      ),
      signature: signedDelegation.signature.buffer as Signature,
    };
  });

  const delegationChain = DelegationChain.fromDelegations(delegations, message.userPublicKey.buffer as DerEncodedPublicKey);
  return {
    delegationChain,
    delegationIdentity: DelegationIdentity.fromDelegation(key, delegationChain),
  };
}

export const executeWithLogging = async <T>(func: () => Promise<T>): Promise<T> => {
  try {
    return await func();
  } catch (e) {
    console.log(e);
    throw e;
  }
};
