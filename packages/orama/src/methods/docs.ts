import { Document, OpaqueDocumentStore, OpaqueIndex, OpaqueSorter, Orama, Schema } from '../types.js'

export function getByID
<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore, So extends OpaqueSorter>
(db: Orama<S, I, D, So>, id: string): Promise<Document | undefined> {
  return db.documentsStore.get(db.data.docs, id) as Promise<Document | undefined>
}

export function count
<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore, So extends OpaqueSorter>
(db: Orama<S, I, D, So>): Promise<number> {
  return db.documentsStore.count(db.data.docs) as Promise<number>
}
