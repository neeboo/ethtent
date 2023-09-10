use ego_macros::{inject_app_info, inject_ego_data};
use std::cell::RefCell;
use crate::types::StableState;
use crate::memory::CONFIG;

inject_ego_data!();
inject_app_info!();

/********************  methods for canister_registry_macro   ********************/
fn on_canister_added(name: &str, canister_id: Principal) {
    info_log_add(
        format!(
            "on_canister_added name: {}, canister_id: {}",
            name, canister_id
        )
        .as_str(),
    );
}


/// Preupdate hook for stable state, we don't need stable save anymore
/// use memory to save state
/// ciborium as a serilizer to make state save more efficient
/// and use memory to manage all states, see crate::memory
/// here we use upgrades_memory as the upgrades hook management.
/// we use bytes len as the first 4 bytes to save the state length
/// and then save the state bytes
pub fn pre_upgrade() {
    info_log_add("enter example pre_upgrade");

    // composite StableState
    let stable_state = StableState {
        users: Some(users_pre_upgrade()),
        registry: Some(registry_pre_upgrade()),
        app_info: Some(app_info_pre_upgrade()),
    };

    CONFIG.with(|config| {
        config.borrow_mut().set(stable_state).expect("persist stable state failed");
    });


}

/// Postupgrade hook is used to restore state
/// we use upgrades_memory to restore state
/// first read the state length from the first 4 bytes
/// and then read the state bytes
pub fn post_upgrade() {
    info_log_add("enter example post_upgrade");

    CONFIG.with(|config| {
        let config_borrow = config.borrow();
        let state =  config_borrow.get();

        match &state.users {
            None => {}
            Some(users) => {
                users_post_upgrade(users.clone());
            }
        }

        match &state.registry {
            None => {}
            Some(registry) => {
                registry_post_upgrade(registry.clone());
            }
        }

        match &state.app_info {
            None => {}
            Some(app_info) => {
                app_info_post_upgrade(app_info.clone());
            }
        }
    });
}
