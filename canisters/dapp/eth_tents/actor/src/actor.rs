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
use ic_cdk::caller;
use ic_cdk_macros::*;

// ------------------
//
// **Project dependencies
//
// ------------------
// injected macros
use eth_tents_mod::state::*;
use eth_tents_mod::types::{Example, UserProfile, UserWallet};

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

#[cfg(not(feature = "no_candid"))]
#[update(name = "whoAmI", guard = "owner_guard")]
#[candid_method(update, rename = "whoAmI")]
pub fn who_am_i() -> Principal {
    ic_cdk::api::caller()
}

#[cfg(not(feature = "no_candid"))]
#[update(name = "testUnwrap")]
#[candid_method(update, rename = "testUnwrap")]
pub fn test_unwrap(killer: Option<Principal>) -> String {
    killer.unwrap().to_string()
}

#[cfg(not(feature = "no_candid"))]
#[update(name = "insert_user", guard = "owner_guard")]
#[candid_method(update, rename = "insert_user")]
pub fn insert_user(user_id: u16, user_name: String) -> UserProfile {
    Example::add_user(user_id, user_name)
}

#[cfg(not(feature = "no_candid"))]
#[query(name = "get_user", guard = "owner_guard")]
#[candid_method(query, rename = "get_user")]
pub fn get_user(user_id: u16) -> Option<UserProfile> {
    Example::get_user(user_id)
}

#[cfg(not(feature = "no_candid"))]
#[query(name = "get_all_users", guard = "owner_guard")]
#[candid_method(query, rename = "get_all_users")]
pub fn get_all_users() -> Vec<UserProfile> {
    info_log_add("eth_tents: get_all_users");
    Example::get_all_users()
}

#[cfg(not(feature = "no_candid"))]
#[update(name = "insert_wallet", guard = "owner_guard")]
#[candid_method(update, rename = "insert_wallet")]
pub fn insert_wallet(user_id: u16, balance: u32) -> UserWallet {
    Example::add_wallet(user_id, balance)
}

#[cfg(not(feature = "no_candid"))]
#[query(name = "get_wallet", guard = "owner_guard")]
#[candid_method(query, rename = "get_wallet")]
pub fn get_wallet(user_id: u16) -> Option<UserWallet> {
    Example::get_wallet(user_id)
}

#[cfg(not(feature = "no_candid"))]
#[query(name = "get_all_wallets", guard = "owner_guard")]
#[candid_method(query, rename = "get_all_wallets")]
pub fn get_all_wallets() -> Vec<UserWallet> {
    info_log_add("eth_tents: get_all_wallets");
    Example::get_all_wallets()
}
