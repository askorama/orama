import type { Language } from "../languages.js";
import { en } from "./en.js";
import { it } from "./it.js";
import { fr } from "./fr.js";
import { es } from "./es.js";
import { pt } from "./pt.js";
import { nl } from "./nl.js";
import { se } from "./se.js";
import { ru } from "./ru.js";
import { no } from "./no.js";
import { de } from "./de.js";
import { dk } from "./dk.js";
import { fi } from "./fi.js";

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
