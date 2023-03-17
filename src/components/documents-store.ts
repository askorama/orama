import { Document, IDocumentsStore, OpaqueDocumentStore } from "../types.js";

export interface DocumentsStore extends OpaqueDocumentStore {
  docs: Record<string, Document | undefined>;
  count: number;
}

export type DefaultDocumentsStore = IDocumentsStore<DocumentsStore>;

export function create(): DocumentsStore {
  return {
    docs: {},
    count: 0,
  };
}

export function get(store: DocumentsStore, id: string): Document | undefined {
  return store.docs[id];
}

export function getMultiple(store: DocumentsStore, ids: string[]): (Document | undefined)[] {
  const found: (Document | undefined)[] = Array.from({ length: ids.length });

  for (let i = 0; i < ids.length; i++) {
    found[i] = store.docs[ids[i]];
  }

  return found;
}

export function store(store: DocumentsStore, id: string, doc: Document): boolean {
  if (typeof store.docs[id] !== "undefined") {
    return false;
  }

  store.docs[id] = doc;
  store.count++;

  return true;
}

export function remove(store: DocumentsStore, id: string): boolean {
  if (typeof store.docs[id] === "undefined") {
    return false;
  }

  store.docs[id] = undefined;
  store.count--;

  return true;
}

export function count(store: DocumentsStore): number {
  return store.count;
}

export function load<R = unknown>(raw: R): DocumentsStore {
  const rawDocument = raw as DocumentsStore;

  return {
    docs: rawDocument.docs,
    count: rawDocument.count,
  };
}

export function save<R = unknown>(docs: DocumentsStore): R {
  return {
    docs: docs.docs,
    count: docs.count,
  } as R;
}

export function createDocumentsStore(): DefaultDocumentsStore {
  return {
    create,
    get,
    getMultiple,
    store,
    remove,
    count,
    load,
    save,
  };
}
