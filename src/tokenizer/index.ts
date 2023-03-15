import { createError } from "../errors.js";
import { Tokenizer } from "../types.js";
import { replaceDiacritics } from "./diacritics.js";
import { Language, SPLITTERS, STEMMERS, SUPPORTED_LANGUAGES } from "./languages.js";
import { stopWords as defaultStopWords } from "./stop-words/index.js";

export type Stemmer = (word: string) => string;

export interface TokenizerConfig {
  stemming?: boolean;
  stemmer?: Stemmer;
  stopWords?: boolean | string[] | ((stopWords: string[]) => string[] | Promise<string[]>);
  allowDuplicates?: boolean;
}

interface DefaultTokenizer extends Tokenizer {
  language: string;
  stemmer?: Stemmer;
  stopWords?: string[];
  allowDuplicates: boolean;
  normalizeToken: (this: DefaultTokenizer, token: string) => string;
}

export const normalizationCache = new Map();

function normalizeToken(this: DefaultTokenizer, token: string): string {
  const key = `${this.language}:${token}`;

  if (normalizationCache.has(key)) {
    return normalizationCache.get(key)!;
  }

  // Remove stopwords if enabled
  if (this.stopWords?.includes(token)) {
    normalizationCache.set(key, "");
    return "";
  }

  // Apply stemming if enabled
  if (this.stemmer != null) {
    token = this.stemmer(token);
  }

  token = replaceDiacritics(token);
  normalizationCache.set(key, token);
  return token;
}

/* c8 ignore next 10 */
function trim(text: string[]): string[] {
  while (text[text.length - 1] === "") {
    text.pop();
  }
  while (text[0] === "") {
    text.shift();
  }
  return text;
}

function tokenize(this: DefaultTokenizer, input: string, language?: string): string[] {
  if (language && language !== this.language) {
    throw createError("LANGUAGE_NOT_SUPPORTED", language);
  }

  /* c8 ignore next 3 */
  if (typeof input !== "string") {
    return [input];
  }

  const splitRule = SPLITTERS[this.language];
  const tokens = input.toLowerCase().split(splitRule).map(this.normalizeToken).filter(Boolean);

  const trimTokens = trim(tokens);

  if (!this.allowDuplicates) {
    return Array.from(new Set(trimTokens));
  }

  return trimTokens;
}

export async function createTokenizer(language: Language, config: TokenizerConfig = {}): Promise<DefaultTokenizer> {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw createError("LANGUAGE_NOT_SUPPORTED", language);
  }

  // Handle stemming
  let stemmer: Stemmer | undefined;

  if (config.stemming !== false) {
    if (config.stemmer != null && typeof config.stemmer !== "function") {
      throw createError("INVALID_STEMMER_FUNCTION_TYPE");
    }

    if (config.stemmer != null) {
      stemmer = config.stemmer;
    } else {
      // Check if we are in a TypeScript or Javascript scenario and determine the stemmers path
      // Note that the initial .. is purposely left inside the import in order to be compatible
      // with vite.

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      const stemmersPath = import.meta.url.endsWith("ts") ? "../stemmer/lib" : "stemmer";
      const stemmerImport = await import(`../${stemmersPath}/${STEMMERS[language]}.js`);
      stemmer = stemmerImport.stemmer;
    }
  }

  // Handle stopwords
  let stopWords: string[] | undefined;

  if (config.stopWords !== false) {
    stopWords = defaultStopWords[language] ?? [];

    if (Array.isArray(config.stopWords)) {
      stopWords = config.stopWords;
    } else if (typeof config.stopWords === "function") {
      stopWords = await config.stopWords(stopWords);
    } else if (config.stopWords) {
      throw createError("CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY");
    }

    // Make sure stopWords is just an array of strings
    if (!Array.isArray(stopWords)) {
      throw createError("CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY");
    }

    for (const s of stopWords) {
      if (typeof s !== "string") {
        throw createError("CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY");
      }
    }
  }

  // Create the tokenizer
  const tokenizer: DefaultTokenizer = {
    tokenize,
    language,
    stemmer,
    stopWords,
    allowDuplicates: Boolean(config.allowDuplicates),
    normalizeToken,
  };

  tokenizer.tokenize = tokenize.bind(tokenizer);
  tokenizer.normalizeToken = normalizeToken.bind(tokenizer);

  return tokenizer;
}
