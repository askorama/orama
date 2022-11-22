use lyra_utils::tokenscore;
use serde::{Deserialize, Serialize};
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[derive(Debug, PartialEq, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct IntersectScoresInput {
  pub data: Vec<Vec<(String, f64)>>,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Tsify)]
#[tsify(into_wasm_abi, from_wasm_abi)]
pub struct InsersectScoresOutput {
  pub data: Vec<(String, f64)>,
}

// Lyra currently represents TokenScore as Array<Array<[string, number]>>, which isn't ergonomic for Rust / Wasm,
// as it has several shortcomings:
// 1. Vectors of non-primitive types cannot be received or returned with `wasm-bindgen`
//    See https://github.com/rustwasm/wasm-bindgen/issues/111
// 2. While the `js_sys::Array` type could be a good fit to receive and return arrays from JavaScript, it doesn't
//    support nested arrays.
// We have thus wrapped the vector of tuples in a top-level struct.
#[wasm_bindgen(js_name = intersectTokenScores)]
pub fn intersect_token_scores(arrays: IntersectScoresInput) -> InsersectScoresOutput {
  let data = tokenscore::intersect_token_scores(arrays.data);
  InsersectScoresOutput { data }
}
