use crate::memory::{INTENTS, USERS};
use crate::state::info_log_add;
use crate::types::{
    AddressInfo, AddressString, ChainType, EcdsaKeyIds, IntentItem, IntentWalletConfig, OrderType,
    PlatformDetail, SendEVMRequest, UserID, UserIntents, WalletError,
};
use candid::Principal;
use helpers::hash::hash_string;
use ic_stable_structures::Storable;
use ic_web3::ic::{get_eth_addr, KeyInfo};
use ic_web3::transports::ICHttp;
use ic_web3::types::{Address, Bytes, CallRequest, TransactionParameters, U256};
use ic_web3::Web3;
use std::str::FromStr;

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
        let to_add = UserIntents {
            intent_id: Some(intent_id.0.clone()),
            intent_item: IntentItem {
                intent_id: Some(intent_id.0.clone()),
                ..intents.intent_item
            },
            ..intents
        };
        INTENTS.with(|f| {
            f.borrow_mut()
                .insert(intent_id.1, to_add.clone())
                .map_or_else(
                    || {
                        info_log_add("add user intent success");
                        Ok(to_add.clone())
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
    pub fn get_user_intent_json(user_address: String) -> Vec<String> {
        INTENTS.with(|f| {
            f.borrow()
                .iter()
                .filter(|v| v.1.user_address == user_address)
                .map(|v| v.1.clone().intent_item.to_json())
                .collect()
        })
    }

    pub fn remove_user_intent_by_id(intent_id: String) -> Option<UserIntents> {
        let mut u8_arr = [0u8; 8];
        let arr = hex::decode(intent_id).unwrap();
        u8_arr.copy_from_slice(&arr);
        INTENTS.with(|f| f.borrow_mut().remove(&u8_arr))
    }

    pub fn get_all_intents(is_finshed: Option<bool>) -> Vec<UserIntents> {
        INTENTS.with(|f| {
            f.borrow()
                .iter()
                .map(|v| v.1.clone())
                .filter(|f| {
                    return if is_finshed.is_none() {
                        true
                    } else {
                        Some(f.is_finished) == is_finshed
                    };
                })
                .collect()
        })
    }

    pub fn get_key_id(chain_type: ChainType, key_string: String) -> EcdsaKeyIds {
        match chain_type {
            ChainType::BTC => EcdsaKeyIds::from(key_string),
            ChainType::ETH => EcdsaKeyIds::from(key_string),
            ChainType::BNB => EcdsaKeyIds::from(key_string),
            ChainType::ARB => EcdsaKeyIds::from(key_string),
            ChainType::MATIC => EcdsaKeyIds::from(key_string),
            ChainType::HECO => EcdsaKeyIds::from(key_string),
            ChainType::OKEX => EcdsaKeyIds::from(key_string),
            ChainType::TRON => EcdsaKeyIds::from(key_string),
            ChainType::ZKSYNC => EcdsaKeyIds::from(key_string),
            ChainType::OP => EcdsaKeyIds::from(key_string),
            ChainType::MANTLE => EcdsaKeyIds::from(key_string),
            ChainType::LINEA => EcdsaKeyIds::from(key_string),
        }
    }

    pub async fn wallet_get_address_for_platform(
        tx: &PlatformDetail,
    ) -> Result<AddressInfo, WalletError> {
        let order_id = tx.platform_uuid.to_bytes().to_vec();
        let mut derive_path = [0u8; 32];

        if order_id.len() > 32 {
            return Err(WalletError::Overload);
        }

        derive_path[32 - order_id.len()..].clone_from_slice(&order_id);
        let key_name =
            IntentService::get_key_id(tx.chain_type.clone(), tx.key_name.clone()).key_name();
        let addr = match get_eth_addr(
            Some(ic_cdk::id()),
            Some(vec![derive_path.to_vec()]),
            key_name.clone(),
        )
        .await
        {
            Ok(r) => r,
            Err(e) => return Err(WalletError::WithMessage(e.to_string())),
        };
        let address_string = format!("0x{}", hex::encode(addr.0));
        let addr_info = AddressInfo {
            address_string: address_string.clone(),
            order_id: tx.platform_uuid.clone(),
            key_name: key_name.clone(),
            chain_type: tx.chain_type.clone(),
            derived_path_hash: hex::encode(derive_path),
            address_for: OrderType::Platform,
            last_update: 0,
        };
        // addr_info.to_bytes();
        // insert_address(address_string.clone(), addr_info.clone());
        Ok(addr_info)
    }

    pub fn get_w3() -> Result<Web3<ICHttp>, WalletError> {
        let wallet_config = IntentWalletConfig::load();
        let w3 = match ICHttp::new(wallet_config.api_key.as_str(), None, wallet_config.cycles) {
            Ok(v) => Web3::new(v),
            Err(e) => return Err(WalletError::WithMessage(e.to_string())),
        };
        Ok(w3)
    }

    pub async fn send_from_address(params: SendEVMRequest) -> Result<String, WalletError> {
        let w3 = Self::get_w3()?;
        let from_addr = match Address::from_str(params.address_info.address_string.as_str()) {
            Ok(r) => r,
            Err(_) => return Err(WalletError::Invalid),
        };
        let key_info = KeyInfo {
            derivation_path: vec![
                hex::decode(params.address_info.derived_path_hash.clone()).unwrap()
            ],
            key_name: params.address_info.key_name.clone(),
        };
        let tx_hash = match send_eth(
            w3,
            TransactionParameters {
                to: Some(match Address::from_str(params.to_address.as_str()) {
                    Ok(r) => r,
                    Err(_) => return Err(WalletError::Invalid),
                }),
                value: U256::from(params.value.unwrap_or_else(|| 0)),
                gas: U256::from(params.gas.unwrap_or_else(|| 1000000000)),
                gas_price: Some(U256::from(params.gas_price.unwrap_or_else(|| 1000000000))),
                data: Bytes::from(params.data.unwrap_or_else(|| vec![])),
                ..Default::default()
            },
            from_addr,
            key_info,
            params.chain_id.unwrap_or_else(|| 1),
            params.nonce,
            params.sign_only,
        )
        .await
        {
            Ok(r) => r,
            Err(e) => return Err(WalletError::WithMessage(e)),
        };
        // self.change_tx_hash(&tx.order_id, tx_hash.clone()).unwrap();
        Ok(tx_hash)
    }

    pub async fn fetch_gas_price(&self) -> Result<String, WalletError> {
        let w3 = Self::get_w3()?;
        match get_eth_gas_price(w3).await {
            Ok(r) => Ok(r),
            Err(e) => return Err(WalletError::WithMessage(e)),
        }
    }
    pub async fn fetch_gas(&self, to: String, data: Vec<u8>) -> Result<String, WalletError> {
        let w3 = Self::get_w3()?;
        match get_eth_estimate_gas(w3, to, data).await {
            Ok(r) => Ok(r),
            Err(e) => return Err(WalletError::WithMessage(e)),
        }
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

pub async fn send_eth(
    w3: Web3<ICHttp>,
    tx: TransactionParameters,
    from_addr: Address,
    key_info: KeyInfo,
    chain_id: u64,
    nonce: Option<u64>,
    sign_only: bool,
) -> Result<String, String> {
    let tx_count: U256 = if let Some(count) = nonce {
        count.into()
    } else {
        let v = w3
            .eth()
            .transaction_count(from_addr, None)
            .await
            .map_err(|e| format!("get tx count error: {}", e))?;
        v
    };

    let tx_real = TransactionParameters {
        nonce: Some(tx_count),
        ..tx.clone()
    };

    let signed_tx = w3
        .accounts()
        .sign_transaction(tx_real.clone(), hex::encode(from_addr), key_info, chain_id)
        .await
        .map_err(|e| format!("sign tx error: {}", e))?;

    if sign_only {
        return Ok(hex::encode(signed_tx.raw_transaction.0));
    } else {
        match w3
            .eth()
            .send_raw_transaction(signed_tx.raw_transaction)
            .await
        {
            Ok(txhash) => {
                info_log_add(format!("tx hash: {}", hex::encode(txhash.0)).as_str());
                Ok(format!("{}", hex::encode(txhash.0)))
            }
            Err(the) => {
                info_log_add(format!("raw transaction has error: {}", the.to_string()).as_str());
                info_log_add(
                    format!("try hash: {}", hex::encode(signed_tx.transaction_hash)).as_str(),
                );
                let receipt = w3
                    .eth()
                    .transaction_receipt(signed_tx.transaction_hash)
                    .await;
                match receipt {
                    Ok(r) => {
                        if r.is_some() {
                            Ok(format!("{}", hex::encode(r.unwrap().transaction_hash)))
                        } else {
                            Ok(format!("{}", hex::encode(signed_tx.transaction_hash)))
                        }
                    }
                    Err(e) => Err(format!("Transaction failed {}", e.to_string()).to_string()),
                }
            }
        }
    }
}

pub async fn get_eth_gas_price(w3: Web3<ICHttp>) -> Result<String, String> {
    let gas_price = w3
        .eth()
        .gas_price()
        .await
        .map_err(|e| format!("get gas price failed: {}", e))?;
    Ok(format!("{}", gas_price))
}

pub async fn get_eth_estimate_gas(
    w3: Web3<ICHttp>,
    to: String,
    data: Vec<u8>,
) -> Result<String, String> {
    let e_gas = w3
        .eth()
        .estimate_gas(
            CallRequest {
                from: None,
                to: Some(Address::from_str(&to).unwrap()),
                gas: None,
                gas_price: None,
                value: None,
                data: Some(Bytes::from(data)),
                transaction_type: None,
                access_list: None,
                max_fee_per_gas: None,
                max_priority_fee_per_gas: None,
            },
            None,
        )
        .await
        .map_err(|e| format!("estimate gas error: {}", e))?;
    Ok(format!("{}", e_gas))
}

pub async fn get_eth_balance(w3: Web3<ICHttp>, addr: String) -> Result<String, String> {
    let balance = w3
        .eth()
        .balance(Address::from_str(&addr).unwrap(), None)
        .await
        .map_err(|e| format!("get balance failed: {}", e))?;
    Ok(format!("{}", balance))
}
