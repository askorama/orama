export { create } from './methods/create.js'
export { count, getByID } from './methods/docs.js'
export { insert, insertMultiple } from './methods/insert.js'
export { remove, removeMultiple } from './methods/remove.js'
export { search } from './methods/search.js'
export { load, save } from './methods/serialization.js'
export { update, updateMultiple } from './methods/update.js'

export * from './types.js'

export type { RawData } from './methods/serialization.js'
export type { Language } from './components/tokenizer/languages.js'
export { stemmers } from './components/tokenizer/stemmers.js'
