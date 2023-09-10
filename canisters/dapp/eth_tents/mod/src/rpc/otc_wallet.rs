// use crate::types::{
//     AddressesFilter, BuyerOrderDetail, PlatformDetail,
//     SendEVMRequest, TxBytes, TxHash, WalletError,
// };
// use async_trait::async_trait;
// use crate::types::address_info::AddressInfo;
// use crate::types::otc_wallet_config::OtcWalletConfig;
//
// #[async_trait]
// pub trait TotcWallet {
//     async fn wallet_get_address_for_otc(
//         &self,
//         req: PlatformDetail,
//     ) -> Result<AddressInfo, WalletError>;
//
//     async fn wallet_get_address_for_buyer(
//         &self,
//         buyer_order: BuyerOrderDetail,
//     ) -> Result<AddressInfo, WalletError>;
//
//     async fn wallet_get_existed_addresses(
//         &self,
//         filter: AddressesFilter,
//     ) -> Result<Vec<AddressInfo>, WalletError>;
//
//     async fn wallet_send_tx_evm(
//         send_request: SendEVMRequest,
//     ) -> Result<(TxHash, TxBytes), WalletError>;
//
//     async fn wallet_set_config(config: OtcWalletConfig) -> Result<(), WalletError>;
// }
