import { Document, IDocumentsStore, OpaqueDocumentStore, OpaqueIndex, Schema } from "../types.js";

export interface DocumentsStore extends OpaqueDocumentStore {
  docs: Record<string, Document | undefined>;
  count: number;
}

type DefaultDocumentsStore<S extends Schema, I extends OpaqueIndex> = IDocumentsStore<S, I, DocumentsStore>;

function create(): DocumentsStore {
  return {
    docs: {},
    count: 0,
  };
}

function get(store: DocumentsStore, id: string): Document | undefined {
  return store.docs[id];
}

function getMultiple(store: DocumentsStore, ids: string[]): (Document | undefined)[] {
  const found: (Document | undefined)[] = Array.from({ length: ids.length });

  for (let i = 0; i < ids.length; i++) {
    found[i] = store.docs[ids[i]];
  }

  return found;
}

function store(store: DocumentsStore, id: string, doc: Document): boolean {
  if (typeof store.docs[id] !== "undefined") {
    return false;
  }

  store.docs[id] = doc;
  store.count++;

  return true;
}

function remove(store: DocumentsStore, id: string): boolean {
  if (typeof store.docs[id] === "undefined") {
    return false;
  }

  store.docs[id] = undefined;
  store.count--;

  return true;
}

function count(store: DocumentsStore): number {
  return store.count;
}

function load(raw: unknown): DocumentsStore {
  const rawDocument = raw as DocumentsStore;

  return {
    docs: rawDocument.docs,
    count: rawDocument.count,
  };
}

function save(docs: DocumentsStore): unknown {
  return {
    docs: docs.docs,
    count: docs.count,
  };
}

export function createDocumentsStore<S extends Schema, I extends OpaqueIndex>(): DefaultDocumentsStore<S, I> {
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
