use crate::types::VerifyMessagePayload;
use base64::engine::general_purpose;
use base64::Engine;
use byteorder::{ByteOrder, LittleEndian};
use k256::ecdsa::recoverable;
use k256::elliptic_curve::sec1::ToEncodedPoint;
use std::borrow::Cow;

use candid::Principal;
use ic_stable_structures::Storable;
use k256::FieldBytes;

use crate::message::{get_secure_message_by_caller, remove_secure_message_by_id};
use sha2::digest::FixedOutput;
use sha2::{Digest, Sha256};
use std::mem::size_of;

const MAGIC_BYTES: &str = "Bitcoin Signed Message:\n";

struct BufferWriter {}

impl BufferWriter {
    fn varint_buf_num(n: i64) -> Vec<u8> {
        let mut buf = Vec::new();
        if n < 253 {
            buf.push(n as u8);
        } else if n < 0x10000 {
            buf.push(253);
            let mut bytes = [0u8; size_of::<u16>()];
            LittleEndian::write_u16(&mut bytes, n as u16);
            buf.extend_from_slice(&bytes);
        } else if n < 0x100000000 {
            buf.push(254);
            let mut bytes = [0u8; size_of::<u32>()];
            LittleEndian::write_u32(&mut bytes, n as u32);
            buf.extend_from_slice(&bytes);
        } else {
            buf.push(255);
            let mut bytes = [0u8; size_of::<u64>()];
            LittleEndian::write_i32(&mut bytes[0..4], (n & -1) as i32);
            LittleEndian::write_u32(&mut bytes[4..8], (n / 0x100000000) as u32);
            buf.extend_from_slice(&bytes);
        }
        buf
    }
}

fn _verify_message(req: VerifyMessagePayload) -> Result<(), String> {
    let message_prehashed = _msg_hash(req.message);
    let signature_bytes = general_purpose::STANDARD
        .decode(req.signature)
        .map_err(|_| "Invalid b64 signature".to_string())?;
    let public_key_bytes = req
        .public_key
        .map(|v| hex::decode(v).map_err(|_| "Invalid public key".to_string()))
        .unwrap_or(Err("Invalid public key".to_string()))?;
    let recovered_public_key = recover_pub_key_compact(
        signature_bytes.as_slice(),
        message_prehashed.as_slice(),
        None,
    )?;

    return if public_key_bytes.clone() != recovered_public_key.clone() {
        Err("public_key_bytes != recovered_public_key".to_string())
    } else {
        Ok(())
    };
}

pub fn _msg_hash(message: String) -> Vec<u8> {
    let prefix1 = BufferWriter::varint_buf_num(MAGIC_BYTES.len() as i64);
    let message_buffer = message.as_bytes().to_vec();
    let prefix2 = BufferWriter::varint_buf_num(message_buffer.len() as i64);
    let mut buf = Vec::new();
    buf.extend_from_slice(&prefix1);
    buf.extend_from_slice(MAGIC_BYTES.as_bytes());
    buf.extend_from_slice(&prefix2);
    buf.extend_from_slice(&message_buffer);

    let _hash = Sha256::new_with_prefix(buf);
    let hash = Sha256::new_with_prefix(_hash.finalize_fixed().to_vec());
    return hash.finalize_fixed().to_vec();
}

pub fn recover_pub_key_compact(
    signature_bytes: &[u8],
    message_prehashed: &[u8],
    chain_id: Option<u8>,
) -> Result<Vec<u8>, String> {
    let mut v;
    let r: Vec<u8> = signature_bytes[1..33].to_vec();
    let mut s: Vec<u8> = signature_bytes[33..65].to_vec();

    if signature_bytes.len() >= 65 {
        v = signature_bytes[0];
    } else {
        v = signature_bytes[33] >> 7;
        s[0] &= 0x7f;
    };
    if v < 27 {
        v = v + 27;
    }

    let mut bytes = [0u8; 65];
    if r.len() > 32 || s.len() > 32 {
        return Err("Cannot create secp256k1 signature: malformed signature.".to_string());
    }
    bytes[0..32].clone_from_slice(&r);
    bytes[32..64].clone_from_slice(&s);
    bytes[64] = calculate_sig_recovery(v.clone(), chain_id);

    let ecdsa_sig = recoverable::Signature::try_from(bytes.as_slice())
        .map_err(|err| format!("Cannot recover signature because: {}", err))?;

    let pubkey = ecdsa_sig
        .recover_verifying_key_from_digest_bytes(FieldBytes::from_slice(message_prehashed))
        .map_err(|err| format!("Cannot recover public key because: {}", err))?;

    Ok(pubkey.to_encoded_point(true).to_bytes().to_vec())
}

pub fn calculate_sig_recovery(v: u8, chain_id: Option<u8>) -> u8 {
    if v == 0 || v == 1 {
        return v;
    }

    return if chain_id.is_none() {
        v - 27
    } else {
        v - (chain_id.unwrap() * 2 + 35)
    };
}

pub fn verify_bitcoin_message(req: VerifyMessagePayload, caller: &Principal) -> Result<(), String> {
    match get_secure_message_by_caller(caller) {
        None => {
            return Err("No message found".to_string());
        }
        Some(r) => {
            if String::from_bytes(Cow::from(r.content)) != req.message {
                remove_secure_message_by_id(r.id.clone().as_str());
                return Err("Invalid Message".to_string());
            } else {
                match _verify_message(req.clone()) {
                    Ok(_) => {
                        remove_secure_message_by_id(r.id.clone().as_str());

                        Ok(())
                    }
                    Err(_) => {
                        remove_secure_message_by_id(r.id.clone().as_str());
                        return Err("Message Validation Failed".to_string());
                    }
                }
            }
        }
    }
}

pub fn msg_hash(message: String) -> Vec<u8> {
    _msg_hash(message)
}
