import { Document, Orama } from '../types.js'

export function getByID(db: Orama, id: string): Promise<Document | undefined> {
  return db.documentsStore.get(db.data.docs, id) as Promise<Document | undefined>
}

export function count(db: Orama): Promise<number> {
  return db.documentsStore.count(db.data.docs) as Promise<number>
}
