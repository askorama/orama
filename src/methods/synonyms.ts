import type { Lyra, PropertiesSchema } from "../types/index.js";
import * as ERRORS from "../errors.js";

export type SynonymConfig = {
  kind: typeof availableKinds[number];
  word: string;
  synonyms: string[];
}

export type ClearSynonymscConfig = {
  kind: typeof availableKinds[number];
  word: string;
}

export const availableKinds = ['oneWay', 'twoWay'] as const;

export async function addSynonyms<T extends PropertiesSchema>(db: Lyra<T>, synonyms: SynonymConfig) {
  const { kind, word, synonyms: synonymsList } = synonyms;

  if (!availableKinds.includes(kind)) {
    throw new Error(ERRORS.INVALID_SYNONYM_KIND(kind, availableKinds));
  }

  if (db.synonyms[kind][word]) {
    db.synonyms[kind][word].push(...synonymsList);
  } else {
    db.synonyms[kind][word] = synonymsList;
  }
}

export async function removeSynonyms<T extends PropertiesSchema>(db: Lyra<T>, synonyms: SynonymConfig) {
  const { kind, word, synonyms: synonymsList } = synonyms;

  if (!availableKinds.includes(kind)) {
    throw new Error(ERRORS.INVALID_SYNONYM_KIND(kind, availableKinds));
  }

  if (db.synonyms[kind][word]) {
    db.synonyms[kind][word] = db.synonyms[kind][word].filter(synonym => !synonymsList.includes(synonym));
  }
}

export async function clearSynonyms<T extends PropertiesSchema>(db: Lyra<T>, synonyms: ClearSynonymscConfig) {
  const { kind, word } = synonyms;

  if (!availableKinds.includes(kind)) {
    throw new Error(ERRORS.INVALID_SYNONYM_KIND(kind, availableKinds));
  }

  if (db.synonyms[kind][word]) {
    db.synonyms[kind][word] = [];
  }
}