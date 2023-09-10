use crate::memory::{BTREES, COMMON_BTREE_ID, MEMORY_MANAGER, VM};
use crate::types::{BtreeKey, BtreeValue};

/// Get the memory for upgrades.
/// This memory is used to store the wasm module of the canister.
pub fn get_btree_memory() -> VM {
    MEMORY_MANAGER.with(|m| m.borrow().get(COMMON_BTREE_ID))
}
pub fn insert_btree(key: String, value: BtreeValue) {
    BTREES.with(|m| m.borrow_mut().insert(BtreeKey(key), value));
}
pub fn get_btree(key: String) -> Option<BtreeValue> {
    BTREES.with(|m| m.borrow().get(&BtreeKey(key)))
}
pub fn get_all_btree() -> Vec<BtreeValue> {
    BTREES.with(|m| {
        m.borrow()
            .iter()
            .map(|f| f.1.clone())
            .collect::<Vec<BtreeValue>>()
    })
}
