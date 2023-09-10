use crate::delegation::signature::{
    add_signature, der_encode_canister_sig_key, get_signature, update_root_hash,
};
use crate::memory::{ADDRESSES, ASSET_HASHES, DELEGATION_ID, MEMORY_MANAGER, SIGS, VM};
use crate::types::{
    BtreeValue, Delegation, GetDelegationResponse, PrepareDelegationResponse, SessionKey,
    SignedDelegation, Timestamp,
};
use crate::verifier::types::{Salt, UserDetail, UserKey};
use candid::Principal;
use ic_cdk::trap;
use serde_bytes::ByteBuf;
use std::str::Bytes;

use crate::common::memory::{get_btree, insert_btree};
use crate::common::{DEFAULT_EXPIRATION_PERIOD_NS, MAX_EXPIRATION_PERIOD_NS};
use ic_certified_map::Hash;

use crate::delegation::hash;
use crate::delegation::signature::prune_expired_signatures;

pub fn get_address_memory() -> VM {
    MEMORY_MANAGER.with(|m| m.borrow().get(DELEGATION_ID))
}

pub fn get_address_info(user_id: UserKey) -> Option<UserDetail> {
    ADDRESSES.with(|m| m.borrow().get(&user_id))
}

pub fn get_salt() -> Option<BtreeValue> {
    get_btree("salt".to_string())
}
pub fn set_salt(value: Salt) {
    insert_btree(
        "salt".to_string(),
        BtreeValue {
            key: "salt".to_string(),
            value: value.to_vec(),
        },
    )
}

pub async fn ensure_salt_set() -> Vec<u8> {
    match get_salt() {
        None => {
            let res: Vec<u8> =
                match ic_cdk::call(Principal::management_canister(), "raw_rand", ()).await {
                    Ok((res,)) => res,
                    Err((_, err)) => trap(&format!("failed to get salt: {}", err)),
                };
            let salt: Salt = res[..].try_into().unwrap_or_else(|_| {
                trap(&format!(
                    "expected raw randomness to be of length 32, got {}",
                    res.len()
                ));
            });
            set_salt(salt.clone());
            salt.clone().to_vec()
        }
        Some(r) => r.value.clone(),
    }
}

pub fn prepare_delegation(
    user_name: String,
    session_key: SessionKey,
    max_time_to_live: Option<u64>,
    targets: Option<Vec<Principal>>,
) -> PrepareDelegationResponse {
    let btree_value = get_salt().unwrap();
    let salt = vec_to_fix_bytes(btree_value.value.clone());
    let delta = u64::min(
        max_time_to_live.unwrap_or(DEFAULT_EXPIRATION_PERIOD_NS),
        MAX_EXPIRATION_PERIOD_NS,
    );
    let expiration = (ic_cdk::api::time()).saturating_add(delta);
    let seed = calculate_seed(user_name.clone(), &salt.clone(), None);
    SIGS.with(|s| {
        let mut sigs = s.borrow_mut();
        add_signature(&mut sigs, session_key, seed, expiration, targets);
        ASSET_HASHES.with(|a| {
            let asset = a.borrow().clone();
            update_root_hash(&asset, &sigs);
            prune_expired_signatures(&asset, &mut sigs);
            PrepareDelegationResponse {
                user_key: ByteBuf::from(der_encode_canister_sig_key(seed.to_vec())),
                expiration,
            }
        })
    })
}

pub(crate) fn id_delegation_get(
    user_name: String,
    session_key: SessionKey,
    expiration: Timestamp,
    targets: Option<Vec<Principal>>,
) -> GetDelegationResponse {
    SIGS.with(|s| {
        let sigs = s.borrow();
        ASSET_HASHES.with(|a| {
            let asset = a.borrow().clone();
            let btree_value = get_salt().unwrap();
            let salt = vec_to_fix_bytes(btree_value.value.clone());
            let seed = calculate_seed(user_name.clone(), &salt.clone(), None);
            let z: [u8; 32] = (&seed[..]).try_into().unwrap();
            match get_signature(
                &asset,
                &sigs,
                session_key.clone(),
                z,
                expiration,
                targets.clone(),
            ) {
                Some(signature) => GetDelegationResponse::SignedDelegation(SignedDelegation {
                    delegation: Delegation {
                        pubkey: session_key,
                        expiration,
                        targets: targets.clone(),
                    },
                    signature: ByteBuf::from(signature),
                }),
                None => GetDelegationResponse::NoSuchDelegation,
            }
        })
    })
}

pub fn calculate_seed(user_name: String, salt: &[u8; 32], ext_bytes: Option<Bytes>) -> Hash {
    let mut blob: Vec<u8> = vec![];
    blob.push(salt.len() as u8);
    blob.extend_from_slice(&salt.as_slice());

    let user_number_str = user_name.to_string();
    let user_number_blob = user_number_str.bytes();
    blob.push(user_number_blob.len() as u8);
    blob.extend(user_number_blob);
    if ext_bytes.is_some() {
        let b = ext_bytes.unwrap();
        blob.push(b.len() as u8);
        blob.extend(b.clone());
    }
    hash::hash_bytes(blob)
}

pub fn prune_sigs() {
    SIGS.with(|s| {
        let mut sigs = s.borrow_mut();
        ASSET_HASHES.with(|a| {
            let asset = a.borrow().clone();
            prune_expired_signatures(&asset, &mut sigs);
        })
    })
}

pub fn vec_to_fix_bytes(req: Vec<u8>) -> [u8; 32] {
    if req.len() != 32 {
        ic_cdk::trap("Salt length should be 32")
    }
    let mut salt_bytes = [0u8; 32];

    for i in 0..32 {
        salt_bytes[i] = req[i.clone()]
    }
    salt_bytes.clone()
}

pub fn insert_address(key: UserKey, value: UserDetail) -> Option<UserDetail> {
    ADDRESSES.with(|f| f.borrow_mut().insert(key, value))
}

pub fn remove_address(key: UserKey) -> Option<UserDetail> {
    ADDRESSES.with(|f| f.borrow_mut().remove(&key))
}

pub fn update_address(key: UserKey, value: UserDetail) -> Option<UserDetail> {
    // remove_address(key.clone());
    insert_address(key, value)
}

pub fn get_address(key: UserKey) -> Option<UserDetail> {
    ADDRESSES.with(|f| f.borrow_mut().get(&key))
}
