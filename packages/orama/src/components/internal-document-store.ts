export type InternalDocumentStore = string | number;
export type InternalDocumentID = number;

const InternalDocumentIDCounter = Symbol('InternalDocumentIDCounter');

export type InternalDocumentIDStore = Record<string, InternalDocumentID> & { [InternalDocumentIDCounter]: number };

export function createInternalDocumentIDStore(): InternalDocumentIDStore {
  return {
    [InternalDocumentIDCounter]: 0
  };
}

export function getInternalDocumentId(store: InternalDocumentIDStore, id: InternalDocumentStore): InternalDocumentID {
  if (typeof id === "string" && isNaN(+id)) {
    const internalId = store[id];

    if (internalId) {
      return internalId;
    }

    const currentId = ++store[InternalDocumentIDCounter];

    store[id] = currentId;

    return currentId;
  }

  return id as number;
}
