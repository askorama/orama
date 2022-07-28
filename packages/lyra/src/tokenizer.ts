import { WordTokenizer } from "natural";
import { Language, stemArray } from "./stemmer";

const tokenizer = new WordTokenizer();

export function tokenize(input: string, language: Language = "english", enableStemming = true): string[] {
  const tokens = tokenizer.tokenize(input);

  if (!enableStemming) {
    return Array.from(new Set(tokens));
  }

  return Array.from(new Set(stemArray(tokens, language)));
}
