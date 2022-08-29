import type { Language } from "../languages";
import { en } from "./en";
import { it } from "./it";
import { fr } from "./fr";
import { es } from "./es";
import { pt } from "./pt";
import { nl } from "./nl";
import { se } from "./se";
import { ru } from "./ru";
import { no } from "./no";
import { de } from "./de";
import { dk } from "./dk";
import { fi } from "./fi";

type StopWordsMap = {
  [key in Language]: string[];
};

export const stopWords: Partial<StopWordsMap> = {
  english: en,
  italian: it,
  french: fr,
  spanish: es,
  portuguese: pt,
  dutch: nl,
  swedish: se,
  russian: ru,
  norwegian: no,
  german: de,
  danish: dk,
  finnish: fi,
};

export const availableStopWords = Object.keys(stopWords);
