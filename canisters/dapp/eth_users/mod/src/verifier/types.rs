use candid::{CandidType, Principal};
use ic_stable_structures::{BoundedStorable, Storable};
use serde::{Deserialize, Serialize};

use crate::types::PublicKey;
use std::borrow::Cow;

/// We define a example key with String
/// because String is expandable, cannot store in stable structure directly
/// so we use a struct to wrap it.
#[derive(CandidType, Serialize, Deserialize, Ord, PartialOrd, Eq, PartialEq, Clone)]
pub struct UserKey(pub String);

impl Storable for UserKey {
    fn to_bytes(&self) -> Cow<[u8]> {
        self.0.to_bytes()
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Self(String::from_bytes(bytes))
    }
}

impl BoundedStorable for UserKey {
    // 128 for example
    const MAX_SIZE: u32 = 128;
    const IS_FIXED_SIZE: bool = false;
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct UserDetail {
    /// key is expandable
    /// but we have to give it a boundary
    /// say 128 bytes
    pub address: String,
    /// delegation principal
    pub session_id: Principal,
    pub delegation_chain_pubkey: Option<PublicKey>,
    /// value is expandable
    /// but we have to give it a boundary
    /// say 896 bytes
    pub pk_bytes: Option<Vec<u8>>,
}

impl Storable for UserDetail {
    // serialize the struct to bytes
    fn to_bytes(&self) -> Cow<[u8]> {
        candid::encode_one::<&UserDetail>(self)
            .expect("Error: Candid Serializing BtreeValue")
            .into()
    }

    // deserialize the btyes to struct
    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one::<UserDetail>(bytes.as_ref())
            .expect("Error: Candid DeSerializing UserDetail")
    }
}

impl BoundedStorable for UserDetail {
    /// 128 + 896 = 1024
    const MAX_SIZE: u32 = 1024;
    const IS_FIXED_SIZE: bool = false;
}

pub type Salt = [u8; 32];
