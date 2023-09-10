use crate::message::{get_secure_message_by_caller, remove_secure_message_by_id};
use crate::types::VerifyMessagePayload;
use candid::Principal;
use ic_stable_structures::Storable;
use siwe::{Message, VerificationOpts};
use std::borrow::Cow;
use std::str::FromStr;
use time::OffsetDateTime;

pub async fn verify_evm_message(
    req: VerifyMessagePayload,
    caller: &Principal,
) -> Result<(), String> {
    match get_secure_message_by_caller(caller) {
        None => {
            return Err("No message found".to_string());
        }
        Some(r) => {
            ic_cdk::print(format!(
                "r.content is {}",
                String::from_bytes(Cow::from(r.content.clone()))
            ));
            ic_cdk::print(format!("req.message is {}", req.message.clone()));
            if String::from_bytes(Cow::from(r.content.clone())) != req.message.clone() {
                remove_secure_message_by_id(r.id.clone().as_str());
                return Err("Invalid Message".to_string());
            } else {
                match _verify_message(req.clone()).await {
                    Ok(_) => {
                        remove_secure_message_by_id(r.id.clone().as_str());
                        Ok(())
                    }
                    Err(e) => {
                        remove_secure_message_by_id(r.id.clone().as_str());
                        return Err(format!("Message Validation Failed: {}", e));
                    }
                }
            }
        }
    }
}

async fn _verify_message(req: VerifyMessagePayload) -> Result<(), String> {
    let message = Message::from_str(req.formatted_message.as_str())
        .map_err(|e| format!("formatted_message error: {}", e.to_string()))?;
    let s_bytes = hex::decode(req.signature.as_str())
        .map_err(|e| format!("req.signature error: {}", e.to_string()))?;
    let mut signature = [0u8; 65];
    signature.clone_from_slice(s_bytes.as_slice());
    message
        .verify(
            &signature,
            &VerificationOpts {
                domain: None,
                nonce: None,
                timestamp: Some(
                    OffsetDateTime::from_unix_timestamp(
                        (ic_cdk::api::time() / (1_000_000_000)) as i64,
                    )
                    .unwrap(),
                ),
            },
        )
        .await
        .map_err(|e| format!("message.verify error: {}", e.to_string()))
}
