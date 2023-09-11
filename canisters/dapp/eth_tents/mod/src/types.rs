use candid::{CandidType, Principal};
use ic_stable_structures::{BoundedStorable, Storable};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use std::fmt::{Display, Formatter};
use std::str::FromStr;

use crate::memory::{ADDRESSES_INFO, WALLET_CONFIG};
use candid::{Decode, Encode};
use ego_types::app::EgoError;
use ic_cdk::api::management_canister::ecdsa::{EcdsaCurve, EcdsaKeyId};
use ic_cdk::api::time;

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
    pub intent_item: IntentItem,
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

#[derive(CandidType, Serialize, Deserialize, Clone, Eq, PartialEq, Ord, PartialOrd)]
pub enum OrderType {
    Market,
    BuyLimit,
    SellLimit,
    BuyStop,
    SellStop,
    Platform,
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
    pub destination_chain: String,
    pub recipient: String,
    pub token_in: Address,
    pub token_out: Address,
    pub token_out_symbol: String,
    pub amount: U256,
    pub num: U256,
    pub fee_rate: U256,
    pub expiration: U256,
    pub signature_hash: Bytes,
    pub task_id: U256,
    pub intent_id: Option<String>,
    pub order_detail: Option<OrderDetail>,
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct IntentItem {
    #[serde(rename = "intender")]
    pub intender: String,
    #[serde(skip_serializing)]
    pub to_chain_id: u128,
    #[serde(rename = "destinationChain")]
    pub destination_chain: String,
    #[serde(rename = "recipient")]
    pub recipient: String,
    #[serde(rename = "tokenIn")]
    pub token_in: String,
    #[serde(rename = "tokenOut")]
    pub token_out: String,
    #[serde(rename = "tokenOutSymbol")]
    pub token_out_symbol: String,
    #[serde(rename = "amount")]
    pub amount: u128,
    #[serde(rename = "num")]
    pub num: u128,
    #[serde(rename = "feeRate")]
    pub fee_rate: u128,
    #[serde(rename = "expiration")]
    pub expiration: u128,
    #[serde(rename = "signatureHash")]
    pub signature_hash: String,
    #[serde(rename = "taskId")]
    pub task_id: u128,
    #[serde(skip_serializing)]
    pub intent_id: Option<String>,
    #[serde(skip_serializing)]
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
            to_chain_id: value.to_chain_id.as_u128(),
            destination_chain: value.destination_chain,
            recipient: value.recipient,
            token_in: value.token_in.to_string(),
            token_out_symbol: value.token_out_symbol,
            token_out: value.token_out.to_string(),
            amount: value.amount.as_u128(),
            num: value.num.as_u128(),
            fee_rate: value.fee_rate.as_u128(),
            expiration: value.expiration.as_u128(),
            signature_hash: hex::encode(value.signature_hash.0),
            task_id: value.task_id.as_u128(),
            intent_id: value.intent_id,
            order_detail: value.order_detail,
        }
    }
}

impl IntentItem {
    pub fn to_json(&self) -> String {
        serde_json::to_string(&self).unwrap()
    }
}

impl From<IntentItem> for ETHIntentItem {
    fn from(value: IntentItem) -> Self {
        ETHIntentItem {
            intender: Address::from_str(value.intender.as_str()).unwrap(),
            destination_chain: value.destination_chain,
            to_chain_id: U256::from(value.to_chain_id),
            recipient: value.recipient,
            token_in: Address::from_str(value.token_in.as_str()).unwrap(),
            token_out: Address::from_str(value.token_out.as_str()).unwrap(),
            token_out_symbol: value.token_out_symbol,
            amount: U256::from(value.amount),
            num: U256::from(value.num),
            fee_rate: U256::from(value.fee_rate),
            expiration: U256::from(value.expiration),
            signature_hash: Bytes(hex::decode(value.signature_hash).unwrap()),
            task_id: U256::from(value.task_id),
            intent_id: value.intent_id,
            order_detail: value.order_detail,
        }
    }
}

impl ETHIntentItem {
    pub fn to_json(&self) -> String {
        let intent_item = IntentItem::from(self.clone());
        serde_json::to_string(&intent_item).unwrap()
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Eq, PartialEq, Ord, PartialOrd)]
pub enum ChainType {
    BTC,
    ETH,
    BNB,
    ARB,
    MATIC,
    HECO,
    OKEX,
    TRON,
    ZKSYNC,
    OP,
    MANTLE,
    LINEA,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum EcdsaKeyIds {
    TestKeyLocalDevelopment,
    TestKey1,
    ProductionKey1,
}

impl EcdsaKeyIds {
    fn to_key_id(&self) -> EcdsaKeyId {
        EcdsaKeyId {
            curve: EcdsaCurve::Secp256k1,
            name: match self {
                Self::TestKeyLocalDevelopment => "dfx_test_key",
                Self::TestKey1 => "test_key_1",
                Self::ProductionKey1 => "key_1",
            }
            .to_string(),
        }
    }
    pub fn key_name(&self) -> String {
        self.to_key_id().name
    }
}

impl Into<EcdsaKeyId> for EcdsaKeyIds {
    fn into(self) -> EcdsaKeyId {
        self.to_key_id()
    }
}

impl From<String> for EcdsaKeyIds {
    fn from(s: String) -> Self {
        match s.as_str() {
            "dfx_test_key" => Self::TestKeyLocalDevelopment,
            "test_key_1" => Self::TestKey1,
            "key_1" => Self::ProductionKey1,
            _ => panic!("Invalid key name"),
        }
    }
}

#[derive(CandidType, Serialize, Deserialize, Clone, Eq, PartialEq, Ord, PartialOrd)]
pub enum RoleFilter {
    All,
    Role(OrderType),
    RoleNot(OrderType),
    RoleAnd((OrderType, OrderType)),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Eq, PartialEq, Ord, PartialOrd)]
pub enum BalanceFilter {
    Empty,
    NotEmpty,
    WithBalance(u64),
}

/// 订单ID
pub type OrderID = String;
pub type TxHash = String;
pub type TxBytes = Vec<u8>;

/// 买家订单详情
#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct BuyerOrderDetail {
    pub order_id: String,
    pub buyer_address: String,
    pub time_stamp: u64,
    pub chain_type: ChainType,
    pub key_name: String,
}

/// 平台地址详情
#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct PlatformDetail {
    pub platform_uuid: String,
    pub chain_type: ChainType,
    pub key_name: String,
}
#[derive(CandidType, Eq, PartialEq, Ord, PartialOrd, Serialize, Deserialize, Clone)]
pub struct AddressInfo {
    pub address_string: String,
    pub order_id: String,
    pub key_name: String,
    pub chain_type: ChainType,
    pub derived_path_hash: String,
    pub address_for: OrderType,
    pub last_update: u64,
}

impl AddressInfo {
    pub fn len() -> u64 {
        ADDRESSES_INFO.with(|cell| {
            let inst = cell.borrow();
            inst.len()
        })
    }

    pub fn list() -> Vec<Self> {
        Self::iter(|(_, address_info)| Some(address_info))
    }

    pub fn by_last_update(last_update: u64) -> Vec<Self> {
        Self::iter(
            |(_, address_info)| match address_info.last_update >= last_update {
                true => Some(address_info),
                false => None,
            },
        )
    }

    pub fn save(&mut self) {
        ADDRESSES_INFO.with(|cell| {
            let mut inst = cell.borrow_mut();
            let key = AddressString(self.address_string.clone());
            self.last_update = time();

            inst.insert(key, self.clone())
        });
    }

    pub fn get(address_string: String) -> Option<Self> {
        ADDRESSES_INFO.with(|cell| {
            let inst = cell.borrow();
            let key = AddressString(address_string);
            inst.get(&key)
        })
    }

    pub fn get_all_address(role_filter: RoleFilter) -> Vec<AddressInfo> {
        ADDRESSES_INFO.with(|m| {
            m.borrow()
                .iter()
                .filter(|(_, f)| match &role_filter {
                    RoleFilter::All => true,
                    RoleFilter::Role(role) => f.address_for.clone() == role.clone(),
                    RoleFilter::RoleAnd((a, b)) => {
                        f.address_for.clone() == a.clone() || f.address_for.clone() == b.clone()
                    }
                    RoleFilter::RoleNot(role) => f.address_for.clone() != role.clone(),
                })
                .map(|f| f.1.clone())
                .collect::<Vec<AddressInfo>>()
        })
    }

    fn iter<F>(filter: F) -> Vec<Self>
    where
        F: FnMut((AddressString, Self)) -> Option<Self>,
    {
        ADDRESSES_INFO.with(|cell| {
            let inst = cell.borrow();
            inst.iter().filter_map(filter).collect()
        })
    }
}

impl Storable for AddressInfo {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for AddressInfo {
    const MAX_SIZE: u32 = 2048;
    const IS_FIXED_SIZE: bool = false;
}

/// 发送EVM请求
#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct SendEVMRequest {
    pub address_info: AddressInfo,
    pub chain_id: Option<u64>,  // 自定义chain_id
    pub value: Option<u64>,     // 自定义value字段
    pub gas: Option<u64>,       // 自定义gas字段
    pub gas_price: Option<u64>, // 自定义gas_price字段
    pub nonce: Option<u64>,     // 自定义nonce
    pub data: Option<Vec<u8>>,  // 自定义data字段
    pub to_address: String,     // 自定义发送地址
    pub sign_only: bool,        // 仅签名，不发送
}

/// 升降排序
#[derive(CandidType, Serialize, Deserialize, Clone)]
pub enum Ordering {
    Decending,
    Accending,
}

/// 获取地址过滤器
#[derive(CandidType, Serialize, Deserialize, Clone)]
pub struct AddressesFilter {
    pub chain_type: Option<ChainType>,
    pub order_type: Option<OrderType>,
    pub time_seq: Ordering,
}

/// Errors which can occur when attempting to generate resource uri.
#[derive(CandidType, Serialize, Deserialize, Debug)]
pub enum WalletError {
    NotFound,
    Duplicated,
    Internal,
    Invalid,
    Overload,
    AlreadyExist(String),
    AlreadySent(String),
    WithMessage(String),
}

impl Display for WalletError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            WalletError::NotFound => write!(f, "Not found"),
            WalletError::Duplicated => write!(f, "Duplicated"),
            WalletError::Internal => write!(f, "Internal Wallet error"),
            WalletError::Invalid => write!(f, "Invalid Wallet error"),
            WalletError::Overload => write!(f, "Overload"),
            WalletError::AlreadyExist(tx_id) => write!(f, "Already exist: {}", tx_id),
            WalletError::AlreadySent(tx_id) => write!(f, "Already sent: {}", tx_id),
            WalletError::WithMessage(msg) => write!(f, "Error with message: {}", msg),
        }
    }
}

impl std::error::Error for WalletError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            WalletError::NotFound => None,
            WalletError::Duplicated => None,
            WalletError::Internal => None,
            WalletError::Invalid => None,
            WalletError::Overload => None,
            WalletError::WithMessage(_) => None,
            WalletError::AlreadySent(_) => None,
            WalletError::AlreadyExist(_) => None,
        }
    }
}

impl From<WalletError> for SystemError {
    fn from(e: WalletError) -> Self {
        match e {
            WalletError::NotFound => SystemError::new(404, "Address Not Found"),
            WalletError::Duplicated => SystemError::new(403, "Address Duplicated"),
            WalletError::Internal => SystemError::new(502, "Internal Error"),
            WalletError::Invalid => SystemError::new(404, "Invalid Error"),
            WalletError::Overload => SystemError::new(405, "Overload"),
            WalletError::WithMessage(r) => {
                SystemError::new(8001, format!("Service With Error: {}", r.as_str()).as_str())
            }
            WalletError::AlreadySent(r) => {
                SystemError::new(8002, format!("Already Sent: {}", r.as_str()).as_str())
            }
            WalletError::AlreadyExist(r) => {
                SystemError::new(8003, format!("{} Already active", r.as_str()).as_str())
            }
        }
    }
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct SystemError {
    pub code: u16,
    pub msg: String,
}

impl SystemError {
    pub fn new(code: u16, msg: &str) -> Self {
        SystemError {
            code,
            msg: msg.to_string(),
        }
    }
}

impl From<std::string::String> for SystemError {
    fn from(msg: String) -> Self {
        SystemError { code: 404, msg }
    }
}

impl From<EgoError> for SystemError {
    fn from(err: EgoError) -> Self {
        SystemError {
            code: err.code,
            msg: err.msg,
        }
    }
}
