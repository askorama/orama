import { AnyDocument, AnyDocumentStore, AnyOrama, IDocumentsStore, TypedDocument } from '../types.js'
import {
  DocumentID,
  InternalDocumentID,
  InternalDocumentIDStore,
  getInternalDocumentId
} from './internal-document-id-store.js'

export interface DocumentsStore extends AnyDocumentStore {
  sharedInternalDocumentStore: InternalDocumentIDStore
  docs: Record<InternalDocumentID, AnyDocument>
  count: number
}

export async function create<T extends AnyOrama>(
  _: T,
  sharedInternalDocumentStore: InternalDocumentIDStore
): Promise<DocumentsStore> {
  return {
    sharedInternalDocumentStore,
    docs: {},
    count: 0
  }
}

export async function get<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  store: DocumentsStore,
  id: DocumentID
): Promise<ResultDocument | undefined> {
  const internalId = getInternalDocumentId(store.sharedInternalDocumentStore, id)

  return store.docs[internalId]
}

export async function getMultiple<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  store: DocumentsStore,
  ids: DocumentID[]
): Promise<(ResultDocument | undefined)[]> {
  const idsLength = ids.length
  const found: (ResultDocument | undefined)[] = Array.from({ length: idsLength })

  for (let i = 0; i < idsLength; i++) {
    const internalId = getInternalDocumentId(store.sharedInternalDocumentStore, ids[i])
    found[i] = store.docs[internalId]
  }

  return found
}

export async function getAll<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  store: DocumentsStore
): Promise<Record<InternalDocumentID, ResultDocument>> {
  return store.docs
}

export async function store(store: DocumentsStore, id: DocumentID, doc: AnyDocument): Promise<boolean> {
  const internalId = getInternalDocumentId(store.sharedInternalDocumentStore, id)

  if (typeof store.docs[internalId] !== 'undefined') {
    return false
  }

  store.docs[internalId] = doc
  store.count++

  return true
}

export async function remove(store: DocumentsStore, id: DocumentID): Promise<boolean> {
  const internalId = getInternalDocumentId(store.sharedInternalDocumentStore, id)

  if (typeof store.docs[internalId] === 'undefined') {
    return false
  }

  delete store.docs[internalId]
  store.count--

  return true
}

export async function count(store: DocumentsStore): Promise<number> {
  return store.count
}

export async function load<R = unknown>(
  sharedInternalDocumentStore: InternalDocumentIDStore,
  raw: R
): Promise<DocumentsStore> {
  const rawDocument = raw as DocumentsStore

  return {
    docs: rawDocument.docs,
    count: rawDocument.count,
    sharedInternalDocumentStore
  }
}

export async function save<R = unknown>(store: DocumentsStore): Promise<R> {
  return {
    docs: store.docs,
    count: store.count
  } as R
}

export async function createDocumentsStore(): Promise<IDocumentsStore<DocumentsStore>> {
  return {
    create,
    get,
    getMultiple,
    getAll,
    store,
    remove,
    count,
    load,
    save
  }
}
