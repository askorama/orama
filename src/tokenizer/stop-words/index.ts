import type { Language } from "../languages";
import { en } from "./en";

type StopWordsMap = {
  [key in Language]: string[];
};

export const stopWords: Partial<StopWordsMap> = {
  english: en,
};

export const availableStopWords = Object.keys(stopWords);
