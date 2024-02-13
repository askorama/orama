import type { DefaultTokenizerConfig, DefaultTokenizer } from '@orama/orama'
import { normalizeToken } from '@orama/orama/internals'
// @ts-expect-error - this file is gonna be moved inside the `pkg` folder at build time
import init, { tokenize } from './tokenizer_mandarin.js'
// @ts-expect-error - this file is gonna be created at build time
import { wasm } from './tokenizer_mandarin_bg_wasm_arr.js'

const tokenizerLanguage = 'mandarin'

type TLanguage = typeof tokenizerLanguage

type MandarinTokenizerConfig = DefaultTokenizerConfig & {
  language: TLanguage
}

const defaultConfig: MandarinTokenizerConfig = {
  language: tokenizerLanguage
}

/* c8 ignore next 10 */
function trim(text: string[]): string[] {
  while (text[text.length - 1] === '') {
    text.pop()
  }
  while (text[0] === '') {
    text.shift()
  }
  return text
}

async function tokenizeInternal(
  this: DefaultTokenizer,
  input: string,
  language?: TLanguage,
  prop?: string
): Promise<string[]> {
  if (language && language !== tokenizerLanguage) {
    throw new Error(
      `You can't use the ${language} language with the ${tokenizerLanguage} tokenizer. Only ${tokenizerLanguage} is supported.`
    )
  }

  /* c8 ignore next 3 */
  if (typeof input !== 'string') {
    return [input]
  }

  let tokens: string[]
  if (prop && this.tokenizeSkipProperties.has(prop)) {
    tokens = [this.normalizeToken.bind(this, prop ?? '')(input)]
  } else {
    tokens = await tokenize(input, true)
  }

  const trimTokens = trim(tokens)

  if (!this.allowDuplicates) {
    return Array.from(new Set(trimTokens))
  }

  return trimTokens
}

export async function createTokenizer(config: MandarinTokenizerConfig = defaultConfig): Promise<DefaultTokenizer> {
  await init(wasm)

  const tokenizerConfig = {
    tokenize: tokenizeInternal,
    language: config.language,
    stemmerSkipProperties: new Set(config.stemmerSkipProperties ? [config.stemmerSkipProperties].flat() : []),
    tokenizeSkipProperties: new Set(config.tokenizeSkipProperties ? [config.tokenizeSkipProperties].flat() : []),
    stopWords: config.stopWords as string[] | undefined,
    allowDuplicates: Boolean(config.allowDuplicates),
    normalizeToken,
    normalizationCache: new Map()
  }

  tokenizerConfig.tokenize = tokenizeInternal.bind(tokenizeInternal)

  // @ts-expect-error - here we are forcing "mandarin" as a language
  return tokenizerConfig
}
