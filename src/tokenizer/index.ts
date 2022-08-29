import { Language } from "./languages";
import { replaceDiacritics } from "./diacritics";
import { availableStemmers, stemmers } from "./stemmer";
import { availableStopWords, stopWords } from "./stop-words";

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
};

const normalizationCache = new Map();

function normalizeToken(token: string, language: Language): string {
  const key = `${language}-${token}`;
  if (normalizationCache.has(key)) {
    return normalizationCache.get(key)!;
  } else {
    // Remove stop-words
    if (availableStopWords.includes(language)) {
      if (stopWords[language]!.includes(token)) {
        const token = "";
        normalizationCache.set(key, token);
        return token;
      }
    }

    // Stem token
    if (availableStemmers.includes(language)) {
      token = stemmers[language]!(token);
    }

    token = replaceDiacritics(token);
    normalizationCache.set(key, token);
    return token;
  }
}

export function tokenize(input: string, language: Language = "english", allowDuplicates = false) {
  /* c8 ignore next 3 */
  if (typeof input !== "string") {
    return [input];
  }

  const splitRule = splitRegex[language];
  const tokens = input
    .toLowerCase()
    .split(splitRule)
    .map(token => normalizeToken(token, language));

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
