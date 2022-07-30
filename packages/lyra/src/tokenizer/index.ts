import { Language } from "./languages";

const splitRegex: Record<Language, RegExp> = {
  dutch: /[^a-z0-9_'-]+/gim,
  english: /[^a-z0-9_'-]+/gim,
  french: /[^a-z0-9äâàéèëêïîöôùüûœç-]+/gim,
  italian: /[^a-z0-9_'-]+/gim,
  norwegian: /[^a-z0-9_æøåÆØÅäÄöÖüÜ]+/gim,
  portugese: /[^a-zà-úÀ-Ú]/gim,
  russian: /[^a-zа-яА-ЯёЁ]+/gim,
  spanish: /[^a-zA-Zá-úÁ-ÚñÑüÜ]+/gim,
  swedish: /[^a-z0-9_åÅäÄöÖüÜ-]+/gim,
};

export function tokenize(input: string, language: Language = "english", allowDuplicates = false) {
  const splitRule = splitRegex[language];
  const tokens = input.toLowerCase().split(splitRule);
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
