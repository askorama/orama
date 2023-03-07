export { create } from "./methods/create.js";
export { insert, insertMultiple } from "./methods/insert.js";
export { load, save } from "./methods/serialization.js";
export { remove, removeMultiple } from "./methods/remove.js";
export { update, updateMultiple } from "./methods/update.js";
export { search } from "./methods/search.js";
export { getByID, count } from "./methods/docs.js";

export * from "./types.js";
export type { Language } from "./tokenizer/languages.js";
export type { Stemmer, TokenizerConfig } from "./tokenizer/index.js";
