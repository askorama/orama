import { Document, Orama, OpaqueDocumentStore, OpaqueIndex, Schema } from "../types.js";

export function getByID<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  db: Orama<S, I, D>,
  id: string,
): Promise<Document | undefined> {
  return db.documentsStore.get(db.data.docs, id) as Promise<Document | undefined>;
}

export function count<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  db: Orama<S, I, D>,
): Promise<number> {
  return db.documentsStore.count(db.data.docs) as Promise<number>;
}
