import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AddressInfo {
  'derived_path_hash' : string,
  'address_for' : OrderType,
  'key_name' : string,
  'order_id' : string,
  'chain_type' : ChainType,
  'last_update' : bigint,
  'address_string' : string,
}
export interface AppInfo {
  'app_id' : string,
  'current_version' : Version,
  'latest_version' : Version,
  'wallet_id' : [] | [Principal],
}
export type ChainType = { 'OP' : null } |
  { 'ARB' : null } |
  { 'BNB' : null } |
  { 'BTC' : null } |
  { 'ETH' : null } |
  { 'HECO' : null } |
  { 'OKEX' : null } |
  { 'TRON' : null } |
  { 'ZKSYNC' : null } |
  { 'MANTLE' : null } |
  { 'MATIC' : null } |
  { 'LINEA' : null };
export interface GetDelegationRequest {
  'session_key' : Array<number>,
  'targets' : [] | [Array<Principal>],
  'expiration' : bigint,
  'user_address' : string,
}
export interface IntentItem {
  'num' : bigint,
  'tokenIn' : string,
  'intender' : string,
  'tokenOut' : string,
  'feeRate' : bigint,
  'recipient' : string,
  'taskId' : bigint,
  'signatureHash' : string,
  'expiration' : bigint,
  'order_detail' : [] | [OrderDetail],
  'to_chain_id' : bigint,
  'tokenOutSymbol' : string,
  'destinationChain' : string,
  'amount' : bigint,
  'intent_id' : [] | [string],
}
export interface LogEntry { 'ts' : bigint, 'msg' : string, 'kind' : string }
export interface OrderDetail {
  'order_type' : OrderType,
  'order_price' : bigint,
  'max_spread' : bigint,
}
export type OrderType = { 'BuyLimit' : null } |
  { 'Platform' : null } |
  { 'BuyStop' : null } |
  { 'SellStop' : null } |
  { 'SellLimit' : null } |
  { 'Market' : null };
export interface PlatformDetail {
  'platform_uuid' : string,
  'key_name' : string,
  'chain_type' : ChainType,
}
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
export type Result_8 = { 'Ok' : string } |
  { 'Err' : WalletError };
export type Result_9 = { 'Ok' : AddressInfo } |
  { 'Err' : WalletError };
export type RoleFilter = { 'All' : null } |
  { 'RoleAnd' : [OrderType, OrderType] } |
  { 'RoleNot' : OrderType } |
  { 'Role' : OrderType };
export interface SendEVMRequest {
  'gas' : [] | [bigint],
  'value' : [] | [bigint],
  'data' : [] | [Array<number>],
  'to_address' : string,
  'address_info' : AddressInfo,
  'chain_id' : [] | [bigint],
  'nonce' : [] | [bigint],
  'sign_only' : boolean,
  'gas_price' : [] | [bigint],
}
export interface UserIntents {
  'is_finished' : boolean,
  'user_address' : string,
  'tx_hash' : [] | [string],
  'intent_item' : IntentItem,
  'intent_id' : [] | [string],
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
  'finish_intent' : ActorMethod<[string, boolean], [] | [UserIntents]>,
  'get_all_intents' : ActorMethod<[[] | [boolean]], Array<UserIntents>>,
  'get_user_intent' : ActorMethod<[string], Array<UserIntents>>,
  'get_user_intent_json' : ActorMethod<[string], Array<string>>,
  'intent_item_to_json' : ActorMethod<[IntentItem], string>,
  'register_user' : ActorMethod<[GetDelegationRequest, Principal], Result_7>,
  'remove_user_intent_by_id' : ActorMethod<[string], [] | [UserIntents]>,
  'send_from_address' : ActorMethod<[SendEVMRequest], Result_8>,
  'testUnwrap' : ActorMethod<[[] | [Principal]], string>,
  'update_intent_hash' : ActorMethod<[string, string], [] | [string]>,
  'wallet_get_address_for_platform' : ActorMethod<[PlatformDetail], Result_9>,
  'wallet_get_all_addresses' : ActorMethod<[RoleFilter], Array<AddressInfo>>,
  'whoAmI' : ActorMethod<[], Principal>,
}
