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

export async function get(store: DocumentsStore, id: string): Promise<Document | undefined> {
  return (store as unknown as DocumentsStore).docs[id]
}

export async function getMultiple(store: DocumentsStore, ids: string[]): Promise<(Document | undefined)[]> {
  const found: (Document | undefined)[] = Array.from({ length: ids.length })

  for (let i = 0; i < ids.length; i++) {
    found[i] = store.docs[ids[i]]
  }

  return found
}

export async function getAll(store: DocumentsStore): Promise<Record<string, Document>> {
  return store.docs as Record<string, Document>
}

export async function store(store: DocumentsStore, id: string, doc: Document): Promise<boolean> {
  if (typeof store.docs[id] !== 'undefined') {
    return false
  }

  store.docs[id] = doc
  store.count++

  return true
}

export async function remove(store: DocumentsStore, id: string): Promise<boolean> {
  if (typeof store.docs[id] === 'undefined') {
    return false
  }

  delete store.docs[id]
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
