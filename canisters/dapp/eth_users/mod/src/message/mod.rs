use crate::common::memory::get_btree;
use crate::common::{new_random_string, secs_to_nanos};
use crate::delegation::hash::hash_string;
use crate::memory::MSGS;
use crate::types::{ChainType, SecureMessage};
use candid::Principal;
use ic_stable_structures::Storable;
use rand::rngs::StdRng;
use rand::{RngCore, SeedableRng};
use std::borrow::Cow;

pub mod btc;
pub mod evm;

const LOGIN_PREFIX: &str = "Sign In Nonce:";

pub async fn get_secure_message(
    caller: Principal,
    chain_type: ChainType,
    fast: bool,
) -> Result<String, String> {
    let key_str = match chain_type {
        ChainType::EVM => "evm_message_prefix".to_string(),
        ChainType::BTC => "btc_message_prefix".to_string(),
    };

    let prefix_value = match get_btree(key_str) {
        None => LOGIN_PREFIX.to_string(),
        Some(v) => String::from_bytes(Cow::from(v.value)),
    };

    let r_string;

    if fast == true {
        let mut r_bytes = [0u8; 32];
        let mut rd_vec = [0u8; 32];
        rd_vec[0..8].clone_from_slice(&ic_cdk::api::time().to_le_bytes());
        rd_vec[8..16].clone_from_slice(&ic_cdk::api::time().to_le_bytes());
        rd_vec[16..24].clone_from_slice(&ic_cdk::api::time().to_le_bytes());
        rd_vec[24..32].clone_from_slice(&ic_cdk::api::time().to_le_bytes());

        StdRng::from_seed(rd_vec).fill_bytes(&mut r_bytes);
        let s = (r_bytes[0..8]).to_vec();
        r_string = hex::encode(s);
    } else {
        r_string = new_random_string().await;
    }
    let id_bytes = hash_string(r_string.as_str()).to_vec();
    let mut final_bytes = [0u8; 8];
    final_bytes.copy_from_slice(&id_bytes[0..8]);
    let id = hex::encode(final_bytes);
    let content = format!("{} {}", prefix_value.as_str(), r_string.as_str());
    let expire_at = ic_cdk::api::time() + secs_to_nanos(15);
    let msg = SecureMessage {
        id: id.clone(),
        caller,
        content: content.clone().to_bytes().to_vec(),
        expire_at,
    };
    match get_secure_message_by_id(id.clone().as_str()) {
        None => {
            MSGS.with(|m| m.borrow_mut().push(msg));
            Ok(content.clone())
        }
        Some(_) => {
            remove_secure_message_by_id(id.clone().as_str());
            Err("id already exists".to_string())
        }
    }
}

pub fn get_secure_message_by_id(id: &str) -> Option<SecureMessage> {
    MSGS.with(|m| m.borrow().iter().find(|f| f.id == id).map(|v| v.clone()))
}

pub fn remove_secure_message_by_id(id: &str) {
    MSGS.with(|m| m.borrow_mut().retain(|f| f.id != id));
}

pub fn get_secure_message_by_caller(caller: &Principal) -> Option<SecureMessage> {
    MSGS.with(|m| {
        m.borrow()
            .iter()
            .find(|f| f.caller == caller.clone())
            .map(|v| v.clone())
    })
}

pub fn clear_all_expired_message() {
    MSGS.with(|m| m.borrow_mut().retain(|f| f.expire_at > ic_cdk::api::time()));
}
