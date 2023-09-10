use crate::memory::{INTENTS, USERS};
use crate::state::info_log_add;
use crate::types::{AddressString, UserID, UserIntents};
use candid::Principal;
use helpers::hash::hash_string;

pub struct IntentService {}

impl IntentService {
    pub fn add_user(
        principal: Principal,
        user_address: String,
    ) -> Result<(Principal, String), String> {
        USERS.with(|f| {
            match f
                .borrow_mut()
                .insert(UserID(principal), AddressString(user_address.clone()))
            {
                None => {
                    info_log_add("add user success");
                    Ok((principal, user_address))
                }
                Some(_) => Err("user address already exists".to_string()),
            }
        })
    }

    pub fn get_user_by_principal(principal: Principal) -> Option<AddressString> {
        USERS.with(|f| f.borrow().get(&UserID(principal)))
    }

    pub fn get_user_by_address(user_address: String) -> Option<AddressString> {
        USERS.with(|f| {
            f.borrow()
                .iter()
                .find(|v| v.1 == AddressString(user_address.clone()))
                .map(|v| v.1.clone())
        })
    }

    pub fn add_user_intent(intents: UserIntents) -> Result<UserIntents, String> {
        let intent_id = get_intent_id(intents.user_address.clone());
        INTENTS.with(|f| {
            f.borrow_mut()
                .insert(intent_id.1, intents.clone())
                .map_or_else(
                    || {
                        info_log_add("add user intent success");
                        Ok(UserIntents {
                            intent_id: Some(intent_id.0),
                            ..intents
                        })
                    },
                    |_| Err("user address already exists".to_string()),
                )
        })
    }
    pub fn get_user_intent(user_address: String) -> Vec<UserIntents> {
        INTENTS.with(|f| {
            f.borrow()
                .iter()
                .filter(|v| v.1.user_address == user_address)
                .map(|v| v.1.clone())
                .collect()
        })
    }

    pub fn remove_user_intent_by_id(intent_id: String) -> Option<UserIntents> {
        let mut u8_arr = [0u8; 8];
        let arr = hex::decode(intent_id).unwrap();
        u8_arr.copy_from_slice(&arr);
        INTENTS.with(|f| f.borrow_mut().remove(&u8_arr))
    }

    pub fn get_all_intents() -> Vec<UserIntents> {
        INTENTS.with(|f| f.borrow().iter().map(|v| v.1.clone()).collect())
    }
}

pub fn get_intent_id(id_string: String) -> (String, [u8; 8]) {
    let time_string = ic_cdk::api::time().to_string();

    let ticket_hash =
        hash_string((format!("{}-{}", id_string.to_string(), time_string.to_string(),)).as_str());
    let mut ticket_id = [0u8; 8];
    ticket_id.copy_from_slice(&ticket_hash[24..]);
    let ticket_id_string = hex::encode(ticket_id);
    (ticket_id_string, ticket_id)
}
