use jieba_rs::Jieba;
use serde_json::to_string;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn cut(sentence: &str, hmm: bool) -> JsValue {
    let jieba = Jieba::new();
    let words = jieba.cut(sentence, hmm);
    let serialized_words = to_string(&words).unwrap_or_default();
    JsValue::from_str(&serialized_words)
}
