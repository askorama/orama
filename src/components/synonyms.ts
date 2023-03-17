import type {
  Schema,
  OpaqueIndex,
  OpaqueDocumentStore,
  SynonymsData,
  SynonymConfig,
  ClearSynonymscConfig,
  GetSynonymsConfig,
  ISynonyms,
} from "src/types";

import { createGraph, addDirectedValue, addUndirectedValue, removeDirectedValue, removeUndirectedValue, getAllValues } from "src/graphs/adjacency-matrix.js";
import { createError } from "../errors.js";

export const availableSynonymKinds = ["oneWay", "twoWay"] as const;

function create(): SynonymsData {
  return {
    oneWay: createGraph(),
    twoWay: createGraph(),
  };
}

function add(synonyms: SynonymsData, config: SynonymConfig) {
  const { kind, word, synonyms: synonymsList } = config;

  if (!availableSynonymKinds.includes(kind)) {
    throw createError("INVALID_SYNONYM_KIND", availableSynonymKinds.join(", "), kind);
  }

  if (kind === "oneWay") {
    synonymsList.forEach(synonym => addDirectedValue(synonyms.oneWay, word, synonym));
  }

  if (kind === "twoWay") {
    synonymsList.forEach(synonym => addUndirectedValue(synonyms.twoWay, word, synonym));
  }

}

function remove(synonyms: SynonymsData, config: SynonymConfig) {
  const { kind, word, synonyms: synonymsList } = config;

  if (!availableSynonymKinds.includes(kind)) {
    throw createError("INVALID_SYNONYM_KIND", availableSynonymKinds.join(", "), kind);
  }

  if (kind === "oneWay") {
    synonymsList.forEach(synonym => removeDirectedValue(synonyms.oneWay, word, synonym));
  }

  if (kind === "twoWay") {
    synonymsList.forEach(synonym => removeUndirectedValue(synonyms.twoWay, word, synonym));
  }

}

function clear(synonyms: SynonymsData, config: ClearSynonymscConfig) {
  const { kind, word } = config;

  if (!availableSynonymKinds.includes(kind)) {
    throw createError("INVALID_SYNONYM_KIND", availableSynonymKinds.join(", "), kind);
  }

  synonyms[kind][word] = {};
}

export function get(synonyms: SynonymsData, config: GetSynonymsConfig) {
  const { kind, word } = config;

  if (!availableSynonymKinds.includes(kind)) {
    throw createError("INVALID_SYNONYM_KIND", availableSynonymKinds.join(", "), kind);
  }

  return getAllValues(synonyms[kind], word); 
}

export function createSynonyms<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(): ISynonyms<
  S,
  I,
  D
> {
  return {
    create,
    add,
    remove,
    get,
    clear,
  };
}
