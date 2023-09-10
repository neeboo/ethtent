import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AppInfo {
  'app_id' : string,
  'current_version' : Version,
  'latest_version' : Version,
  'wallet_id' : [] | [Principal],
}
export type ChainType = { 'BTC' : null } |
  { 'EVM' : null };
export interface Delegation {
  'pubkey' : Array<number>,
  'targets' : [] | [Array<Principal>],
  'expiration' : bigint,
}
export interface GetDelegationRequest {
  'session_key' : Array<number>,
  'targets' : [] | [Array<Principal>],
  'expiration' : bigint,
  'user_address' : string,
}
export type GetDelegationResponse = { 'no_such_delegation' : null } |
  { 'signed_delegation' : SignedDelegation };
export interface LogEntry { 'ts' : bigint, 'msg' : string, 'kind' : string }
export interface PrepareDelegationResponse {
  'user_key' : Array<number>,
  'expiration' : bigint,
}
export type Result = { 'Ok' : AppInfo } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : Array<[string, Array<Principal>]> } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : Array<LogEntry> } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : [] | [Array<[Principal, string]>] } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : PrepareDelegationResponse } |
  { 'Err' : string };
export interface SignedDelegation {
  'signature' : Array<number>,
  'delegation' : Delegation,
}
export interface VerifyMessagePayload {
  'signature' : string,
  'public_key' : [] | [string],
  'session_key' : Array<number>,
  'formatted_message' : string,
  'message' : string,
  'address' : string,
  'chain_type' : ChainType,
}
export interface Version {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export interface _SERVICE {
  'ego_app_info_get' : ActorMethod<[], Result>,
  'ego_app_info_update' : ActorMethod<
    [[] | [Principal], string, Version],
    undefined,
  >,
  'ego_app_version_check' : ActorMethod<[], Result>,
  'ego_canister_add' : ActorMethod<[string, Principal], Result_1>,
  'ego_canister_delete' : ActorMethod<[], Result_1>,
  'ego_canister_list' : ActorMethod<[], Result_2>,
  'ego_canister_remove' : ActorMethod<[string, Principal], Result_1>,
  'ego_canister_track' : ActorMethod<[], Result_1>,
  'ego_canister_untrack' : ActorMethod<[], Result_1>,
  'ego_canister_upgrade' : ActorMethod<[], Result_1>,
  'ego_controller_add' : ActorMethod<[Principal], Result_1>,
  'ego_controller_remove' : ActorMethod<[Principal], Result_1>,
  'ego_controller_set' : ActorMethod<[Array<Principal>], Result_1>,
  'ego_is_op' : ActorMethod<[], Result_3>,
  'ego_is_owner' : ActorMethod<[], Result_3>,
  'ego_is_user' : ActorMethod<[], Result_3>,
  'ego_log_list' : ActorMethod<[bigint], Result_4>,
  'ego_op_add' : ActorMethod<[Principal], Result_1>,
  'ego_op_list' : ActorMethod<[], Result_5>,
  'ego_op_remove' : ActorMethod<[Principal], Result_1>,
  'ego_owner_add' : ActorMethod<[Principal], Result_1>,
  'ego_owner_add_with_name' : ActorMethod<[string, Principal], Result_1>,
  'ego_owner_list' : ActorMethod<[], Result_5>,
  'ego_owner_remove' : ActorMethod<[Principal], Result_1>,
  'ego_owner_set' : ActorMethod<[Array<Principal>], Result_1>,
  'ego_user_add' : ActorMethod<[Principal], Result_1>,
  'ego_user_list' : ActorMethod<[], Result_5>,
  'ego_user_remove' : ActorMethod<[Principal], Result_1>,
  'ego_user_set' : ActorMethod<[Array<Principal>], Result_1>,
  'ensureSaltSet' : ActorMethod<[], Array<number>>,
  'getDelegation' : ActorMethod<[GetDelegationRequest], GetDelegationResponse>,
  'secureMessage' : ActorMethod<[ChainType, boolean], Result_6>,
  'setLoginPrefix' : ActorMethod<[ChainType, string], undefined>,
  'verifyMessage' : ActorMethod<[VerifyMessagePayload], Result_7>,
  'whoAmI' : ActorMethod<[], Principal>,
}
