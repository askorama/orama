import type {
  SynonymsData,
  SynonymConfig,
  ClearSynonymscConfig,
  GetSynonymsConfig,
  ISynonyms,
  AlternateQueriesOptions,
} from '../types.js'

import {
  createGraph,
  addDirectedValue,
  addUndirectedValue,
  removeDirectedValue,
  removeUndirectedValue,
  getAllValues,
} from '../graphs/adjacency-matrix.js';

import { createError } from '../errors.js';

export const availableSynonymKinds = ['oneWay', 'twoWay'] as const;

function create(): SynonymsData {
  return {
    oneWay: createGraph(),
    twoWay: createGraph(),
  };
}

function add(synonyms: SynonymsData, config: SynonymConfig) {
  const { kind, word, synonyms: synonymsList } = config;

  if (!availableSynonymKinds.includes(kind)) {
    throw createError('INVALID_SYNONYM_KIND', availableSynonymKinds.join(', '), kind);
  }

  if (kind === 'oneWay') {
    synonymsList.forEach(synonym => addDirectedValue(synonyms.oneWay, word, synonym));
  }

  if (kind === 'twoWay') {
    synonymsList.forEach(synonym => addUndirectedValue(synonyms.twoWay, word, synonym));
  }
}

function remove(synonyms: SynonymsData, config: SynonymConfig) {
  const { kind, word, synonyms: synonymsList } = config;

  if (!availableSynonymKinds.includes(kind)) {
    throw createError('INVALID_SYNONYM_KIND', availableSynonymKinds.join(', '), kind);
  }

  if (kind === 'oneWay') {
    synonymsList.forEach(synonym => removeDirectedValue(synonyms.oneWay, word, synonym));
  }

  if (kind === 'twoWay') {
    synonymsList.forEach(synonym => removeUndirectedValue(synonyms.twoWay, word, synonym));
  }
}

function clear(synonyms: SynonymsData, config: ClearSynonymscConfig) {
  const { kind, word } = config;

  if (!availableSynonymKinds.includes(kind)) {
    throw createError('INVALID_SYNONYM_KIND', availableSynonymKinds.join(', '), kind);
  }

  synonyms[kind][word] = {};
}

export function get(synonyms: SynonymsData, config: GetSynonymsConfig) {
  const { kind, word } = config;

  if (!availableSynonymKinds.includes(kind)) {
    throw createError('INVALID_SYNONYM_KIND', availableSynonymKinds.join(', '), kind);
  }

  return getAllValues(synonyms[kind], word);
}

const defaultOptions: AlternateQueriesOptions = {
  limit: 10,
  cache: new Map<string, string[]>(),
};

export function getAlternateQueries(
  synonyms: SynonymsData,
  tokens: string[],
  options?: AlternateQueriesOptions,
): string[] {
  options = { ...defaultOptions, ...options };
  const { limit, cache } = options;
  const alternateQueries = new Set<string>();

  for (const token of tokens) {
    let cachedSynonyms = cache!.get(token);

    if (!cachedSynonyms) {
      const oneWay = get(synonyms, { kind: 'oneWay', word: token });
      const twoWay = get(synonyms, { kind: 'twoWay', word: token });
      cachedSynonyms = [...oneWay, ...twoWay];
      cache!.set(token, cachedSynonyms);
    }

    for (const synonym of cachedSynonyms ?? []) {
      const alternateQueryTerms = [...tokens];
      const termIndex = alternateQueryTerms.indexOf(token);
      alternateQueryTerms[termIndex] = synonym;

      const alternateQuery = alternateQueryTerms.join(' ');
      alternateQueries.add(alternateQuery);

      if (alternateQueries.size >= limit!) {
        return [...alternateQueries];
      }
    }
  }

  return [...alternateQueries];
}

export function createSynonyms(): ISynonyms {
  return {
    create,
    add,
    remove,
    get,
    clear,
    getAlternateQueries,
  };
}