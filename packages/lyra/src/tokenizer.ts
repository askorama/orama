import { WordTokenizer } from "natural";
import { Language, stemArray } from "./stemmer";

const tokenizer = new WordTokenizer();

export function tokenize(
  input: string,
  language: Language = "english"
): Set<string> {
  const tokens = tokenizer.tokenize(input);
  return new Set(stemArray(tokens, language));
}
