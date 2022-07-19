import { WordTokenizer } from "natural";
import { Language, stemArray } from "./stemmer";

const tokenizer = new WordTokenizer();

export function tokenize(
  input: string,
  language: Language = "english",
  enableStemming = true
): Set<string> {
  const tokens = tokenizer.tokenize(input);

  if (!enableStemming) {
    return new Set(tokens);
  }

  return new Set(stemArray(tokens, language));
}
