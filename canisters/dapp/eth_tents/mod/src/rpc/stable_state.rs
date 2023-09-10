use std::borrow::Cow;

use candid::{CandidType, Decode, Encode};
use ego_backup::backup_info::BackupInfo;
use ego_types::app_info::AppInfo;
use ego_types::cycle_info::CycleInfo;
use ego_types::registry::Registry;
use ego_types::user::User;
use ic_stable_structures::{BoundedStorable, Storable};
use serde::{Deserialize, Serialize};

use crate::state::{
    app_info_post_upgrade, app_info_pre_upgrade, backup_info_post_upgrade, backup_info_pre_upgrade,
    cycle_info_post_upgrade, cycle_info_pre_upgrade, registry_post_upgrade, registry_pre_upgrade,
    users_post_upgrade, users_pre_upgrade,
};

const STATE_SIZE: u32 = 4 * 1024 * 1024; // 4M

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct StableState {
    pub users: Option<User>,
    pub registry: Option<Registry>,
    pub cycle_info: Option<CycleInfo>,
    pub backup_info: Option<BackupInfo>,
    pub app_info: Option<AppInfo>,
}

impl Default for StableState {
    fn default() -> Self {
        Self {
            users: None,
            registry: None,
            cycle_info: None,
            backup_info: None,
            app_info: None,
        }
    }
}

impl StableState {
    pub fn load() -> Self {
        Self {
            users: Some(users_pre_upgrade()),
            registry: Some(registry_pre_upgrade()),
            cycle_info: Some(cycle_info_pre_upgrade()),
            backup_info: Some(backup_info_pre_upgrade()),
            app_info: Some(app_info_pre_upgrade()),
        }
    }

    pub fn restore(state: Self) {
        users_post_upgrade(state.users.unwrap_or(User::default()));
        registry_post_upgrade(state.registry.unwrap_or(Registry::default()));
        cycle_info_post_upgrade(state.cycle_info.unwrap_or(CycleInfo::default()));
        backup_info_post_upgrade(state.backup_info.unwrap_or(BackupInfo::default()));
        app_info_post_upgrade(state.app_info.unwrap_or(AppInfo::default()));
    }
}

impl Storable for StableState {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for StableState {
    const MAX_SIZE: u32 = STATE_SIZE;
    const IS_FIXED_SIZE: bool = false;
}
