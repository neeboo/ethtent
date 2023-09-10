use candid::CandidType;
use ic_stable_structures::{BoundedStorable, Storable};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

// use crate::memory::{USERS, WALLETS};
use candid::Principal;
use candid::{Decode, Encode};
use ego_types::app_info::AppInfo;
use ego_types::registry::Registry;
use ego_types::user::User;
use serde_bytes::ByteBuf;

const MAX_STATE_SIZE: u32 = 2 * 1024 * 1024;
// const MAX_USER_PROFILE_SIZE: u32 = 1 * 1024 * 1024;
// const MAX_USER_WALLET_SIZE: u32 = 1 * 1024 * 1024;

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

//
// #[derive(CandidType, Deserialize)]
// pub struct UserProfile {
//     user_id: u16,
//     user_name: String,
// }
//
// impl Storable for UserProfile {
//     fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
//
//     fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
// }
//
// impl BoundedStorable for UserProfile {
//     const MAX_SIZE: u32 = MAX_USER_PROFILE_SIZE;
//     const IS_FIXED_SIZE: bool = false;
// }
//
// #[derive(CandidType, Deserialize)]
// pub struct UserWallet {
//     user_id: u16,
//     balance: u32,
// }
//
// impl Storable for UserWallet {
//     fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
//         Cow::Owned(Encode!(self).unwrap())
//     }
//
//     fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
//         Decode!(bytes.as_ref(), Self).unwrap()
//     }
// }
//
// impl BoundedStorable for UserWallet {
//     const MAX_SIZE: u32 = MAX_USER_WALLET_SIZE;
//     const IS_FIXED_SIZE: bool = false;
// }
//
// pub struct WizzVerifierStates {}
//
// impl WizzVerifierStates {
//     pub fn add_user(user_id: u16, user_name: String) -> UserProfile {
//         USERS.with(|users| {
//             let mut user_borrow_mut = users.borrow_mut();
//
//             if !user_borrow_mut.contains_key(&user_id) {
//                 user_borrow_mut.insert(user_id, UserProfile { user_id, user_name });
//             }
//
//             user_borrow_mut.get(&user_id).unwrap()
//         })
//     }
//
//     pub fn get_user(user_id: u16) -> Option<UserProfile> {
//         USERS.with(|users| users.borrow().get(&user_id))
//     }
//
//     pub fn get_all_users() -> Vec<UserProfile> {
//         USERS.with(|users| {
//             users
//                 .borrow()
//                 .iter()
//                 .map(|(_, user_profile)| user_profile)
//                 .collect_vec()
//         })
//     }
//
//     pub fn add_wallet(user_id: u16, balance: u32) -> UserWallet {
//         WALLETS.with(|wallets| {
//             let mut user_borrow_mut = wallets.borrow_mut();
//
//             if !user_borrow_mut.contains_key(&user_id) {
//                 user_borrow_mut.insert(user_id, UserWallet { user_id, balance });
//             }
//
//             user_borrow_mut.get(&user_id).unwrap()
//         })
//     }
//
//     pub fn get_wallet(user_id: u16) -> Option<UserWallet> {
//         WALLETS.with(|wallets| wallets.borrow().get(&user_id))
//     }
//
//     pub fn get_all_wallets() -> Vec<UserWallet> {
//         WALLETS.with(|wallets| {
//             wallets
//                 .borrow()
//                 .iter()
//                 .map(|(_, user_profile)| user_profile)
//                 .collect_vec()
//         })
//     }
// }

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum ChainType {
    BTC,
    EVM,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct VerifyMessagePayload {
    pub message: String,
    pub formatted_message: String,
    pub signature: String,
    pub address: String,
    pub public_key: Option<String>,
    pub session_key: SessionKey,
    pub chain_type: ChainType,
}

pub type PublicKey = ByteBuf;
pub type Timestamp = u64;
pub type DeviceVerificationCode = String;
pub type FailedAttemptsCounter = u8;
pub type SessionKey = ByteBuf;
pub type Signature = ByteBuf;

#[derive(Clone, CandidType, Deserialize)]
pub struct SecureMessage {
    pub id: String,
    pub caller: Principal,
    pub content: Vec<u8>,
    pub expire_at: Timestamp,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct Delegation {
    pub pubkey: PublicKey,
    pub expiration: Timestamp,
    pub targets: Option<Vec<Principal>>,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct SignedDelegation {
    pub delegation: Delegation,
    pub signature: Signature,
}

#[derive(Clone, CandidType, Deserialize)]
pub enum GetDelegationResponse {
    #[serde(rename = "signed_delegation")]
    SignedDelegation(SignedDelegation),
    #[serde(rename = "no_such_delegation")]
    NoSuchDelegation,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct PrepareDelegationResponse {
    pub user_key: ByteBuf,
    pub expiration: Timestamp,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct GetDelegationRequest {
    pub user_address: String,
    pub session_key: SessionKey,
    pub expiration: Timestamp,
    pub targets: Option<Vec<Principal>>,
}

// common btree

/// We define a example key with String
/// because String is expandable, cannot store in stable structure directly
/// so we use a struct to wrap it.
#[derive(CandidType, Serialize, Deserialize, Ord, PartialOrd, Eq, PartialEq, Clone)]
pub struct BtreeKey(pub String);

impl Storable for BtreeKey {
    fn to_bytes(&self) -> Cow<[u8]> {
        self.0.to_bytes()
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Self(String::from_bytes(bytes))
    }
}

impl BoundedStorable for BtreeKey {
    // 128 for example
    const MAX_SIZE: u32 = 128;
    const IS_FIXED_SIZE: bool = false;
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct BtreeValue {
    /// key is expandable
    /// but we have to give it a boundary
    /// say 128 bytes
    pub key: String,
    /// value is expandable
    /// but we have to give it a boundary
    /// say 896 bytes
    pub value: Vec<u8>,
}

impl Storable for BtreeValue {
    // serialize the struct to bytes
    fn to_bytes(&self) -> Cow<[u8]> {
        candid::encode_one::<&BtreeValue>(self)
            .expect("Error: Candid Serializing BtreeValue")
            .into()
    }

    // deserialize the btyes to struct
    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one::<BtreeValue>(bytes.as_ref())
            .expect("Error: Candid DeSerializing BtreeValue")
    }
}

impl BoundedStorable for BtreeValue {
    /// 128 + 896 = 1024
    const MAX_SIZE: u32 = 1024;
    const IS_FIXED_SIZE: bool = false;
}
