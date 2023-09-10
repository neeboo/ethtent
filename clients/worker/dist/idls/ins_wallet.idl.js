"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    idlFactory: function() {
        return idlFactory;
    },
    init: function() {
        return init;
    }
});
const idlFactory = ({ IDL })=>{
    const Version = IDL.Record({
        'major': IDL.Nat32,
        'minor': IDL.Nat32,
        'patch': IDL.Nat32
    });
    const AppInfo = IDL.Record({
        'app_id': IDL.Text,
        'current_version': Version,
        'latest_version': Version,
        'wallet_id': IDL.Opt(IDL.Principal)
    });
    const Result = IDL.Variant({
        'Ok': AppInfo,
        'Err': IDL.Text
    });
    const Result_1 = IDL.Variant({
        'Ok': IDL.Null,
        'Err': IDL.Text
    });
    const Result_2 = IDL.Variant({
        'Ok': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
        'Err': IDL.Text
    });
    const Result_3 = IDL.Variant({
        'Ok': IDL.Bool,
        'Err': IDL.Text
    });
    const LogEntry = IDL.Record({
        'ts': IDL.Nat64,
        'msg': IDL.Text,
        'kind': IDL.Text
    });
    const Result_4 = IDL.Variant({
        'Ok': IDL.Vec(LogEntry),
        'Err': IDL.Text
    });
    const Result_5 = IDL.Variant({
        'Ok': IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))),
        'Err': IDL.Text
    });
    const HttpHeader = IDL.Record({
        'value': IDL.Text,
        'name': IDL.Text
    });
    const HttpResponse = IDL.Record({
        'status': IDL.Nat,
        'body': IDL.Vec(IDL.Nat8),
        'headers': IDL.Vec(HttpHeader)
    });
    const TransformArgs = IDL.Record({
        'context': IDL.Vec(IDL.Nat8),
        'response': HttpResponse
    });
    const AddressInfo = IDL.Record({
        'derivation_path': IDL.Vec(IDL.Vec(IDL.Nat8)),
        'user_id': IDL.Text,
        'key_name': IDL.Text,
        'order_id': IDL.Text,
        'address_string': IDL.Text,
        'time_stamp': IDL.Nat64
    });
    const Chain = IDL.Variant({
        'BNB': IDL.Null,
        'BTC': IDL.Null,
        'ETH': IDL.Null
    });
    const EcdsaKeyIds = IDL.Variant({
        'ProductionKey1': IDL.Null,
        'TestKeyLocalDevelopment': IDL.Null,
        'TestKey1': IDL.Null
    });
    const ManualConfig = IDL.Record({
        'gas': IDL.Nat64,
        'manager_canister': IDL.Principal,
        'chain': Chain,
        'rpc_endpoint': IDL.Text,
        'cycles': IDL.Nat64,
        'chain_id': IDL.Nat64,
        'key_choice': EcdsaKeyIds,
        'gas_price': IDL.Nat64
    });
    const WalletError = IDL.Variant({
        'Internal': IDL.Null,
        'Invalid': IDL.Null,
        'Overload': IDL.Null,
        'AlreadyExist': IDL.Text,
        'Duplicated': IDL.Null,
        'NotFound': IDL.Null,
        'WithMessage': IDL.Text,
        'AlreadySent': IDL.Text
    });
    const Result_6 = IDL.Variant({
        'Ok': IDL.Text,
        'Err': WalletError
    });
    const TxInfo = IDL.Record({
        'data': IDL.Vec(IDL.Nat8),
        'content_id': IDL.Text,
        'order_id': IDL.Text,
        'price': IDL.Nat64,
        'tx_hash': IDL.Opt(IDL.Text),
        'receiver': IDL.Text,
        'time_stamp': IDL.Nat64
    });
    const WalletSendFromAddress = IDL.Record({
        'to': IDL.Text,
        'value': IDL.Nat64,
        'address_info': AddressInfo,
        'custom_gas': IDL.Opt(IDL.Nat64),
        'custom_gas_price': IDL.Opt(IDL.Nat64)
    });
    const WalletSendTx = IDL.Record({
        'custom_gas': IDL.Opt(IDL.Nat64),
        'order_id': IDL.Text,
        'overide_data': IDL.Opt(IDL.Vec(IDL.Nat8)),
        'custom_gas_price': IDL.Opt(IDL.Nat64)
    });
    return IDL.Service({
        'ego_app_info_get': IDL.Func([], [
            Result
        ], [
            'query'
        ]),
        'ego_app_info_update': IDL.Func([
            IDL.Opt(IDL.Principal),
            IDL.Text,
            Version
        ], [], []),
        'ego_app_version_check': IDL.Func([], [
            Result
        ], []),
        'ego_canister_add': IDL.Func([
            IDL.Text,
            IDL.Principal
        ], [
            Result_1
        ], []),
        'ego_canister_delete': IDL.Func([], [
            Result_1
        ], []),
        'ego_canister_list': IDL.Func([], [
            Result_2
        ], []),
        'ego_canister_remove': IDL.Func([
            IDL.Text,
            IDL.Principal
        ], [
            Result_1
        ], []),
        'ego_canister_track': IDL.Func([], [
            Result_1
        ], []),
        'ego_canister_untrack': IDL.Func([], [
            Result_1
        ], []),
        'ego_canister_upgrade': IDL.Func([], [
            Result_1
        ], []),
        'ego_controller_add': IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        'ego_controller_remove': IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        'ego_controller_set': IDL.Func([
            IDL.Vec(IDL.Principal)
        ], [
            Result_1
        ], []),
        'ego_is_op': IDL.Func([], [
            Result_3
        ], [
            'query'
        ]),
        'ego_is_owner': IDL.Func([], [
            Result_3
        ], [
            'query'
        ]),
        'ego_is_user': IDL.Func([], [
            Result_3
        ], [
            'query'
        ]),
        'ego_log_list': IDL.Func([
            IDL.Nat64
        ], [
            Result_4
        ], [
            'query'
        ]),
        'ego_op_add': IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        'ego_op_list': IDL.Func([], [
            Result_5
        ], []),
        'ego_op_remove': IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        'ego_owner_add': IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        'ego_owner_add_with_name': IDL.Func([
            IDL.Text,
            IDL.Principal
        ], [
            Result_1
        ], []),
        'ego_owner_list': IDL.Func([], [
            Result_5
        ], []),
        'ego_owner_remove': IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        'ego_owner_set': IDL.Func([
            IDL.Vec(IDL.Principal)
        ], [
            Result_1
        ], []),
        'ego_user_add': IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        'ego_user_list': IDL.Func([], [
            Result_5
        ], []),
        'ego_user_remove': IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        'ego_user_set': IDL.Func([
            IDL.Vec(IDL.Principal)
        ], [
            Result_1
        ], []),
        'transform': IDL.Func([
            TransformArgs
        ], [
            HttpResponse
        ], [
            'query'
        ]),
        'wallet_collect': IDL.Func([], [
            IDL.Vec(AddressInfo)
        ], []),
        'wallet_config': IDL.Func([
            ManualConfig
        ], [], []),
        'wallet_fetch_estimate_gas': IDL.Func([
            IDL.Text,
            IDL.Vec(IDL.Nat8)
        ], [
            Result_6
        ], []),
        'wallet_fetch_gas_price': IDL.Func([], [
            Result_6
        ], []),
        'wallet_get_address_for_tx': IDL.Func([
            TxInfo
        ], [
            Result_6
        ], []),
        'wallet_get_balance_of_order': IDL.Func([
            IDL.Text
        ], [
            Result_6
        ], []),
        'wallet_get_orders': IDL.Func([
            IDL.Text
        ], [
            IDL.Vec(TxInfo)
        ], [
            'query'
        ]),
        'wallet_get_tx': IDL.Func([
            IDL.Text
        ], [
            IDL.Opt(TxInfo)
        ], [
            'query'
        ]),
        'wallet_get_tx_from_manager': IDL.Func([
            IDL.Text
        ], [
            IDL.Opt(TxInfo)
        ], []),
        'wallet_push_tx': IDL.Func([
            TxInfo
        ], [
            Result_6
        ], []),
        'wallet_send_from_address': IDL.Func([
            WalletSendFromAddress
        ], [
            Result_6
        ], []),
        'wallet_send_tx': IDL.Func([
            WalletSendTx
        ], [
            Result_6
        ], []),
        'whoAmI': IDL.Func([], [
            IDL.Principal
        ], [])
    });
};
const init = ({ IDL })=>{
    return [];
};
