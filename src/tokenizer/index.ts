import type { Language } from "./languages";
import type { TokenizerConfig } from "../lyra";
import { defaultTokenizerConfig } from "../lyra";
import { replaceDiacritics } from "./diacritics";
import { getTokenFrequency } from "../utils";

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
  portuguese: /[^a-zà-úÀ-Ú]/gim,
  russian: /[^a-zа-яА-ЯёЁ]+/gim,
  spanish: /[^a-zA-Zá-úÁ-ÚñÑüÜ]+/gim,
  swedish: /[^a-z0-9_åÅäÄöÖüÜ-]+/gim,
  german: /[^a-zA-ZäöüÄÖÜß]+/gim,
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
  } else {
    // Check if stop-words removal is enabled
    if (tokenizerConfig?.enableStopWords) {
      // Remove stop-words
      if ((tokenizerConfig?.customStopWords as string[]).includes(token)) {
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
