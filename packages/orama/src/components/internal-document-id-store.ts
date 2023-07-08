import { Orama } from '../types.js';

export type DocumentID = string | number;
export type InternalDocumentID = number;

export type InternalDocumentIDStore = {
  idToInternalId: Map<string, number>;
  internalIdToId: string[];
  save: (store: InternalDocumentIDStore) => unknown;
  load: (orama: Orama, raw: unknown) => void;
};

export function createInternalDocumentIDStore(): InternalDocumentIDStore {
  return {
    idToInternalId: new Map(),
    internalIdToId: [],
    save,
    load,
  };
}

export function save(store: InternalDocumentIDStore): unknown {
  return {
    internalIdToId: store.internalIdToId,
  };
}

export function load(orama: Orama, raw: unknown): void {
  const { internalIdToId } = raw as InternalDocumentIDStore;

  orama.internalDocumentIDStore.idToInternalId.clear();
  orama.internalDocumentIDStore.internalIdToId = [];

  for (let i = 0; i < internalIdToId.length; i++) {
    orama.internalDocumentIDStore.idToInternalId.set(internalIdToId[i], i + 1);
    orama.internalDocumentIDStore.internalIdToId.push(internalIdToId[i]);
  }
}

export function getInternalDocumentId(store: InternalDocumentIDStore, id: DocumentID): InternalDocumentID {
  if (typeof id === "string") {
    const internalId = store.idToInternalId.get(id);

    if (internalId) {
      return internalId;
    }

    const currentId = store.idToInternalId.size + 1;

    store.idToInternalId.set(id, currentId);
    store.internalIdToId.push(id);

    return currentId;
  }

  return id as number;
}

export function getDocumentIdFromInternalId(store: InternalDocumentIDStore, internalId: InternalDocumentID): string {
  if (store.internalIdToId.length < internalId) {
    throw new Error(`Invalid internalId ${internalId}`);
  }

  return store.internalIdToId[internalId - 1];
}

