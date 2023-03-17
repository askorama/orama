import { Orama, SynonymConfig, ClearSynonymscConfig, AlternateQueriesOptions } from "../types.js";

export async function addSynonyms(db: Orama, config: SynonymConfig) {
  db.synonyms.add(db.data.synonyms, config);
}

export async function removeSynonyms(db: Orama, config: SynonymConfig) {
  db.synonyms.remove(db.data.synonyms, config);
}

export async function clearSynonyms(db: Orama, config: ClearSynonymscConfig) {
  db.synonyms.clear(db.data.synonyms, config);
}

export async function getSynonyms(db: Orama, config: ClearSynonymscConfig) {
  return db.synonyms.get(db.data.synonyms, config);
}

export async function getAlternateQueries(db: Orama, tokens: string[], options?: AlternateQueriesOptions) {
  return db.synonyms.getAlternateQueries(db.data.synonyms, tokens, options);
}