import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AppInfo {
  app_id: string;
  current_version: Version;
  latest_version: Version;
  wallet_id: [] | [Principal];
}
export interface ContentDetail {
  id: string;
  status: ContentStatus;
  data: Array<number>;
  price: bigint;
}
export interface ContentPreviewDetail {
  id: string;
  status: ContentStatus;
  data: Array<number>;
  price: bigint;
}
export interface ContentStatus {
  id: string;
  is_sold: boolean;
  has_order: boolean;
  order_id: [] | [string];
}
export interface LogEntry {
  ts: bigint;
  msg: string;
  kind: string;
}
export interface OrderDetail {
  tx_info: TxInfo;
  payment_address: [] | [string];
}
export type Result = { Ok: AppInfo } | { Err: string };
export type Result_1 = { Ok: null } | { Err: string };
export type Result_2 = { Ok: Array<[string, Array<Principal>]> } | { Err: string };
export type Result_3 = { Ok: boolean } | { Err: string };
export type Result_4 = { Ok: Array<LogEntry> } | { Err: string };
export type Result_5 = { Ok: [] | [Array<[Principal, string]>] } | { Err: string };
export type Result_6 = { Ok: TxInfoReturn } | { Err: string };
export interface TxInfo {
  data: Array<number>;
  content_id: string;
  order_id: string;
  price: bigint;
  tx_hash: [] | [string];
  receiver: string;
  time_stamp: bigint;
}
export interface TxInfoReturn {
  content_id: string;
  order_id: string;
  tx_hash: [] | [string];
  payment_address: string;
  receiver: string;
  time_stamp: bigint;
}
export interface Version {
  major: number;
  minor: number;
  patch: number;
}
export interface WalletSendTx {
  custom_gas: [] | [bigint];
  order_id: string;
  overide_data: [] | [Array<number>];
  custom_gas_price: [] | [bigint];
}
export interface _SERVICE {
  ego_app_info_get: ActorMethod<[], Result>;
  ego_app_info_update: ActorMethod<[[] | [Principal], string, Version], undefined>;
  ego_app_version_check: ActorMethod<[], Result>;
  ego_canister_add: ActorMethod<[string, Principal], Result_1>;
  ego_canister_delete: ActorMethod<[], Result_1>;
  ego_canister_list: ActorMethod<[], Result_2>;
  ego_canister_remove: ActorMethod<[string, Principal], Result_1>;
  ego_canister_track: ActorMethod<[], Result_1>;
  ego_canister_untrack: ActorMethod<[], Result_1>;
  ego_canister_upgrade: ActorMethod<[], Result_1>;
  ego_controller_add: ActorMethod<[Principal], Result_1>;
  ego_controller_remove: ActorMethod<[Principal], Result_1>;
  ego_controller_set: ActorMethod<[Array<Principal>], Result_1>;
  ego_is_op: ActorMethod<[], Result_3>;
  ego_is_owner: ActorMethod<[], Result_3>;
  ego_is_user: ActorMethod<[], Result_3>;
  ego_log_list: ActorMethod<[bigint], Result_4>;
  ego_op_add: ActorMethod<[Principal], Result_1>;
  ego_op_list: ActorMethod<[], Result_5>;
  ego_op_remove: ActorMethod<[Principal], Result_1>;
  ego_owner_add: ActorMethod<[Principal], Result_1>;
  ego_owner_add_with_name: ActorMethod<[string, Principal], Result_1>;
  ego_owner_list: ActorMethod<[], Result_5>;
  ego_owner_remove: ActorMethod<[Principal], Result_1>;
  ego_owner_set: ActorMethod<[Array<Principal>], Result_1>;
  ego_user_add: ActorMethod<[Principal], Result_1>;
  ego_user_list: ActorMethod<[], Result_5>;
  ego_user_remove: ActorMethod<[Principal], Result_1>;
  ego_user_set: ActorMethod<[Array<Principal>], Result_1>;
  list_pic_preview: ActorMethod<[], Array<ContentPreviewDetail>>;
  list_unpaid_order: ActorMethod<[], Array<OrderDetail>>;
  manager_get_pic: ActorMethod<[string], [] | [ContentDetail]>;
  manager_set_pic_price: ActorMethod<[bigint], undefined>;
  manager_set_wallet: ActorMethod<[Principal], undefined>;
  manager_upload_pics: ActorMethod<[Array<[string, Array<number>]>], undefined>;
  manager_upload_preview_pics: ActorMethod<[Array<[string, Array<number>]>], undefined>;
  op_pay_order: ActorMethod<[WalletSendTx], Result_6>;
  user_add_order: ActorMethod<[string, string], Result_6>;
  whoAmI: ActorMethod<[], Principal>;
}
