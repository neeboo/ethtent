import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AddressInfo {
  'derivation_path' : Array<Array<number>>,
  'user_id' : string,
  'key_name' : string,
  'order_id' : string,
  'address_string' : string,
  'time_stamp' : bigint,
}
export interface AppInfo {
  'app_id' : string,
  'current_version' : Version,
  'latest_version' : Version,
  'wallet_id' : [] | [Principal],
}
export type Chain = { 'BNB' : null } |
  { 'BTC' : null } |
  { 'ETH' : null };
export type EcdsaKeyIds = { 'ProductionKey1' : null } |
  { 'TestKeyLocalDevelopment' : null } |
  { 'TestKey1' : null };
export interface HttpHeader { 'value' : string, 'name' : string }
export interface HttpResponse {
  'status' : bigint,
  'body' : Array<number>,
  'headers' : Array<HttpHeader>,
}
export interface LogEntry { 'ts' : bigint, 'msg' : string, 'kind' : string }
export interface ManualConfig {
  'gas' : bigint,
  'manager_canister' : Principal,
  'chain' : Chain,
  'rpc_endpoint' : string,
  'cycles' : bigint,
  'chain_id' : bigint,
  'key_choice' : EcdsaKeyIds,
  'gas_price' : bigint,
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
  { 'Err' : WalletError };
export interface TransformArgs {
  'context' : Array<number>,
  'response' : HttpResponse,
}
export interface TxInfo {
  'data' : Array<number>,
  'content_id' : string,
  'order_id' : string,
  'price' : bigint,
  'tx_hash' : [] | [string],
  'receiver' : string,
  'time_stamp' : bigint,
}
export interface Version {
  'major' : number,
  'minor' : number,
  'patch' : number,
}
export type WalletError = { 'Internal' : null } |
  { 'Invalid' : null } |
  { 'Overload' : null } |
  { 'AlreadyExist' : string } |
  { 'Duplicated' : null } |
  { 'NotFound' : null } |
  { 'WithMessage' : string } |
  { 'AlreadySent' : string };
export interface WalletSendFromAddress {
  'to' : string,
  'value' : bigint,
  'address_info' : AddressInfo,
  'custom_gas' : [] | [bigint],
  'custom_gas_price' : [] | [bigint],
}
export interface WalletSendTx {
  'custom_gas' : [] | [bigint],
  'order_id' : string,
  'overide_data' : [] | [Array<number>],
  'custom_gas_price' : [] | [bigint],
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
  'transform' : ActorMethod<[TransformArgs], HttpResponse>,
  'wallet_collect' : ActorMethod<[], Array<AddressInfo>>,
  'wallet_config' : ActorMethod<[ManualConfig], undefined>,
  'wallet_fetch_estimate_gas' : ActorMethod<[string, Array<number>], Result_6>,
  'wallet_fetch_gas_price' : ActorMethod<[], Result_6>,
  'wallet_get_address_for_tx' : ActorMethod<[TxInfo], Result_6>,
  'wallet_get_balance_of_order' : ActorMethod<[string], Result_6>,
  'wallet_get_orders' : ActorMethod<[string], Array<TxInfo>>,
  'wallet_get_tx' : ActorMethod<[string], [] | [TxInfo]>,
  'wallet_get_tx_from_manager' : ActorMethod<[string], [] | [TxInfo]>,
  'wallet_push_tx' : ActorMethod<[TxInfo], Result_6>,
  'wallet_send_from_address' : ActorMethod<[WalletSendFromAddress], Result_6>,
  'wallet_send_tx' : ActorMethod<[WalletSendTx], Result_6>,
  'whoAmI' : ActorMethod<[], Principal>,
}
