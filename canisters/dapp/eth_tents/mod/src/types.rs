use candid::CandidType;
use ic_stable_structures::{BoundedStorable, Storable};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

use crate::memory::WALLET_CONFIG;
use candid::{Decode, Encode};
// use ego_types::app_info::AppInfo;
// use ego_types::registry::Registry;
// use ego_types::user::User;
// use itertools::Itertools;

// const MAX_STATE_SIZE: u32 = 2 * 1024 * 1024;
// const MAX_USER_PROFILE_SIZE: u32 = 1 * 1024 * 1024;
// const MAX_USER_WALLET_SIZE: u32 = 1 * 1024 * 1024;

const MAX_USER_INTENT_SIZE: u32 = 1 * 1024 * 1024;

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
