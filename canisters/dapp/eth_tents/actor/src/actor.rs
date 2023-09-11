// ------------------
//
// **Here are ego dependencies, needed for ego injections**
//
// ------------------
// BTreeMap
use std::collections::BTreeMap;

// ego_macros
use ego_macros::{inject_app_info_api, inject_ego_api};

// ic_cdk
use candid::candid_method;
use candid::Principal;
use ic_cdk::api::call::RejectionCode;
use ic_cdk::{api, caller};
use ic_cdk_macros::*;

// ------------------
//
// **Project dependencies
//
// ------------------
// injected macros
use eth_tents_mod::state::*;
use eth_tents_mod::types::*;
use eth_users_mod::types::{GetDelegationRequest, GetDelegationResponse};

// ------------------
//
// ** injections
//
// ------------------
// injection ego apis
inject_ego_api!();
inject_app_info_api!();

#[cfg(not(feature = "no_candid"))]
#[init]
#[candid_method(init, rename = "init")]
fn canister_init() {
    let caller = caller();
    info_log_add(format!("eth_tents: init, caller is {}", caller.clone()).as_str());
    owner_add(caller);
}

#[pre_upgrade]
pub fn pre_upgrade() {
    eth_tents_mod::state::pre_upgrade()
}

#[post_upgrade]
pub fn post_upgrade() {
    eth_tents_mod::state::post_upgrade();
}

/// users
#[cfg(not(feature = "no_candid"))]
#[update(name = "whoAmI", guard = "owner_guard")]
#[candid_method(update, rename = "whoAmI")]
pub fn who_am_i() -> Principal {
    ic_cdk::api::caller()
}

#[cfg(not(feature = "no_candid"))]
#[update(name = "register_user")]
#[candid_method(update, rename = "register_user")]
pub async fn register_user(
    req: GetDelegationRequest,
    canister: Principal,
) -> Result<(Principal, String), String> {
    match get_valid_user(canister, req.clone()).await {
        Ok(_) => eth_tents_mod::intent::IntentService::add_user(caller(), req.user_address.clone()),
        Err(_) => Err("User is not permited".to_string()),
    }
}

async fn get_valid_user(
    canister: Principal,
    req: GetDelegationRequest,
) -> Result<GetDelegationResponse, String> {
    let call_result = api::call::call(canister, "get_delegation", (req,)).await
        as Result<(GetDelegationResponse,), (RejectionCode, String)>;
    match call_result {
        Ok(r) => Ok(r.0),
        Err(e) => Err(format!("Remote Fetch err:{}", e.1)),
    }
}

/// intents
#[cfg(not(feature = "no_candid"))]
#[update(name = "add_user_intent")]
#[candid_method(update, rename = "add_user_intent")]
pub fn add_user_intent(user_intent: UserIntents) -> Result<UserIntents, String> {
    eth_tents_mod::intent::IntentService::add_user_intent(user_intent)
}

#[cfg(not(feature = "no_candid"))]
#[query(name = "get_user_intent")]
#[candid_method(query, rename = "get_user_intent")]
pub fn get_user_intent(user_address: String) -> Vec<UserIntents> {
    eth_tents_mod::intent::IntentService::get_user_intent(user_address)
}

#[cfg(not(feature = "no_candid"))]
#[query(name = "get_user_intent_json")]
#[candid_method(query, rename = "get_user_intent_json")]
pub fn get_user_intent_json(user_address: String) -> Vec<String> {
    eth_tents_mod::intent::IntentService::get_user_intent_json(user_address)
}

#[cfg(not(feature = "no_candid"))]
#[query(name = "get_intent_by_id")]
#[candid_method(query, rename = "get_intent_by_id")]
pub fn get_intent_by_id(intent_id: String) -> Option<UserIntents> {
    eth_tents_mod::intent::IntentService::get_intent_by_id(intent_id)
}

#[cfg(not(feature = "no_candid"))]
#[update(name = "remove_user_intent_by_id")]
#[candid_method(update, rename = "remove_user_intent_by_id")]
pub fn remove_user_intent_by_id(intent_id: String) -> Option<UserIntents> {
    eth_tents_mod::intent::IntentService::remove_user_intent_by_id(intent_id)
}
#[cfg(not(feature = "no_candid"))]
#[update(name = "update_intent_hash")]
#[candid_method(update, rename = "update_intent_hash")]
pub fn update_intent_hash(intent_id: String, tx_hash: String) -> Option<UserIntents> {
    eth_tents_mod::intent::IntentService::update_intent_hash(intent_id, tx_hash)
}

#[cfg(not(feature = "no_candid"))]
#[query(name = "intent_item_to_json")]
#[candid_method(query, rename = "intent_item_to_json")]
pub fn intent_item_to_json(intent_item: IntentItem) -> String {
    intent_item.to_json()
}

#[cfg(not(feature = "no_candid"))]
#[query(name = "get_all_intents")]
#[candid_method(query, rename = "get_all_intents")]
pub fn get_all_intents(is_finished: Option<bool>) -> Vec<UserIntents> {
    eth_tents_mod::intent::IntentService::get_all_intents(is_finished)
}
#[cfg(not(feature = "no_candid"))]
#[update(name = "finish_intent")]
#[candid_method(update, rename = "finish_intent")]
pub fn finish_intent(id: String, is_finished: bool) -> Option<UserIntents> {
    eth_tents_mod::intent::IntentService::finish_intent(id, is_finished)
}

#[inline(always)]
pub fn eth_user_guard() -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    let ret = eth_tents_mod::intent::IntentService::get_user_by_principal(caller);
    if is_owner(caller) || ret.is_some() {
        Ok(())
    } else {
        ic_cdk::api::trap(&format!("{} unauthorized", caller));
    }
}

/// wallets
#[cfg(not(feature = "no_candid"))]
#[update(name = "wallet_get_address_for_platform", guard = "owner_guard")]
#[candid_method(update, rename = "wallet_get_address_for_platform")]
pub async fn wallet_get_address_for_platform(
    tx: PlatformDetail,
) -> Result<AddressInfo, WalletError> {
    match eth_tents_mod::intent::IntentService::wallet_get_address_for_platform(&tx).await {
        Ok(mut a) => {
            a.address_string = a.address_string.clone().replace("0x", "");
            a.save();
            // insert_address(a.address_string.clone().replace("0x", ""), a.clone());
            Ok(a.clone())
        }
        Err(e) => Err(e),
    }
}

#[cfg(not(feature = "no_candid"))]
#[query(name = "wallet_get_all_addresses", guard = "owner_guard")]
#[candid_method(query, rename = "wallet_get_all_addresses")]
pub fn wallet_get_all_addresses(role_filter: RoleFilter) -> Vec<AddressInfo> {
    AddressInfo::get_all_address(role_filter)
}

#[cfg(not(feature = "no_candid"))]
#[update(name = "send_from_address", guard = "owner_guard")]
#[candid_method(update, rename = "send_from_address")]
pub async fn send_from_address(params: SendEVMRequest) -> Result<String, WalletError> {
    eth_tents_mod::intent::IntentService::send_from_address(params).await
}

#[cfg(not(feature = "no_candid"))]
#[update(name = "testUnwrap")]
#[candid_method(update, rename = "testUnwrap")]
pub fn test_unwrap(killer: Option<Principal>) -> String {
    killer.unwrap().to_string()
}
//
// #[cfg(not(feature = "no_candid"))]
// #[update(name = "insert_user", guard = "owner_guard")]
// #[candid_method(update, rename = "insert_user")]
// pub fn insert_user(user_id: u16, user_name: String) -> UserProfile {
//     Example::add_user(user_id, user_name)
// }
//
// #[cfg(not(feature = "no_candid"))]
// #[query(name = "get_user", guard = "owner_guard")]
// #[candid_method(query, rename = "get_user")]
// pub fn get_user(user_id: u16) -> Option<UserProfile> {
//     Example::get_user(user_id)
// }
//
// #[cfg(not(feature = "no_candid"))]
// #[query(name = "get_all_users", guard = "owner_guard")]
// #[candid_method(query, rename = "get_all_users")]
// pub fn get_all_users() -> Vec<UserProfile> {
//     info_log_add("eth_tents: get_all_users");
//     Example::get_all_users()
// }
//
// #[cfg(not(feature = "no_candid"))]
// #[update(name = "insert_wallet", guard = "owner_guard")]
// #[candid_method(update, rename = "insert_wallet")]
// pub fn insert_wallet(user_id: u16, balance: u32) -> UserWallet {
//     Example::add_wallet(user_id, balance)
// }
//
// #[cfg(not(feature = "no_candid"))]
// #[query(name = "get_wallet", guard = "owner_guard")]
// #[candid_method(query, rename = "get_wallet")]
// pub fn get_wallet(user_id: u16) -> Option<UserWallet> {
//     Example::get_wallet(user_id)
// }
//
// #[cfg(not(feature = "no_candid"))]
// #[query(name = "get_all_wallets", guard = "owner_guard")]
// #[candid_method(query, rename = "get_all_wallets")]
// pub fn get_all_wallets() -> Vec<UserWallet> {
//     info_log_add("eth_tents: get_all_wallets");
//     Example::get_all_wallets()
// }
