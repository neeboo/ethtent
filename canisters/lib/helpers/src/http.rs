use ic_cdk::api::management_canister::http_request::{http_request, CanisterHttpRequestArgument};

// http_call is to be used for http requests to other canisters
// `request` is the request to be sent to the other canister
// `CanisterHttpRequestArgument` is a struct that contains the following fields:
//  - method: String
//  - url: String
//  - headers: Vec<(String, String)>
//  - body: Vec<u8>
// `cycles` is the amount of cycles to be sent to the other canister
// `Result<T, String>` is the result of the http call
pub async fn http_call<T>(request: CanisterHttpRequestArgument, cycles: u64) -> Result<T, String>
where
    T: for<'a> serde::Deserialize<'a> + Clone + candid::CandidType,
{
    match http_request(request, cycles as u128).await {
        Ok((response,)) => {
            let str_body = String::from_utf8(response.body)
                .expect("Transformed response is not UTF-8 encoded.");
            let res: T = serde_json::from_str(&str_body)
                .map_err(|e| format!("Couldn't deserilize result {}", e.to_string()))?;
            Ok(res)
        }
        Err((r, m)) => {
            let message =
                format!("The http_request resulted into error. RejectionCode: {r:?}, Error: {m}");

            //Return the error as a string and end the method
            Err(message)
        }
    }
}

pub async fn http_call_string(
    request: CanisterHttpRequestArgument,
    cycles: u64,
) -> Result<String, String> {
    match http_request(request, cycles as u128).await {
        Ok((response,)) => {
            let str_body = String::from_utf8(response.body)
                .expect("Transformed response is not UTF-8 encoded.");

            Ok(str_body)
        }
        Err((r, m)) => {
            let message =
                format!("The http_request resulted into error. RejectionCode: {r:?}, Error: {m}");

            //Return the error as a string and end the method
            Err(message)
        }
    }
}

pub async fn http_call_raw(
    request: CanisterHttpRequestArgument,
    cycles: u64,
) -> Result<Vec<u8>, String> {
    match http_request(request, cycles as u128).await {
        Ok((response,)) => Ok(response.body),
        Err((r, m)) => {
            let message =
                format!("The http_request resulted into error. RejectionCode: {r:?}, Error: {m}");

            //Return the error as a string and end the method
            Err(message)
        }
    }
}
