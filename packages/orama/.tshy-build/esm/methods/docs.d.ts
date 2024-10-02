import { AnyOrama, TypedDocument, Optional } from '../types.js'
export declare function getByID<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  db: T,
  id: string
): Optional<ResultDocument>
export declare function count<T extends AnyOrama>(db: T): number
