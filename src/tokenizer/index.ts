import { stemmer } from "@stemmer/en.js";
import { replaceDiacritics } from "./diacritics.js";
import * as ERRORS from "../errors.js";
import { Language, SUPPORTED_LANGUAGES } from "./languages.js";
import { availableStopWords, stopWords } from "./stop-words/index.js";

export * from "./languages.js";

export type Stemmer = (word: string) => string;

export type TokenizerConfig = {
  enableStemming?: boolean;
  enableStopWords?: boolean;
  customStopWords?: ((stopWords: string[]) => string[]) | string[];
  stemmingFn?: Stemmer;
  tokenizerFn?: Tokenizer;
  assertSupportedLanguage?: (language: string) => void;
};

export type TokenizerConfigExec = {
  enableStemming: boolean;
  enableStopWords: boolean;
  customStopWords: string[];
  stemmingFn?: Stemmer;
  tokenizerFn: Tokenizer;
  assertSupportedLanguage: (language: string) => void;
};

export type Tokenizer = (
  text: string,
  language: Language,
  allowDuplicates: boolean,
  tokenizerConfig: TokenizerConfig,
  frequency?: boolean,
) => string[];

const splitRegex: Record<Language, RegExp> = {
  dutch: /[^A-Za-zàèéìòóù0-9_'-]+/gim,
  english: /[^A-Za-zàèéìòóù0-9_'-]+/gim,
  french: /[^a-z0-9äâàéèëêïîöôùüûœç-]+/gim,
  italian: /[^A-Za-zàèéìòóù0-9_'-]+/gim,
  norwegian: /[^a-z0-9_æøåÆØÅäÄöÖüÜ]+/gim,
  portuguese: /[^a-z0-9à-úÀ-Ú]/gim,
  russian: /[^a-z0-9а-яА-ЯёЁ]+/gim,
  spanish: /[^a-z0-9A-Zá-úÁ-ÚñÑüÜ]+/gim,
  swedish: /[^a-z0-9_åÅäÄöÖüÜ-]+/gim,
  german: /[^a-z0-9A-ZäöüÄÖÜß]+/gim,
  finnish: /[^a-z0-9äöÄÖ]+/gim,
  danish: /[^a-z0-9æøåÆØÅ]+/gim,
  hungarian: /[^a-z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ]+/gim,
  romanian: /[^a-z0-9ăâîșțĂÂÎȘȚ]+/gim,
  serbian: /[^a-z0-9čćžšđČĆŽŠĐ]+/gim,
  turkish: /[^a-z0-9çÇğĞıİöÖşŞüÜ]+/gim,
  lithuanian: /[^a-z0-9ąčęėįšųūžĄČĘĖĮŠŲŪŽ]+/gim,
  arabic: /[^a-z0-9أ-ي]+/gim,
  nepali: /[^a-z0-9अ-ह]+/gim,
  irish: /[^a-z0-9áéíóúÁÉÍÓÚ]+/gim,
  indian: /[^a-z0-9अ-ह]+/gim,
  armenian: /[^a-z0-9ա-ֆ]+/gim,
  greek: /[^a-z0-9α-ωά-ώ]+/gim,
  indonesian: /[^a-z0-9]+/gim,
  ukrainian:/[^a-z0-9а-яА-ЯіїєІЇЄ]+/gim,
  slovenian: /[^a-z0-9čžšČŽŠ]+/gim
};

export const normalizationCache = new Map();

function normalizeToken(token: string, language: Language, tokenizerConfig: TokenizerConfig): string {
  const key = `${language}:${token}`;

  if (normalizationCache.has(key)) {
    return normalizationCache.get(key)!;
  }
  // Check if stop-words removal is enabled
  if (tokenizerConfig?.enableStopWords) {
    // Remove stop-words
    if ((tokenizerConfig.customStopWords as string[]).includes(token)) {
      const token = "";
      normalizationCache.set(key, token);
      return token;
    }
  }

  // Check if stemming is enabled
  if (tokenizerConfig?.enableStemming) {
    // Stem token when a stemming function is available
    if (typeof tokenizerConfig?.stemmingFn === "function") {
      token = tokenizerConfig?.stemmingFn(token);
    }
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

function assertSupportedLanguage(language: string) {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new Error(ERRORS.LANGUAGE_NOT_SUPPORTED(language));
  }
}

export function tokenize(
  input: string,
  language: Language = "english",
  allowDuplicates = false,
  tokenizerConfig: TokenizerConfig = defaultTokenizerConfig(language),
) {
  /* c8 ignore next 3 */
  if (typeof input !== "string") {
    return [input];
  }

  const splitRule = splitRegex[language];
  const tokens = input
    .toLowerCase()
    .split(splitRule)
    .map(token => normalizeToken(token, language, tokenizerConfig!))
    .filter(Boolean);

  const trimTokens = trim(tokens);

  if (!allowDuplicates) {
    return Array.from(new Set(trimTokens));
  }

  return trimTokens;
}

export function defaultTokenizerConfig(language: Language, tokenizerConfig: TokenizerConfig = {}): TokenizerConfigExec {
  let defaultStopWords: string[] = [];
  let customStopWords: string[] = [];
  let defaultStemmingFn: Stemmer | undefined;
  let defaultTokenizerFn: Tokenizer = tokenize;

  // Enable custom tokenizer function
  if (tokenizerConfig?.tokenizerFn) {
    if (typeof tokenizerConfig.tokenizerFn !== "function") {
      throw Error(ERRORS.INVALID_TOKENIZER_FUNCTION());
    }
    /* c8 ignore next 4 */
    defaultTokenizerFn = tokenizerConfig.tokenizerFn;

    // If there's no custom tokenizer, we can proceed setting custom
    // stemming functions and stop-words.
  } else {
    // Enable custom stemming function
    if (tokenizerConfig?.stemmingFn) {
      if (typeof tokenizerConfig.stemmingFn !== "function") {
        throw Error(ERRORS.INVALID_STEMMER_FUNCTION_TYPE());
      }
      defaultStemmingFn = tokenizerConfig.stemmingFn;
    } else {
      defaultStemmingFn = stemmer;
    }

    // Enable default stop-words

    if (availableStopWords.includes(language)) {
      /* c8 ignore next */
      defaultStopWords = stopWords[language] ?? [];
    }

    if (tokenizerConfig?.customStopWords) {
      switch (typeof tokenizerConfig.customStopWords) {
        // Execute the custom step-words function.
        // This will pass the default step-words for a given language as a first parameter.
        case "function":
          customStopWords = tokenizerConfig.customStopWords(defaultStopWords);
          break;

        // Check if the custom step-words is an array.
        // If it's an object, throw an exception. If the array contains any non-string value, throw an exception.
        case "object":
          if (!Array.isArray(tokenizerConfig.customStopWords)) {
            throw Error(ERRORS.CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY());
          }
          customStopWords = tokenizerConfig.customStopWords as string[];
          if (customStopWords.some(x => typeof x !== "string")) {
            throw Error(ERRORS.CUSTOM_STOP_WORDS_ARRAY_MUST_BE_STRING_ARRAY());
          }
          break;

        // By default, throw an exception, as this is a misconfiguration.
        default:
          throw Error(ERRORS.CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY());
      }
    }
  }

  return {
    /* c8 ignore next 5 */
    enableStopWords: tokenizerConfig?.enableStopWords ?? true,
    enableStemming: tokenizerConfig?.enableStemming ?? true,
    stemmingFn: defaultStemmingFn,
    customStopWords: customStopWords ?? defaultStopWords,
    tokenizerFn: defaultTokenizerFn,
    assertSupportedLanguage: tokenizerConfig.assertSupportedLanguage ?? assertSupportedLanguage,
  };
}
