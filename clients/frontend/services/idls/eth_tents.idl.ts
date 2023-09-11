export const idlFactory = ({ IDL }) => {
  const OrderType = IDL.Variant({
    BuyLimit: IDL.Null,
    Platform: IDL.Null,
    BuyStop: IDL.Null,
    SellStop: IDL.Null,
    SellLimit: IDL.Null,
    Market: IDL.Null,
  });
  const OrderDetail = IDL.Record({
    order_type: OrderType,
    order_price: IDL.Nat,
    max_spread: IDL.Nat,
  });
  const IntentItem = IDL.Record({
    num: IDL.Nat,
    tokenIn: IDL.Text,
    intender: IDL.Text,
    tokenOut: IDL.Text,
    feeRate: IDL.Nat,
    recipient: IDL.Text,
    taskId: IDL.Nat,
    signatureHash: IDL.Text,
    expiration: IDL.Nat,
    order_detail: IDL.Opt(OrderDetail),
    to_chain_id: IDL.Nat,
    tokenOutSymbol: IDL.Text,
    destinationChain: IDL.Text,
    amount: IDL.Nat,
    intent_id: IDL.Opt(IDL.Text),
  });
  const UserIntents = IDL.Record({
    is_finished: IDL.Bool,
    user_address: IDL.Text,
    intent_item: IntentItem,
    intent_id: IDL.Opt(IDL.Text),
  });
  const Result = IDL.Variant({ Ok: UserIntents, Err: IDL.Text });
  const Version = IDL.Record({
    major: IDL.Nat32,
    minor: IDL.Nat32,
    patch: IDL.Nat32,
  });
  const AppInfo = IDL.Record({
    app_id: IDL.Text,
    current_version: Version,
    latest_version: Version,
    wallet_id: IDL.Opt(IDL.Principal),
  });
  const Result_1 = IDL.Variant({ Ok: AppInfo, Err: IDL.Text });
  const Result_2 = IDL.Variant({ Ok: IDL.Null, Err: IDL.Text });
  const Result_3 = IDL.Variant({
    Ok: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Principal))),
    Err: IDL.Text,
  });
  const Result_4 = IDL.Variant({ Ok: IDL.Bool, Err: IDL.Text });
  const LogEntry = IDL.Record({
    ts: IDL.Nat64,
    msg: IDL.Text,
    kind: IDL.Text,
  });
  const Result_5 = IDL.Variant({ Ok: IDL.Vec(LogEntry), Err: IDL.Text });
  const Result_6 = IDL.Variant({
    Ok: IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Text))),
    Err: IDL.Text,
  });
  const GetDelegationRequest = IDL.Record({
    session_key: IDL.Vec(IDL.Nat8),
    targets: IDL.Opt(IDL.Vec(IDL.Principal)),
    expiration: IDL.Nat64,
    user_address: IDL.Text,
  });
  const Result_7 = IDL.Variant({
    Ok: IDL.Tuple(IDL.Principal, IDL.Text),
    Err: IDL.Text,
  });
  const ChainType = IDL.Variant({
    OP: IDL.Null,
    ARB: IDL.Null,
    BNB: IDL.Null,
    BTC: IDL.Null,
    ETH: IDL.Null,
    HECO: IDL.Null,
    OKEX: IDL.Null,
    TRON: IDL.Null,
    ZKSYNC: IDL.Null,
    MANTLE: IDL.Null,
    MATIC: IDL.Null,
    LINEA: IDL.Null,
  });
  const AddressInfo = IDL.Record({
    derived_path_hash: IDL.Text,
    address_for: OrderType,
    key_name: IDL.Text,
    order_id: IDL.Text,
    chain_type: ChainType,
    last_update: IDL.Nat64,
    address_string: IDL.Text,
  });
  const SendEVMRequest = IDL.Record({
    gas: IDL.Opt(IDL.Nat64),
    value: IDL.Opt(IDL.Nat64),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    to_address: IDL.Text,
    address_info: AddressInfo,
    chain_id: IDL.Opt(IDL.Nat64),
    nonce: IDL.Opt(IDL.Nat64),
    sign_only: IDL.Bool,
    gas_price: IDL.Opt(IDL.Nat64),
  });
  const WalletError = IDL.Variant({
    Internal: IDL.Null,
    Invalid: IDL.Null,
    Overload: IDL.Null,
    AlreadyExist: IDL.Text,
    Duplicated: IDL.Null,
    NotFound: IDL.Null,
    WithMessage: IDL.Text,
    AlreadySent: IDL.Text,
  });
  const Result_8 = IDL.Variant({ Ok: IDL.Text, Err: WalletError });
  const PlatformDetail = IDL.Record({
    platform_uuid: IDL.Text,
    key_name: IDL.Text,
    chain_type: ChainType,
  });
  const Result_9 = IDL.Variant({ Ok: AddressInfo, Err: WalletError });
  const RoleFilter = IDL.Variant({
    All: IDL.Null,
    RoleAnd: IDL.Tuple(OrderType, OrderType),
    RoleNot: OrderType,
    Role: OrderType,
  });
  return IDL.Service({
    add_user_intent: IDL.Func([UserIntents], [Result], []),
    ego_app_info_get: IDL.Func([], [Result_1], ['query']),
    ego_app_info_update: IDL.Func([IDL.Opt(IDL.Principal), IDL.Text, Version], [], []),
    ego_app_version_check: IDL.Func([], [Result_1], []),
    ego_canister_add: IDL.Func([IDL.Text, IDL.Principal], [Result_2], []),
    ego_canister_delete: IDL.Func([], [Result_2], []),
    ego_canister_list: IDL.Func([], [Result_3], []),
    ego_canister_remove: IDL.Func([IDL.Text, IDL.Principal], [Result_2], []),
    ego_canister_track: IDL.Func([], [Result_2], []),
    ego_canister_untrack: IDL.Func([], [Result_2], []),
    ego_canister_upgrade: IDL.Func([], [Result_2], []),
    ego_controller_add: IDL.Func([IDL.Principal], [Result_2], []),
    ego_controller_remove: IDL.Func([IDL.Principal], [Result_2], []),
    ego_controller_set: IDL.Func([IDL.Vec(IDL.Principal)], [Result_2], []),
    ego_is_op: IDL.Func([], [Result_4], ['query']),
    ego_is_owner: IDL.Func([], [Result_4], ['query']),
    ego_is_user: IDL.Func([], [Result_4], ['query']),
    ego_log_list: IDL.Func([IDL.Nat64], [Result_5], ['query']),
    ego_op_add: IDL.Func([IDL.Principal], [Result_2], []),
    ego_op_list: IDL.Func([], [Result_6], []),
    ego_op_remove: IDL.Func([IDL.Principal], [Result_2], []),
    ego_owner_add: IDL.Func([IDL.Principal], [Result_2], []),
    ego_owner_add_with_name: IDL.Func([IDL.Text, IDL.Principal], [Result_2], []),
    ego_owner_list: IDL.Func([], [Result_6], []),
    ego_owner_remove: IDL.Func([IDL.Principal], [Result_2], []),
    ego_owner_set: IDL.Func([IDL.Vec(IDL.Principal)], [Result_2], []),
    ego_user_add: IDL.Func([IDL.Principal], [Result_2], []),
    ego_user_list: IDL.Func([], [Result_6], []),
    ego_user_remove: IDL.Func([IDL.Principal], [Result_2], []),
    ego_user_set: IDL.Func([IDL.Vec(IDL.Principal)], [Result_2], []),
    get_all_intents: IDL.Func([IDL.Opt(IDL.Bool)], [IDL.Vec(UserIntents)], ['query']),
    get_user_intent: IDL.Func([IDL.Text], [IDL.Vec(UserIntents)], ['query']),
    get_user_intent_json: IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    intent_item_to_json: IDL.Func([IntentItem], [IDL.Text], ['query']),
    register_user: IDL.Func([GetDelegationRequest, IDL.Principal], [Result_7], []),
    send_from_address: IDL.Func([SendEVMRequest], [Result_8], []),
    testUnwrap: IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Text], []),
    wallet_get_address_for_platform: IDL.Func([PlatformDetail], [Result_9], []),
    wallet_get_all_addresses: IDL.Func([RoleFilter], [IDL.Vec(AddressInfo)], ['query']),
    whoAmI: IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
