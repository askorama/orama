use lindera_core::{mode::Mode};
use lindera_dictionary::{DictionaryConfig, DictionaryKind};
use lindera_tokenizer::tokenizer::{Tokenizer, TokenizerConfig};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn tokenize(text: &str) -> JsValue {
    let dictionary = DictionaryConfig {
        kind: Some(DictionaryKind::IPADIC),
        path: None,
    };

    let config = TokenizerConfig {
        dictionary,
        user_dictionary: None,
        mode: Mode::Normal,
    };

    let tokenizer = match Tokenizer::from_config(config) {
        Ok(t) => t,
        Err(e) => {
            let error_message = format!("Failed to create tokenizer: {}", e);
            wasm_bindgen::throw_val(JsValue::from_str(&error_message))
        }
    };

    let tokens = match tokenizer.tokenize(text) {
        Ok(t) => t,
        Err(e) => {
            let error_message = format!("Failed to create tokenizer: {}", e);
            wasm_bindgen::throw_val(JsValue::from_str(&error_message))
        }
    };

    let tokens_str = serde_json::to_string(&tokens).unwrap_or_else(|_| String::from("[]"));

    JsValue::from_str(&tokens_str)
}
