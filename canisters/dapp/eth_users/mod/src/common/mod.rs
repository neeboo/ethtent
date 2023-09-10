pub mod memory;

use candid::Principal;
use ic_cdk::{call, trap};

use crate::types::DeviceVerificationCode;

pub const MAX_DEVICE_PER_USER: u8 = 15;
pub const MAX_NNS_PER_USER: u8 = 6;
pub const MAX_ME_PER_USER: u8 = 6;

pub const fn secs_to_nanos(secs: u64) -> u64 {
    secs * 1_000_000_000
}

pub const REGISTRATION_MODE_DURATION: u64 = secs_to_nanos(900);
pub const DEFAULT_EXPIRATION_PERIOD_NS: u64 = secs_to_nanos(30 * 60);
// 8 days
pub const MAX_EXPIRATION_PERIOD_NS: u64 = secs_to_nanos(8 * 24 * 60 * 60);
pub const MAX_DEVICE_REGISTRATION_ATTEMPTS: u8 = 3;
// 1 min
pub const DEFAULT_SIGNATURE_EXPIRATION_PERIOD_NS: u64 = secs_to_nanos(60);

pub const LABEL_ASSETS: &[u8] = b"http_assets";
pub const LABEL_SIG: &[u8] = b"sig";

/// Return a decimal representation of a random `u32` to be used as verification code
pub async fn new_verification_code() -> DeviceVerificationCode {
    let res: Vec<u8> = match call(Principal::management_canister(), "raw_rand", ()).await {
        Ok((res,)) => res,
        Err((_, err)) => trap(&format!("failed to get randomness: {}", err)),
    };
    let rand = u32::from_be_bytes(res[..4].try_into().unwrap_or_else(|_| {
        trap(&format!(
            "when creating device verification code from raw_rand output, expected raw randomness to be of length 32, got {}",
            res.len()
        ));
    }));

    // the format! makes sure that the resulting string has exactly 6 characters.
    format!("{:06}", (rand % 1_000_000))
}

pub async fn new_random_string() -> String {
    let res: Vec<u8> = match call(Principal::management_canister(), "raw_rand", ()).await {
        Ok((res,)) => res,
        Err((_, err)) => trap(&format!("failed to get randomness: {}", err)),
    };
    let rand = u64::from_be_bytes(res[..8].try_into().unwrap_or_else(|_| {
        trap(&format!(
            "when creating device verification code from raw_rand output, expected raw randomness to be of length 32, got {}",
            res.len()
        ));
    }));

    // the format! makes sure that the resulting string has exactly 6 characters.
    format!("{}", hex::encode(rand.to_be_bytes()))
}

pub fn check_frontend_length(frontend: &String) {
    const FRONTEND_HOSTNAME_LIMIT: usize = 255;

    let n = frontend.len();
    if frontend.len() > FRONTEND_HOSTNAME_LIMIT {
        trap(&format!(
            "frontend hostname {} exceeds the limit of {} bytes",
            n, FRONTEND_HOSTNAME_LIMIT,
        ));
    }
}
