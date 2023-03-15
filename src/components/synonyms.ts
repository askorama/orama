import type { Schema, OpaqueIndex, OpaqueDocumentStore, SynonymsData, SynonymConfig, ClearSynonymscConfig, ISynonyms } from "src/types";
import { createError } from "src/errors";

export const availableSynonymKinds = ['oneWay', 'twoWay'] as const;

function create(): SynonymsData {
  return {
    oneWay: {},
    twoWay: {},
  };
}

function add(synonyms: SynonymsData, config: SynonymConfig) {
  const { kind, word, synonyms: synonymsList } = config;

  if (synonyms[kind][word]) {
    synonyms[kind][word].push(...synonymsList);
  } else {
    synonyms[kind][word] = synonymsList;
  }
}

function remove(synonyms: SynonymsData, config: SynonymConfig) {
  const { kind, word, synonyms: synonymsList } = config;

  if (!availableSynonymKinds.includes(kind)) {
    throw createError('INVALID_SYNONYM_KIND', availableSynonymKinds.join(', '), kind);
  }

  if (synonyms[kind][word]) {
    synonyms[kind][word] = synonyms[kind][word].filter(synonym => !synonymsList.includes(synonym));
  }
}

function clear(synonyms: SynonymsData, config: ClearSynonymscConfig) {
  const { kind, word } = config;

  if (!availableSynonymKinds.includes(kind)) {
    throw createError('INVALID_SYNONYM_KIND', availableSynonymKinds.join(', '), kind);
  }

  if (synonyms[kind][word]) {
    synonyms[kind][word] = [];
  }
}

export function getSynonyms(synonyms: SynonymsData, config: SynonymConfig) {
  const { kind, word } = config;

  if (!availableSynonymKinds.includes(kind)) {
    throw createError('INVALID_SYNONYM_KIND', availableSynonymKinds.join(', '), kind);
  }

  return synonyms[kind][word] || [];
}

export function createSynonyms<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(): ISynonyms<S, I, D> {
  return {
    create,
    add,
    remove,
    clear,
  }
}
