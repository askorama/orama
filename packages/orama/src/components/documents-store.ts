import { createRecordWithToJson, DocumentID, getInternalDocumentId, InternalDocumentID } from "../document-id.js";
import { Document, IDocumentsStore, OpaqueDocumentStore } from "../types.js";

export interface DocumentsStore extends OpaqueDocumentStore {
  docs: Record<InternalDocumentID, Document | undefined>,
  count: number
}

export type DefaultDocumentsStore = IDocumentsStore<DocumentsStore>

export async function create(): Promise<DocumentsStore> {
  return {
    docs: createRecordWithToJson<Document | undefined>(),
    count: 0,
  }
}

export async function get(store: DocumentsStore, id: string): Promise<Document | undefined> {
  const internalId = getInternalDocumentId(id);

  return store.docs[internalId]
}

export async function getMultiple(store: DocumentsStore, ids: DocumentID[]): Promise<(Document | undefined)[]> {
  const found: (Document | undefined)[] = Array.from({ length: ids.length })

  for (let i = 0; i < ids.length; i++) {
    const internalId = getInternalDocumentId(ids[i])
    found[i] = store.docs[internalId]
  }

  return found
}

export async function getAll(store: DocumentsStore): Promise<Record<string, Document>> {
  return store.docs as unknown as Record<string, Document>
}

export async function store(store: DocumentsStore, id: DocumentID, doc: Document): Promise<boolean> {
  const internalId = getInternalDocumentId(id);

  if (typeof store.docs[internalId] !== 'undefined') {
    return false
  }

  store.docs[internalId] = doc
  store.count++

  return true
}

export async function remove(store: DocumentsStore, id: DocumentID): Promise<boolean> {
  const internalId = getInternalDocumentId(id);

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

export async function load<R = unknown>(raw: R): Promise<DocumentsStore> {
  const rawDocument = raw as DocumentsStore

  return {
    docs: rawDocument.docs,
    count: rawDocument.count,
  }
}

export async function save<R = unknown>(store: DocumentsStore): Promise<R> {
  return {
    docs: store.docs,
    count: store.count,
  } as R
}

export async function createDocumentsStore(): Promise<DefaultDocumentsStore> {
  return {
    create,
    get,
    getMultiple,
    getAll,
    store,
    remove,
    count,
    load,
    save,
  }
}
