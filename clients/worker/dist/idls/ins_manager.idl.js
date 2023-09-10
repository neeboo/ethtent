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
        major: IDL.Nat32,
        minor: IDL.Nat32,
        patch: IDL.Nat32
    });
    const AppInfo = IDL.Record({
        app_id: IDL.Text,
        current_version: Version,
        latest_version: Version,
        wallet_id: IDL.Opt(IDL.Principal)
    });
    const Result = IDL.Variant({
        Ok: AppInfo,
        Err: IDL.Text
    });
    const Result_1 = IDL.Variant({
        Ok: IDL.Null,
        Err: IDL.Text
    });
    const Result_2 = IDL.Variant({
        Ok: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
        Err: IDL.Text
    });
    const Result_3 = IDL.Variant({
        Ok: IDL.Bool,
        Err: IDL.Text
    });
    const LogEntry = IDL.Record({
        ts: IDL.Nat64,
        msg: IDL.Text,
        kind: IDL.Text
    });
    const Result_4 = IDL.Variant({
        Ok: IDL.Vec(LogEntry),
        Err: IDL.Text
    });
    const Result_5 = IDL.Variant({
        Ok: IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))),
        Err: IDL.Text
    });
    const ContentStatus = IDL.Record({
        id: IDL.Text,
        is_sold: IDL.Bool,
        has_order: IDL.Bool,
        order_id: IDL.Opt(IDL.Text)
    });
    const ContentPreviewDetail = IDL.Record({
        id: IDL.Text,
        status: ContentStatus,
        data: IDL.Vec(IDL.Nat8),
        price: IDL.Nat64
    });
    const TxInfo = IDL.Record({
        data: IDL.Vec(IDL.Nat8),
        content_id: IDL.Text,
        order_id: IDL.Text,
        price: IDL.Nat64,
        tx_hash: IDL.Opt(IDL.Text),
        receiver: IDL.Text,
        time_stamp: IDL.Nat64
    });
    const OrderDetail = IDL.Record({
        tx_info: TxInfo,
        payment_address: IDL.Opt(IDL.Text)
    });
    const ContentDetail = IDL.Record({
        id: IDL.Text,
        status: ContentStatus,
        data: IDL.Vec(IDL.Nat8),
        price: IDL.Nat64
    });
    const WalletSendTx = IDL.Record({
        custom_gas: IDL.Opt(IDL.Nat64),
        order_id: IDL.Text,
        overide_data: IDL.Opt(IDL.Vec(IDL.Nat8)),
        custom_gas_price: IDL.Opt(IDL.Nat64)
    });
    const TxInfoReturn = IDL.Record({
        content_id: IDL.Text,
        order_id: IDL.Text,
        tx_hash: IDL.Opt(IDL.Text),
        payment_address: IDL.Text,
        receiver: IDL.Text,
        time_stamp: IDL.Nat64
    });
    const Result_6 = IDL.Variant({
        Ok: TxInfoReturn,
        Err: IDL.Text
    });
    return IDL.Service({
        ego_app_info_get: IDL.Func([], [
            Result
        ], [
            'query'
        ]),
        ego_app_info_update: IDL.Func([
            IDL.Opt(IDL.Principal),
            IDL.Text,
            Version
        ], [], []),
        ego_app_version_check: IDL.Func([], [
            Result
        ], []),
        ego_canister_add: IDL.Func([
            IDL.Text,
            IDL.Principal
        ], [
            Result_1
        ], []),
        ego_canister_delete: IDL.Func([], [
            Result_1
        ], []),
        ego_canister_list: IDL.Func([], [
            Result_2
        ], []),
        ego_canister_remove: IDL.Func([
            IDL.Text,
            IDL.Principal
        ], [
            Result_1
        ], []),
        ego_canister_track: IDL.Func([], [
            Result_1
        ], []),
        ego_canister_untrack: IDL.Func([], [
            Result_1
        ], []),
        ego_canister_upgrade: IDL.Func([], [
            Result_1
        ], []),
        ego_controller_add: IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        ego_controller_remove: IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        ego_controller_set: IDL.Func([
            IDL.Vec(IDL.Principal)
        ], [
            Result_1
        ], []),
        ego_is_op: IDL.Func([], [
            Result_3
        ], [
            'query'
        ]),
        ego_is_owner: IDL.Func([], [
            Result_3
        ], [
            'query'
        ]),
        ego_is_user: IDL.Func([], [
            Result_3
        ], [
            'query'
        ]),
        ego_log_list: IDL.Func([
            IDL.Nat64
        ], [
            Result_4
        ], [
            'query'
        ]),
        ego_op_add: IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        ego_op_list: IDL.Func([], [
            Result_5
        ], []),
        ego_op_remove: IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        ego_owner_add: IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        ego_owner_add_with_name: IDL.Func([
            IDL.Text,
            IDL.Principal
        ], [
            Result_1
        ], []),
        ego_owner_list: IDL.Func([], [
            Result_5
        ], []),
        ego_owner_remove: IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        ego_owner_set: IDL.Func([
            IDL.Vec(IDL.Principal)
        ], [
            Result_1
        ], []),
        ego_user_add: IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        ego_user_list: IDL.Func([], [
            Result_5
        ], []),
        ego_user_remove: IDL.Func([
            IDL.Principal
        ], [
            Result_1
        ], []),
        ego_user_set: IDL.Func([
            IDL.Vec(IDL.Principal)
        ], [
            Result_1
        ], []),
        list_pic_preview: IDL.Func([], [
            IDL.Vec(ContentPreviewDetail)
        ], []),
        list_unpaid_order: IDL.Func([], [
            IDL.Vec(OrderDetail)
        ], []),
        manager_get_pic: IDL.Func([
            IDL.Text
        ], [
            IDL.Opt(ContentDetail)
        ], [
            'query'
        ]),
        manager_set_pic_price: IDL.Func([
            IDL.Nat64
        ], [], []),
        manager_set_wallet: IDL.Func([
            IDL.Principal
        ], [], []),
        manager_upload_pics: IDL.Func([
            IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Nat8)))
        ], [], []),
        manager_upload_preview_pics: IDL.Func([
            IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Nat8)))
        ], [], []),
        op_pay_order: IDL.Func([
            WalletSendTx
        ], [
            Result_6
        ], []),
        user_add_order: IDL.Func([
            IDL.Text,
            IDL.Text
        ], [
            Result_6
        ], []),
        whoAmI: IDL.Func([], [
            IDL.Principal
        ], [])
    });
};
const init = ({ IDL })=>{
    return [];
};
