import type { Language } from "./languages";
import { replaceDiacritics } from "./diacritics";
import { availableStopWords, stopWords } from "./stop-words";
import { includes } from "../utils";
import { stemmer } from "../../stemmer/lib/en";
import * as ERRORS from "../errors";

export type Stemmer = (word: string) => string;

export type TokenizerConfig = {
  enableStemming?: boolean;
  enableStopWords?: boolean;
  customStopWords?: ((stopWords: string[]) => string[]) | string[];
  stemmingFn?: Stemmer;
  tokenizerFn?: Tokenizer;
};

export type TokenizerConfigExec = {
  enableStemming: boolean;
  enableStopWords: boolean;
  customStopWords: string[];
  stemmingFn?: Stemmer;
  tokenizerFn: Tokenizer;
};

export type Tokenizer = (
  text: string,
  language: Language,
  allowDuplicates: boolean,
  tokenizerConfig: TokenizerConfig,
  frequency?: boolean,
) => string[];

const splitRegex: Record<Language, RegExp> = {
  dutch: /[^a-z0-9_'-]+/gim,
  english: /[^a-z0-9_'-]+/gim,
  french: /[^a-z0-9äâàéèëêïîöôùüûœç-]+/gim,
  italian: /[^a-z0-9_'-]+/gim,
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
    if (includes(tokenizerConfig?.customStopWords as string[], token)) {
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

function trim(text: string[]): string[] {
  while (text[text.length - 1] === "") {
    text.pop();
  }
  while (text[0] === "") {
    text.shift();
  }
  return text;
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

    if (includes(availableStopWords, language)) {
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
    enableStopWords: tokenizerConfig?.enableStopWords ?? true,
    enableStemming: tokenizerConfig?.enableStemming ?? true,
    stemmingFn: defaultStemmingFn,
    customStopWords: customStopWords ?? defaultStopWords,
    tokenizerFn: defaultTokenizerFn,
  };
}
