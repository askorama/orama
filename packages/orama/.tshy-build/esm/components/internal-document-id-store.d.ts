import { AnyOrama } from '../types.js'
export type DocumentID = string | number
export type InternalDocumentID = number
export type InternalDocumentIDStore = {
  idToInternalId: Map<string, number>
  internalIdToId: string[]
  save: (store: InternalDocumentIDStore) => unknown
  load: <T extends AnyOrama>(orama: T, raw: unknown) => void
}
export declare function createInternalDocumentIDStore(): InternalDocumentIDStore
export declare function save(store: InternalDocumentIDStore): unknown
export declare function load<T extends AnyOrama>(orama: T, raw: unknown): void
export declare function getInternalDocumentId(store: InternalDocumentIDStore, id: DocumentID): InternalDocumentID
export declare function getDocumentIdFromInternalId(
  store: InternalDocumentIDStore,
  internalId: InternalDocumentID
): string
