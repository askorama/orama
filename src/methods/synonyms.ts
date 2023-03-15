import { Lyra, Schema, OpaqueDocumentStore, OpaqueIndex, SynonymConfig } from "src/types";

export async function addSynonyms<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  db: Lyra<S, I, D>,
  config: SynonymConfig,
) {
  db.synonyms.add(db.data.synonyms, config);
}

export async function removeSynonyms<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  db: Lyra<S, I, D>,
  config: SynonymConfig,
) {
  db.synonyms.remove(db.data.synonyms, config);
}

export async function clearSynonyms<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  db: Lyra<S, I, D>,
  config: SynonymConfig,
) {
  db.synonyms.clear(db.data.synonyms, config);
}
