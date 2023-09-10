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
use eth_users_mod::state::*;
use eth_users_mod::types::{
    BtreeValue, ChainType, GetDelegationRequest, GetDelegationResponse, PrepareDelegationResponse,
    VerifyMessagePayload,
};

// ------------------
//
// ** injections
//
// ------------------
// injection ego apis
inject_ego_api!();
inject_app_info_api!();

#[cfg(not(feature = "no_candid"))]
#[warn(unused_must_use)]
#[init]
#[candid_method(init, rename = "init")]
fn canister_init() {
    let caller = caller();
    info_log_add(format!("did_cash_id: init, caller is {}", caller.clone()).as_str());
    owner_add(caller);
}

#[pre_upgrade]
pub fn pre_upgrade() {
    eth_users_mod::state::pre_upgrade()
}

#[post_upgrade]
pub fn post_upgrade() {
    eth_users_mod::state::post_upgrade();
}

#[cfg(not(feature = "no_candid"))]
#[update(name = "whoAmI", guard = "owner_guard")]
#[candid_method(update, rename = "whoAmI")]
pub fn who_am_i() -> Principal {
    caller()
}

#[cfg(not(feature = "no_candid"))]
#[update(name = "ensureSaltSet", guard = "owner_guard")]
#[candid_method(update, rename = "ensureSaltSet")]
pub async fn ensure_salt_set() -> Vec<u8> {
    eth_users_mod::verifier::memory::ensure_salt_set().await
}

#[cfg(not(feature = "no_candid"))]
#[update(name = "setLoginPrefix", guard = "owner_guard")]
#[candid_method(update, rename = "setLoginPrefix")]
pub async fn set_login_prefix(chain_type: ChainType, prefix: String) {
    match chain_type {
        ChainType::BTC => {
            eth_users_mod::common::memory::insert_btree(
                "btc_message_prefix".to_string(),
                BtreeValue {
                    key: "btc_message_prefix".to_string(),
                    value: prefix.as_bytes().to_vec(),
                },
            );
        }
        ChainType::EVM => {
            eth_users_mod::common::memory::insert_btree(
                "evm_message_prefix".to_string(),
                BtreeValue {
                    key: "evm_message_prefix".to_string(),
                    value: prefix.as_bytes().to_vec(),
                },
            );
        }
    }
}

#[cfg(not(feature = "no_candid"))]
#[update(name = "secureMessage")]
#[candid_method(update, rename = "secureMessage")]
pub async fn secure_message(chain_type: ChainType, fast: bool) -> Result<String, String> {
    eth_users_mod::message::get_secure_message(caller(), chain_type, fast).await
}

#[cfg(not(feature = "no_candid"))]
#[update(name = "verifyMessage")]
#[candid_method(update, rename = "verifyMessage")]
pub async fn verify_message_(
    req: VerifyMessagePayload,
) -> Result<PrepareDelegationResponse, String> {
    match req.chain_type {
        ChainType::BTC => {
            match eth_users_mod::message::btc::verify_bitcoin_message(req.clone(), &caller()) {
                Ok(_) => Ok(eth_users_mod::address::AddressService::prepare_delegation(
                    req.clone(),
                    caller(),
                )),
                Err(_) => Err("verify_bitcoin_message failed".to_string()),
            }
        }
        ChainType::EVM => {
            match eth_users_mod::message::evm::verify_evm_message(req.clone(), &caller()).await {
                Ok(_) => Ok(eth_users_mod::address::AddressService::prepare_delegation(
                    req.clone(),
                    caller(),
                )),
                Err(e) => Err(format!("verify_evm_message: {}", e)),
            }
        }
    }
}

#[cfg(not(feature = "no_candid"))]
#[query(name = "getDelegation", composite = true)]
#[candid_method(query, rename = "getDelegation")]
pub fn get_delegation(req: GetDelegationRequest) -> GetDelegationResponse {
    eth_users_mod::address::AddressService::get_delegation(req, &caller())
}
