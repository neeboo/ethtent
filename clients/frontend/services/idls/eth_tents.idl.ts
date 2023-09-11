/* eslint-disable  @typescript-eslint/no-explicit-any */
export const idlFactory = ({ IDL }) => {
  const UserIntents = IDL.Record({
    'is_finished' : IDL.Bool,
    'user_address' : IDL.Text,
    'intent_bytes' : IDL.Vec(IDL.Nat8),
    'intent_id' : IDL.Opt(IDL.Text),
  });
  const Result = IDL.Variant({ 'Ok' : UserIntents, 'Err' : IDL.Text });
  const Version = IDL.Record({
    'major' : IDL.Nat32,
    'minor' : IDL.Nat32,
    'patch' : IDL.Nat32,
  });
  const AppInfo = IDL.Record({
    'app_id' : IDL.Text,
    'current_version' : Version,
    'latest_version' : Version,
    'wallet_id' : IDL.Opt(IDL.Principal),
  });
  const Result_1 = IDL.Variant({ 'Ok' : AppInfo, 'Err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const Result_3 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
    'Err' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const LogEntry = IDL.Record({
    'ts' : IDL.Nat64,
    'msg' : IDL.Text,
    'kind' : IDL.Text,
  });
  const Result_5 = IDL.Variant({ 'Ok' : IDL.Vec(LogEntry), 'Err' : IDL.Text });
  const Result_6 = IDL.Variant({
    'Ok' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))),
    'Err' : IDL.Text,
  });
  const GetDelegationRequest = IDL.Record({
    'session_key' : IDL.Vec(IDL.Nat8),
    'targets' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'expiration' : IDL.Nat64,
    'user_address' : IDL.Text,
  });
  const Result_7 = IDL.Variant({
    'Ok' : IDL.Tuple(IDL.Principal, IDL.Text),
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'add_user_intent' : IDL.Func([UserIntents], [Result], []),
    'ego_app_info_get' : IDL.Func([], [Result_1], ['query']),
    'ego_app_info_update' : IDL.Func(
        [IDL.Opt(IDL.Principal), IDL.Text, Version],
        [],
        [],
      ),
    'ego_app_version_check' : IDL.Func([], [Result_1], []),
    'ego_canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_2], []),
    'ego_canister_delete' : IDL.Func([], [Result_2], []),
    'ego_canister_list' : IDL.Func([], [Result_3], []),
    'ego_canister_remove' : IDL.Func([IDL.Text, IDL.Principal], [Result_2], []),
    'ego_canister_track' : IDL.Func([], [Result_2], []),
    'ego_canister_untrack' : IDL.Func([], [Result_2], []),
    'ego_canister_upgrade' : IDL.Func([], [Result_2], []),
    'ego_controller_add' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_controller_remove' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_controller_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_2], []),
    'ego_is_op' : IDL.Func([], [Result_4], ['query']),
    'ego_is_owner' : IDL.Func([], [Result_4], ['query']),
    'ego_is_user' : IDL.Func([], [Result_4], ['query']),
    'ego_log_list' : IDL.Func([IDL.Nat64], [Result_5], ['query']),
    'ego_op_add' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_op_list' : IDL.Func([], [Result_6], []),
    'ego_op_remove' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_owner_add' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_owner_add_with_name' : IDL.Func(
        [IDL.Text, IDL.Principal],
        [Result_2],
        [],
      ),
    'ego_owner_list' : IDL.Func([], [Result_6], []),
    'ego_owner_remove' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_owner_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_2], []),
    'ego_user_add' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_user_list' : IDL.Func([], [Result_6], []),
    'ego_user_remove' : IDL.Func([IDL.Principal], [Result_2], []),
    'ego_user_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_2], []),
    'register_user' : IDL.Func(
        [GetDelegationRequest, IDL.Principal],
        [Result_7],
        [],
      ),
    'whoAmI' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
