use crate::common::memory::get_btree_memory;
use crate::delegation::signature::AssetHashes;
use crate::delegation::signature_map::SignatureMap;
use crate::types::*;
use crate::verifier::memory::get_address_memory;
use crate::verifier::types::{UserDetail, UserKey};
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    DefaultMemoryImpl, RestrictedMemory, StableBTreeMap, StableCell,
};
use std::cell::RefCell;

// const USER_PROFILE_MEM_ID: MemoryId = MemoryId::new(0);
// const USER_WALLET_MEM_ID: MemoryId = MemoryId::new(1);
pub const COMMON_BTREE_ID: MemoryId = MemoryId::new(2);
pub const DELEGATION_ID: MemoryId = MemoryId::new(3);

const METADATA_PAGES: u64 = 16;

type RM = RestrictedMemory<DefaultMemoryImpl>;
pub(crate) type VM = VirtualMemory<RM>;

thread_local! {
    pub static MSGS:RefCell<Vec<SecureMessage>> = RefCell::new(vec![]);
    pub static SIGS:RefCell<SignatureMap> = RefCell::new(SignatureMap::default());
    pub static ASSET_HASHES:RefCell<AssetHashes> = RefCell::new(AssetHashes::default());



    pub static CONFIG: RefCell<StableCell<StableState, RM>> = RefCell::new(StableCell::init(RM::new(DefaultMemoryImpl::default(), 0..METADATA_PAGES), StableState::default()).expect("failed to initialize the config cell"));

    pub static MEMORY_MANAGER: RefCell<MemoryManager<RM>> = RefCell::new(
        MemoryManager::init(RM::new(DefaultMemoryImpl::default(), METADATA_PAGES..1024))
    );

    // pub static USERS: RefCell<StableBTreeMap<u16, UserProfile, VM>> = MEMORY_MANAGER.with(|mm| {
    //     RefCell::new(StableBTreeMap::init(mm.borrow().get(USER_PROFILE_MEM_ID)))
    // });
    //
    // pub static WALLETS: RefCell<StableBTreeMap<u16, UserWallet, VM>> = MEMORY_MANAGER.with(|mm| {
    //     RefCell::new(StableBTreeMap::init(mm.borrow().get(USER_WALLET_MEM_ID)))
    // });

    pub static BTREES: RefCell<StableBTreeMap<BtreeKey, BtreeValue, VM>> = RefCell::new(StableBTreeMap::init(get_btree_memory()));
    pub static ADDRESSES: RefCell<StableBTreeMap<UserKey, UserDetail, VM>> = RefCell::new(StableBTreeMap::init(get_address_memory()));
}
