import { Actor, ActorSubclass, HttpAgent, SignIdentity } from '@dfinity/agent';
import { InterfaceFactory } from '@dfinity/candid/lib/cjs/idl';
import { Principal } from '@dfinity/principal';

export interface CreateActorResult<T> {
	actor: ActorSubclass<T>;
	agent: HttpAgent;
}

export async function _createActor<T>(
	interfaceFactory: InterfaceFactory,
	canisterId: string,
	identity?: SignIdentity,
	host?: string
): Promise<CreateActorResult<T>> {
	let actualHost = host ?? 'http://127.0.0.1:8080' ?? 'https://icp-api.io';
	const agent = new HttpAgent({
		identity,
		host: actualHost,
	});
	// Only fetch the root key when we're not in prod
	if (actualHost !== 'https://icp-api.io') {
		await agent.fetchRootKey();
	}

	const actor = Actor.createActor<T>(interfaceFactory, {
		agent,
		canisterId: canisterId === '' ? Principal.fromText('aaaaa-aa') : canisterId,
	});
	return { actor, agent };
}

export const getActor = async <T>(
	signIdentity: SignIdentity,
	interfaceFactory: InterfaceFactory,
	canisterId: string,
	host?: string
): Promise<ActorSubclass<T>> => {
	const actor = await _createActor<T>(interfaceFactory, canisterId, signIdentity, host);

	return actor.actor;
};

export function hasOwnProperty<X extends Record<string, unknown>, Y extends PropertyKey>(
	obj: Record<string, unknown>,
	prop: Y
): obj is X & Record<Y, unknown> {
	return Object.prototype.hasOwnProperty.call(obj, prop);
}
