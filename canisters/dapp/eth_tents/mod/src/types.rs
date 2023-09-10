use candid::CandidType;
use ic_stable_structures::{BoundedStorable, Storable};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

use crate::memory::{USERS, WALLETS, WALLET_CONFIG};
use candid::{Decode, Encode};
use ego_types::app_info::AppInfo;
use ego_types::registry::Registry;
use ego_types::user::User;
use itertools::Itertools;

const MAX_STATE_SIZE: u32 = 2 * 1024 * 1024;
const MAX_USER_PROFILE_SIZE: u32 = 1 * 1024 * 1024;
const MAX_USER_WALLET_SIZE: u32 = 1 * 1024 * 1024;

const MAX_USER_INTENT_SIZE: u32 = 1 * 1024 * 1024;

#[derive(CandidType, Serialize, Deserialize)]
pub struct StableState {
    pub users: Option<User>,
    pub registry: Option<Registry>,
    pub app_info: Option<AppInfo>,
}

impl Storable for StableState {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for StableState {
    const MAX_SIZE: u32 = MAX_STATE_SIZE;
    const IS_FIXED_SIZE: bool = false;
}

impl Default for StableState {
    fn default() -> Self {
        StableState {
            users: None,
            registry: None,
            app_info: None,
        }
    }
}

#[derive(CandidType, Deserialize)]
pub struct UserProfile {
    user_id: u16,
    user_name: String,
}

impl Storable for UserProfile {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for UserProfile {
    const MAX_SIZE: u32 = MAX_USER_PROFILE_SIZE;
    const IS_FIXED_SIZE: bool = false;
}

#[derive(CandidType, Deserialize)]
pub struct UserWallet {
    user_id: u16,
    balance: u32,
}

impl Storable for UserWallet {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for UserWallet {
    const MAX_SIZE: u32 = MAX_USER_WALLET_SIZE;
    const IS_FIXED_SIZE: bool = false;
}

pub struct Example {}

impl Example {
    pub fn add_user(user_id: u16, user_name: String) -> UserProfile {
        USERS.with(|users| {
            let mut user_borrow_mut = users.borrow_mut();

            // if !user_borrow_mut.contains_key(&user_id) {
            user_borrow_mut.insert(user_id, UserProfile { user_id, user_name });
            // }

            user_borrow_mut.get(&user_id).unwrap()
        })
    }

    pub fn get_user(user_id: u16) -> Option<UserProfile> {
        USERS.with(|users| users.borrow().get(&user_id))
    }

    pub fn get_all_users() -> Vec<UserProfile> {
        USERS.with(|users| {
            users
                .borrow()
                .iter()
                .map(|(_, user_profile)| user_profile)
                .collect_vec()
        })
    }

    pub fn add_wallet(user_id: u16, balance: u32) -> UserWallet {
        WALLETS.with(|wallets| {
            let mut user_borrow_mut = wallets.borrow_mut();

            if !user_borrow_mut.contains_key(&user_id) {
                user_borrow_mut.insert(user_id, UserWallet { user_id, balance });
            }

            user_borrow_mut.get(&user_id).unwrap()
        })
    }

    pub fn get_wallet(user_id: u16) -> Option<UserWallet> {
        WALLETS.with(|wallets| wallets.borrow().get(&user_id))
    }

    pub fn get_all_wallets() -> Vec<UserWallet> {
        WALLETS.with(|wallets| {
            wallets
                .borrow()
                .iter()
                .map(|(_, user_profile)| user_profile)
                .collect_vec()
        })
    }
}

#[derive(CandidType, Deserialize)]
pub struct UserIntents {
    pub user_address: String,
    pub intent_bytes: Vec<u8>,
    pub is_finished: bool,
}

impl Storable for UserIntents {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for UserIntents {
    const MAX_SIZE: u32 = MAX_USER_INTENT_SIZE;
    const IS_FIXED_SIZE: bool = false;
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct AddressString(pub String);

impl Storable for AddressString {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for AddressString {
    const MAX_SIZE: u32 = 64;
    const IS_FIXED_SIZE: bool = false;
}

#[derive(CandidType, Serialize, Deserialize, Clone, Eq, PartialEq)]
pub struct IntentWalletConfig {
    pub api_key: String,
    pub cycles: Option<u64>,
}

impl Default for IntentWalletConfig {
    fn default() -> Self {
        IntentWalletConfig {
            api_key: "".to_string(),
            cycles: Some(1_0000_0000_0000u64),
        }
    }
}

impl IntentWalletConfig {
    pub fn load() -> Self {
        WALLET_CONFIG.with(|s| s.borrow().get().clone())
    }

    pub fn restore(state: Self) {
        WALLET_CONFIG.with(|s| s.borrow_mut().set(state).unwrap());
    }
}

impl Storable for IntentWalletConfig {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for IntentWalletConfig {
    const MAX_SIZE: u32 = 1024;
    const IS_FIXED_SIZE: bool = false;
}
