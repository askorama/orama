import { Document, IDocumentsStore, OpaqueDocumentStore } from '../types.js'

export interface DocumentsStore extends OpaqueDocumentStore {
  docs: Record<string, Document | undefined>
  count: number
}

export type DefaultDocumentsStore = IDocumentsStore<DocumentsStore>

export async function create(): Promise<DocumentsStore> {
  return {
    docs: {},
    count: 0,
  }
}

export async function get<D extends OpaqueDocumentStore = OpaqueDocumentStore>(store: D, id: string): Promise<Document | undefined> {
  return (store as unknown as DocumentsStore).docs[id]
}

export async function getMultiple<D extends OpaqueDocumentStore = OpaqueDocumentStore>(s: D, ids: string[]): Promise<(Document | undefined)[]> {
  const store = s as unknown as DocumentsStore
  const found: (Document | undefined)[] = Array.from({ length: ids.length })

  for (let i = 0; i < ids.length; i++) {
    found[i] = store.docs[ids[i]]
  }

  return found
}

export async function getAll<D extends OpaqueDocumentStore = OpaqueDocumentStore>(store: D): Promise<Record<string, Document>> {
  return (store as unknown as DocumentsStore).docs as Record<string, Document>
}

export async function store<D extends OpaqueDocumentStore = OpaqueDocumentStore>(s: D, id: string, doc: Document): Promise<boolean> {
  const store = s as unknown as DocumentsStore
  if (typeof store.docs[id] !== 'undefined') {
    return false
  }

  store.docs[id] = doc
  store.count++

  return true
}

export async function remove<D extends OpaqueDocumentStore = OpaqueDocumentStore>(s: D, id: string): Promise<boolean> {
  const store = s as unknown as DocumentsStore
  if (typeof store.docs[id] === 'undefined') {
    return false
  }

  delete store.docs[id]
  store.count--

  return true
}

export async function count<D extends OpaqueDocumentStore = OpaqueDocumentStore>(store: D): Promise<number> {
  return (store as unknown as DocumentsStore).count
}

export async function load<R = unknown>(raw: R): Promise<DocumentsStore> {
  const rawDocument = raw as DocumentsStore

  return {
    docs: rawDocument.docs,
    count: rawDocument.count,
  }
}

export async function save<R = unknown>(docs: DocumentsStore): Promise<R> {
  return {
    docs: docs.docs,
    count: docs.count,
  } as R
}

export async function createDocumentsStore(): Promise<IDocumentsStore<OpaqueDocumentStore>> {
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
