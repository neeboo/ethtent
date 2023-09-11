use crate::rpc::stable_state::StableState;
use crate::types::{AddressInfo, AddressString, IntentWalletConfig, UserID, UserIntents};

use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    DefaultMemoryImpl, RestrictedMemory, StableBTreeMap, StableCell,
};
use std::cell::RefCell;

const USER_PRINCIPAL_MEM_ID: MemoryId = MemoryId::new(0);
const USER_INTENT_MEM_ID: MemoryId = MemoryId::new(1);

const ADDRESS_MEM_ID: MemoryId = MemoryId::new(90);

const METADATA_PAGES: u64 = 16;

const WALLET_CONFIG_PAGES: u64 = 128;

const WASM_PAGE_SIZE: u64 = 65536;
/// The maximum number of stable memory pages a canister can address.
pub const MAX_PAGES: u64 = u64::MAX / WASM_PAGE_SIZE;

type RM = RestrictedMemory<DefaultMemoryImpl>;
type VM = VirtualMemory<RM>;

thread_local! {
    pub static CONFIG: RefCell<StableCell<StableState, RM>> = RefCell::new(StableCell::init(RM::new(DefaultMemoryImpl::default(), 0..METADATA_PAGES), StableState::default()).expect("failed to initialize the config cell"));



    pub static WALLET_CONFIG: RefCell<StableCell<IntentWalletConfig, RM>> = RefCell::new(StableCell::init(RM::new(DefaultMemoryImpl::default(), METADATA_PAGES..WALLET_CONFIG_PAGES), IntentWalletConfig::default()).expect("failed to initialize the config cell"));

     static MEMORY_MANAGER: RefCell<MemoryManager<RM>> = RefCell::new(
        MemoryManager::init(RM::new(DefaultMemoryImpl::default(), WALLET_CONFIG_PAGES..MAX_PAGES))
    );

     pub static USERS: RefCell<StableBTreeMap<UserID, AddressString, VM>> = MEMORY_MANAGER.with(|mm| {
        RefCell::new(StableBTreeMap::init(mm.borrow().get(USER_PRINCIPAL_MEM_ID)))
    });


    pub static INTENTS: RefCell<StableBTreeMap<[u8;8], UserIntents, VM>> = MEMORY_MANAGER.with(|mm| {
        RefCell::new(StableBTreeMap::init(mm.borrow().get(USER_INTENT_MEM_ID)))
    });

    pub static ADDRESSES_INFO: RefCell<StableBTreeMap<AddressString, AddressInfo, VM>> = MEMORY_MANAGER.with(|mm| {
        RefCell::new(StableBTreeMap::init(mm.borrow().get(ADDRESS_MEM_ID)))
    });


}
