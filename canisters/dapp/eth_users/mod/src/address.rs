use crate::common::secs_to_nanos;
use crate::types::{
    GetDelegationRequest, GetDelegationResponse, PrepareDelegationResponse, VerifyMessagePayload,
};
use crate::verifier::memory::{
    get_address, id_delegation_get, insert_address, prepare_delegation, update_address,
};
use crate::verifier::types::{UserDetail, UserKey};
use candid::Principal;

pub struct AddressService {}

impl AddressService {
    pub fn prepare_delegation(
        req: VerifyMessagePayload,
        caller: Principal,
    ) -> PrepareDelegationResponse {
        match get_address(UserKey(req.address.clone())) {
            None => {
                insert_address(
                    UserKey(req.address.clone()),
                    UserDetail {
                        address: req.address.clone(),
                        session_id: caller.clone(),
                        delegation_chain_pubkey: None,
                        pk_bytes: req.public_key.map(|v| hex::decode(v).unwrap()),
                    },
                );
            }
            Some(r) => {
                ic_cdk::print(format!(
                    "update r.session_id is {}, and caller is {}",
                    r.session_id.to_text(),
                    caller.clone().to_text()
                ));
                update_address(
                    UserKey(req.address.clone()),
                    UserDetail {
                        session_id: caller.clone(),
                        ..r
                    },
                );
            }
        }

        prepare_delegation(
            req.address.clone(),
            req.session_key.clone(),
            Some(secs_to_nanos(3600)),
            None,
        )
    }

    pub fn get_delegation(req: GetDelegationRequest, caller: &Principal) -> GetDelegationResponse {
        match get_address(UserKey(req.user_address.clone())) {
            None => {
                ic_cdk::print(format!("user not found"));
                return GetDelegationResponse::NoSuchDelegation;
            }
            Some(r) => {
                if r.address != req.user_address {
                    ic_cdk::print(format!("r.address != req.address  "));
                    return GetDelegationResponse::NoSuchDelegation;
                }
                if r.session_id != caller.clone() {
                    ic_cdk::print(format!(
                        "session_id is: {}, and caller is: {}",
                        r.session_id.to_text(),
                        caller.clone().to_text()
                    ));
                    return GetDelegationResponse::NoSuchDelegation;
                }
                let dele = id_delegation_get(
                    req.user_address.clone(),
                    req.session_key.clone(),
                    req.expiration.clone(),
                    req.targets.clone(),
                );
                match dele.clone() {
                    GetDelegationResponse::SignedDelegation(e) => {
                        update_address(
                            UserKey(req.user_address.clone()),
                            UserDetail {
                                delegation_chain_pubkey: Some(e.delegation.pubkey.clone()),
                                ..r
                            },
                        );
                    }
                    GetDelegationResponse::NoSuchDelegation => {
                        ic_cdk::print(format!("GetDelegationResponse::NoSuchDelegation"));
                    }
                };
                ic_cdk::print(format!("GetDelegationResponse??"));
                dele.clone()
            }
        }
    }
}
