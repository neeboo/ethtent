use candid::{CandidType, Principal};
use ic_stable_structures::{BoundedStorable, Storable};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use std::str::FromStr;

use crate::memory::WALLET_CONFIG;
use candid::{Decode, Encode};

use ic_web3::types::{Address, Bytes, U256};
// use ego_types::app_info::AppInfo;
// use ego_types::registry::Registry;
// use ego_types::user::User;
// use itertools::Itertools;

// const MAX_STATE_SIZE: u32 = 2 * 1024 * 1024;
// const MAX_USER_PROFILE_SIZE: u32 = 1 * 1024 * 1024;
// const MAX_USER_WALLET_SIZE: u32 = 1 * 1024 * 1024;

const MAX_USER_INTENT_SIZE: u32 = 1 * 1024 * 1024;

#[derive(CandidType, Serialize, Deserialize, Clone, Ord, PartialOrd, Eq, PartialEq)]
pub struct UserID(pub Principal);

impl Storable for UserID {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(self.0.as_slice().to_vec())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        UserID(Principal::from_slice(bytes.as_ref()))
    }
}

impl BoundedStorable for UserID {
    const MAX_SIZE: u32 = 32;
    const IS_FIXED_SIZE: bool = false;
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct UserIntents {
    pub user_address: String,
    pub intent_bytes: Vec<u8>,
    pub intent_id: Option<String>,
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

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub enum OrderType {
    Market,
    BuyLimit,
    SellLimit,
    BuyStop,
    SellStop,
}
#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct OrderDetail {
    pub order_type: OrderType,
    pub order_price: u128,
    pub max_spread: u128,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct ETHIntentItem {
    pub intender: Address,
    pub to_chain_id: U256,
    pub recipient: Address,
    pub token_in: Address,
    pub token_out: Address,
    pub amount: U256,
    pub fee_rate: U256,
    pub expiration: U256,
    pub signature_hash: Bytes,
    pub intent_id: Option<String>,
    pub order_detail: Option<OrderDetail>,
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct IntentItem {
    pub intender: String,
    pub to_chain_id: u128,
    pub recipient: String,
    pub token_in: String,
    pub token_out: String,
    pub amount: u128,
    pub fee_rate: u128,
    pub expiration: u128,
    pub signature_hash: Vec<u8>,
    pub intent_id: Option<String>,
    pub order_detail: Option<OrderDetail>,
}

impl Storable for IntentItem {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for IntentItem {
    const MAX_SIZE: u32 = 1024;
    const IS_FIXED_SIZE: bool = false;
}

impl From<ETHIntentItem> for IntentItem {
    fn from(value: ETHIntentItem) -> Self {
        IntentItem {
            intender: value.intender.to_string(),
            to_chain_id: 0,
            recipient: value.recipient.to_string(),
            token_in: value.token_in.to_string(),
            token_out: value.token_out.to_string(),
            amount: value.amount.as_u128(),
            fee_rate: value.fee_rate.as_u128(),
            expiration: value.expiration.as_u128(),
            signature_hash: value.signature_hash.0,
            intent_id: value.intent_id,
            order_detail: value.order_detail,
        }
    }
}

impl From<IntentItem> for ETHIntentItem {
    fn from(value: IntentItem) -> Self {
        ETHIntentItem {
            intender: Address::from_str(value.intender.as_str()).unwrap(),
            to_chain_id: U256::from(value.to_chain_id),
            recipient: Address::from_str(value.recipient.as_str()).unwrap(),
            token_in: Address::from_str(value.token_in.as_str()).unwrap(),
            token_out: Address::from_str(value.token_out.as_str()).unwrap(),
            amount: U256::from(value.amount),
            fee_rate: U256::from(value.fee_rate),
            expiration: U256::from(value.expiration),
            signature_hash: Bytes(value.signature_hash),
            intent_id: value.intent_id,
            order_detail: value.order_detail,
        }
    }
}
