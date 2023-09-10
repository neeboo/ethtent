use ego_macros::{inject_app_info, inject_cycle_info, inject_ego_data};

use crate::memory::{CONFIG, WALLET_CONFIG};
use crate::rpc::stable_state::StableState;
use crate::types::IntentWalletConfig;
use ego_backup::inject_backup_data;
use std::cell::RefCell;

inject_ego_data!();
inject_cycle_info!();
inject_app_info!();
inject_backup_data!();

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

pub fn pre_upgrade() {
    // composite StableState
    let stable_state = StableState::load();

    CONFIG.with(|config| {
        config
            .borrow_mut()
            .set(stable_state)
            .expect("persist stable state failed");
    });

    let wallet_config = IntentWalletConfig::load();

    WALLET_CONFIG.with(|config| {
        config
            .borrow_mut()
            .set(wallet_config)
            .expect("persist wallet config failed");
    });
}

pub fn post_upgrade() {
    CONFIG.with(|config| {
        let config_borrow = config.borrow();
        let state = config_borrow.get();

        StableState::restore(state.to_owned());
    });

    WALLET_CONFIG.with(|config| {
        let config_borrow = config.borrow();
        let state = config_borrow.get();

        IntentWalletConfig::restore(state.to_owned());
    });
}
