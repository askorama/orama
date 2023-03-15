import { Document, Orama, OpaqueDocumentStore, OpaqueIndex, Schema } from "../types.js";

export async function getByID<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  db: Orama<S, I, D>,
  id: string,
): Promise<Document | undefined> {
  return await (db.documentsStore.get(db.data.docs, id) as Promise<Document | undefined>);
}

export async function count<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  db: Orama<S, I, D>,
): Promise<number> {
  return await (db.documentsStore.count(db.data.docs) as Promise<number>);
}
