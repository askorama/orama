import { AnyOrama, TypedDocument } from '../types.js'

export function getByID<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  db: T,
  id: string
): Promise<ResultDocument | undefined> {
  return db.documentsStore.get(db.data.docs, id) as Promise<ResultDocument | undefined>
}

export function count<T extends AnyOrama>(db: T): Promise<number> {
  return db.documentsStore.count(db.data.docs) as Promise<number>
}
