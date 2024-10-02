import type { Optional } from '../types.js'
import { AnyDocument, AnyDocumentStore, AnyOrama, IDocumentsStore, TypedDocument } from '../types.js'
import { DocumentID, InternalDocumentID, InternalDocumentIDStore } from './internal-document-id-store.js'
export interface DocumentsStore extends AnyDocumentStore {
  sharedInternalDocumentStore: InternalDocumentIDStore
  docs: Record<InternalDocumentID, AnyDocument>
  count: number
}
export declare function create<T extends AnyOrama>(
  _: T,
  sharedInternalDocumentStore: InternalDocumentIDStore
): DocumentsStore
export declare function get<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  store: DocumentsStore,
  id: DocumentID
): Optional<ResultDocument>
export declare function getMultiple<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  store: DocumentsStore,
  ids: DocumentID[]
): Optional<ResultDocument>[]
export declare function getAll<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  store: DocumentsStore
): Record<InternalDocumentID, ResultDocument>
export declare function store(store: DocumentsStore, id: DocumentID, doc: AnyDocument): boolean
export declare function remove(store: DocumentsStore, id: DocumentID): boolean
export declare function count(store: DocumentsStore): number
export declare function load<R = unknown>(sharedInternalDocumentStore: InternalDocumentIDStore, raw: R): DocumentsStore
export declare function save<R = unknown>(store: DocumentsStore): R
export declare function createDocumentsStore(): IDocumentsStore<DocumentsStore>
