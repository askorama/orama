import type { Optional } from '../../types.js'
import { Stemmer, Tokenizer, DefaultTokenizerConfig } from '../../types.js'
import { Language } from './languages.js'
export interface DefaultTokenizer extends Tokenizer {
  language: Language
  stemmer?: Stemmer
  tokenizeSkipProperties: Set<string>
  stemmerSkipProperties: Set<string>
  stopWords?: string[]
  allowDuplicates: boolean
  normalizationCache: Map<string, string>
  normalizeToken(this: DefaultTokenizer, token: string, prop: Optional<string>): string
}
export declare function normalizeToken(this: DefaultTokenizer, prop: string, token: string): string
export declare function createTokenizer(config?: DefaultTokenizerConfig): DefaultTokenizer
