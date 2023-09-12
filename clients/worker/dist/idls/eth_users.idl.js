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
    const GetDelegationRequest = IDL.Record({
        'session_key': IDL.Vec(IDL.Nat8),
        'targets': IDL.Opt(IDL.Vec(IDL.Principal)),
        'expiration': IDL.Nat64,
        'user_address': IDL.Text
    });
    const Delegation = IDL.Record({
        'pubkey': IDL.Vec(IDL.Nat8),
        'targets': IDL.Opt(IDL.Vec(IDL.Principal)),
        'expiration': IDL.Nat64
    });
    const SignedDelegation = IDL.Record({
        'signature': IDL.Vec(IDL.Nat8),
        'delegation': Delegation
    });
    const GetDelegationResponse = IDL.Variant({
        'no_such_delegation': IDL.Null,
        'signed_delegation': SignedDelegation
    });
    const ChainType = IDL.Variant({
        'BTC': IDL.Null,
        'EVM': IDL.Null
    });
    const Result_6 = IDL.Variant({
        'Ok': IDL.Text,
        'Err': IDL.Text
    });
    const VerifyMessagePayload = IDL.Record({
        'signature': IDL.Text,
        'public_key': IDL.Opt(IDL.Text),
        'session_key': IDL.Vec(IDL.Nat8),
        'formatted_message': IDL.Text,
        'message': IDL.Text,
        'address': IDL.Text,
        'chain_type': ChainType
    });
    const PrepareDelegationResponse = IDL.Record({
        'user_key': IDL.Vec(IDL.Nat8),
        'expiration': IDL.Nat64
    });
    const Result_7 = IDL.Variant({
        'Ok': PrepareDelegationResponse,
        'Err': IDL.Text
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
        'ensureSaltSet': IDL.Func([], [
            IDL.Vec(IDL.Nat8)
        ], []),
        'getDelegation': IDL.Func([
            GetDelegationRequest
        ], [
            GetDelegationResponse
        ], [
            'query'
        ]),
        'secureMessage': IDL.Func([
            ChainType,
            IDL.Bool
        ], [
            Result_6
        ], []),
        'setLoginPrefix': IDL.Func([
            ChainType,
            IDL.Text
        ], [], []),
        'verifyMessage': IDL.Func([
            VerifyMessagePayload
        ], [
            Result_7
        ], []),
        'whoAmI': IDL.Func([], [
            IDL.Principal
        ], [])
    });
};
const init = ({ IDL })=>{
    return [];
};
