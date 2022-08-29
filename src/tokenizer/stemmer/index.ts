import type { Language } from "../languages";
import { stem as ENStemmer } from "./en";

type Stemmer = (word: string) => string;

type StemmerMap = {
  [key in Language]: Stemmer;
};

export const stemmers: Partial<StemmerMap> = {
  english: ENStemmer,
};

export const availableStemmers = Object.keys(stemmers);
