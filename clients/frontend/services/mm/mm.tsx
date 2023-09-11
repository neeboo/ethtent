'use client';
import { SignIdentity } from '@dfinity/agent';
import { FunctionComponent, ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { SiweMessage } from 'siwe';
import { _createActor, handleDelegation, requestDelegation, requestDelegation2 } from '../baseConnection';
import { DelegationChain, DelegationIdentity, isDelegationValid } from '@dfinity/identity';
import { idlFactory as metamaskIDL } from '../idls/eth_users.idl';
import { SignedDelegation, _SERVICE as metamaskService } from '../idls/eth_users';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { useWalletConnectClient } from '../walletConnect';
import { ethers } from 'ethers';
import { toHexString } from '@dfinity/candid';
// import { getProvider } from 'wagmi';
import { hasOwnProperty } from '../utils';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export const KEY_ICSTORAGE_KEY = 'mm-storage-key';
export const KEY_ICSTORAGE_IDENTITY = 'mm-storage-identity';
export interface UseMMAuth {
  address?: string;
  identity: SignIdentity | undefined;
  isConnected: boolean;
  isLoading: boolean;
  login: () => Promise<SignIdentity | void>;
  logout: () => Promise<void>;
}

export const MMAuthContext = createContext<UseMMAuth>({
  // wallet: "",
  address: undefined,
  identity: undefined,
  isConnected: false,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
});

interface MMAuthProps {
  children?: ReactNode;
}

export function useMMAuth(): UseMMAuth {
  return useContext(MMAuthContext);
}

const CONNECT_EVENT = 'eth_walletconnect';
// const canisterId = 'cqcgt-oaaaa-aaaah-admua-cai' // hardcoded
const canisterId = 'otw2r-2iaaa-aaaah-adnzq-cai'; // hardcoded

type RequestParams = {
  key: DelegationIdentity;
  sessionKey: Secp256k1KeyIdentity;
  actor: metamaskService;
  statement: string;
};

export const MMAuthProvider: FunctionComponent<MMAuthProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [identity, setIdentity] = useState<SignIdentity | undefined>();

  // const { web3Provider } = useWalletConnectClient();
  const { address, isConnected } = useAccount();

  const [conneted, setIsConnected] = useState(isConnected);
  const { connect, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const { signMessageAsync } = useSignMessage();

  const requestParamsRef = useRef<RequestParams | undefined>(undefined);

  console.log('MM======', identity);

  const initIdentity = (): DelegationIdentity | void => {
    try {
      const chainStorage = localStorage.getItem(KEY_ICSTORAGE_IDENTITY);
      const keyStorage = localStorage.getItem(KEY_ICSTORAGE_KEY);
      if (chainStorage && keyStorage) {
        const chain = DelegationChain.fromJSON(chainStorage);
        const key = Secp256k1KeyIdentity.fromJSON(keyStorage);
        // Verify that the delegation isn't expired.
        if (!isDelegationValid(chain)) {
          localStorage.removeItem(KEY_ICSTORAGE_IDENTITY);
          localStorage.removeItem(KEY_ICSTORAGE_KEY);
        } else {
          const identity = DelegationIdentity.fromDelegation(key, chain);
          setIdentity(identity);
          setIsConnected(true);
          console.log('delegation identity is :', identity.getPrincipal().toText());
          return identity;
        }
      }
    } catch (error) {
      localStorage.removeItem(KEY_ICSTORAGE_IDENTITY);
      localStorage.removeItem(KEY_ICSTORAGE_KEY);
      console.error(error);
    } finally {
      console.log('m3auth initialized finally');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!identity) {
      initIdentity();
    }
  }, [identity]);

  useEffect(() => {
    if (address && !identity) {
      providerInit();
    }
  }, [address, identity]);

  const providerInit = async () => {
    // console.log('provider', web3Provider);
    const { actor, statement, key, sessionKey } = requestParamsRef.current || {};

    console.log('address', address);
    if (!address || !actor || !statement) return;
    // const network = getNetwork();
    // Create SIWE message with pre-fetched nonce and sign with wallet
    const eip55Address = ethers.utils.getAddress(address);
    const message = new SiweMessage({
      domain: window.location.host,
      address: eip55Address,
      statement: statement,
      uri: window.location.origin,
      version: '1',
      chainId: 1,
    });
    const msg = message.prepareMessage();
    const hexMsg1 = toHexString(new TextEncoder().encode(msg));
    console.log('hexMsg1', hexMsg1);
    // const signature = await web3Provider.send('personal_sign', [hexMsg1, address]);
    const signature = await signMessageAsync({
      message: msg,
    });
    // console.log('signature', signature, getProvider());
    // console.log('signature', signature, getProvider())
    const session_key = Array.from(
      //@ts-ignore
      new Uint8Array(key.getPublicKey().toDer()),
    );
    const verifyParams = {
      signature: signature.replace('0x', ''),
      public_key: [] as [],
      session_key,
      formatted_message: msg,
      message: statement!,
      address: eip55Address,
      chain_type: { EVM: null },
    };
    console.log('verifyParams', verifyParams);
    const isVerify = await actor!.verifyMessage(verifyParams);

    if (hasOwnProperty(isVerify, 'Ok')) {
      console.log(isVerify.Ok);
      const { expiration, user_key } = isVerify.Ok;
      // setExpire(expiration);
      // setUserKey(user_key);
      const res = await actor!.getDelegation({
        session_key,
        targets: [],
        expiration: expiration,
        user_address: eip55Address,
      });
      if (res && hasOwnProperty(res, 'signed_delegation')) {
        const signed_delegation = res.signed_delegation as SignedDelegation;
        const targets = signed_delegation.delegation.targets.length > 0 ? signed_delegation.delegation.targets[0] : undefined;
        const s = {
          delegation: {
            pubkey: Uint8Array.from(signed_delegation.delegation.pubkey),
            expiration: BigInt(signed_delegation.delegation.expiration),
            targets: targets && targets.length > 0 ? targets : undefined,
          },
          signature: Uint8Array.from(signed_delegation.signature),
          userKey: user_key,
          timestamp: expiration,
        };
        const delegationResult = {
          kind: 'success',
          delegations: [s],
          userPublicKey: Uint8Array.from(s.userKey),
        };
        const delegationResult_final = await handleDelegation(delegationResult, key as SignIdentity);
        console.log('delegation identity is : ', delegationResult_final.delegationIdentity.getPrincipal().toText());
        console.log('should store delegation chain and session key to local storage or safe storage');
        //TODO:  set storage for delegation
        // setDelegationPrincipal(delegationResult_final.delegationIdentity.getPrincipal().toText());
        localStorage.setItem(KEY_ICSTORAGE_KEY, JSON.stringify(sessionKey));
        localStorage.setItem(KEY_ICSTORAGE_IDENTITY, JSON.stringify(delegationResult_final.delegationChain.toJSON()));
        setIdentity(delegationResult_final.delegationIdentity);
        setIsConnected(true);
        setIsLoading(false);
        // document.dispatchEvent(
        //   new CustomEvent(CONNECT_EVENT, {
        //     detail: null,
        //   }),
        // );
      } else {
        setIsLoading(false);
        throw new Error('No signed delegation found');
      }
    } else {
      console.log(isVerify.Err);
      // document.dispatchEvent(new CustomEvent(CONNECT_EVENT, { detail: null }));
      setIsLoading(false);
      throw new Error('Error verifying message');
    }
  };

  const login = async (): Promise<SignIdentity | void> => {
    console.log('login');
    return new Promise(async (resolve, reject) => {
      try {
        setIsLoading(true);
        const sessionKey = Secp256k1KeyIdentity.generate();
        const key = await requestDelegation2(sessionKey, {
          canisterId,
        });
        const { actor } = await _createActor<metamaskService>(metamaskIDL, canisterId, key, 'https://icp-api.io');
        const sm = await actor.secureMessage({ EVM: null }, true);
        let statement;
        console.log('sm', sm);
        if (hasOwnProperty(sm, 'Ok')) {
          console.log(sm.Ok);
          statement = sm.Ok;
        } else {
          console.log(sm.Err);
          setIsLoading(false);
          throw new Error(`${sm.Err}`);
        }
        await disconnectAsync();
        const provider = connect({ connector: connectors[0] });
        console.log({ provider });
        // connect('eip155:1');
        requestParamsRef.current = {
          key,
          sessionKey,
          actor,
          statement,
        };
        const identity = initIdentity();
        if (identity) {
          setIsLoading(false);
          resolve(identity);
        } else {
          setIsLoading(false);
          reject(undefined);
        }
      } catch (error) {
        console.error('mm login catch', error);
        setIsLoading(false);
        reject(error);
      }
    });
  };

  const logout = async () => {
    localStorage.removeItem(KEY_ICSTORAGE_IDENTITY);
    localStorage.removeItem(KEY_ICSTORAGE_KEY);
    setIdentity(undefined);
    setIsConnected(false);
    await disconnectAsync();
  };

  const contextProvider = {
    isConnected,
    identity,
    isLoading,
    login,
    logout,
    address,
  };
  return <MMAuthContext.Provider value={contextProvider}>{children}</MMAuthContext.Provider>;
};
