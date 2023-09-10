import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AppInfo {
  'app_id' : string,
  'current_version' : Version,
  'latest_version' : Version,
  'wallet_id' : [] | [Principal],
}
export interface GetDelegationRequest {
  'session_key' : Array<number>,
  'targets' : [] | [Array<Principal>],
  'expiration' : bigint,
  'user_address' : string,
}
export interface LogEntry { 'ts' : bigint, 'msg' : string, 'kind' : string }
export type Result = { 'Ok' : UserIntents } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : AppInfo } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : Array<[string, Array<Principal>]> } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : Array<LogEntry> } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : [] | [Array<[Principal, string]>] } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : [Principal, string] } |
  { 'Err' : string };
export interface UserIntents {
  'is_finished' : boolean,
  'user_address' : string,
  'intent_bytes' : Array<number>,
  'intent_id' : [] | [string],
}
export interface Version {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export interface _SERVICE {
  'add_user_intent' : ActorMethod<[UserIntents], Result>,
  'ego_app_info_get' : ActorMethod<[], Result_1>,
  'ego_app_info_update' : ActorMethod<
    [[] | [Principal], string, Version],
    undefined,
  >,
  'ego_app_version_check' : ActorMethod<[], Result_1>,
  'ego_canister_add' : ActorMethod<[string, Principal], Result_2>,
  'ego_canister_delete' : ActorMethod<[], Result_2>,
  'ego_canister_list' : ActorMethod<[], Result_3>,
  'ego_canister_remove' : ActorMethod<[string, Principal], Result_2>,
  'ego_canister_track' : ActorMethod<[], Result_2>,
  'ego_canister_untrack' : ActorMethod<[], Result_2>,
  'ego_canister_upgrade' : ActorMethod<[], Result_2>,
  'ego_controller_add' : ActorMethod<[Principal], Result_2>,
  'ego_controller_remove' : ActorMethod<[Principal], Result_2>,
  'ego_controller_set' : ActorMethod<[Array<Principal>], Result_2>,
  'ego_is_op' : ActorMethod<[], Result_4>,
  'ego_is_owner' : ActorMethod<[], Result_4>,
  'ego_is_user' : ActorMethod<[], Result_4>,
  'ego_log_list' : ActorMethod<[bigint], Result_5>,
  'ego_op_add' : ActorMethod<[Principal], Result_2>,
  'ego_op_list' : ActorMethod<[], Result_6>,
  'ego_op_remove' : ActorMethod<[Principal], Result_2>,
  'ego_owner_add' : ActorMethod<[Principal], Result_2>,
  'ego_owner_add_with_name' : ActorMethod<[string, Principal], Result_2>,
  'ego_owner_list' : ActorMethod<[], Result_6>,
  'ego_owner_remove' : ActorMethod<[Principal], Result_2>,
  'ego_owner_set' : ActorMethod<[Array<Principal>], Result_2>,
  'ego_user_add' : ActorMethod<[Principal], Result_2>,
  'ego_user_list' : ActorMethod<[], Result_6>,
  'ego_user_remove' : ActorMethod<[Principal], Result_2>,
  'ego_user_set' : ActorMethod<[Array<Principal>], Result_2>,
  'register_user' : ActorMethod<[GetDelegationRequest, Principal], Result_7>,
  'whoAmI' : ActorMethod<[], Principal>,
}
