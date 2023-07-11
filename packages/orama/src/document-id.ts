export type DocumentID = string | number;
export type InternalDocumentID = number;

let currentId = 0;
const internalDocumentIdMap: Record<string, InternalDocumentID> = {};

export function getInternalDocumentId(id: DocumentID): InternalDocumentID {
  if (typeof id === 'string' && isNaN(+id)) {
    const internalId = internalDocumentIdMap[id];

    if (internalId) {
      return internalId;
    }

    internalDocumentIdMap[id] = ++currentId;

    return currentId;
  }

  return id as number;
}

export type SymbolMapJsonTransformer = {
  toJSON: typeof toJSONIntMapped;
}

export function createRecordWithToJson<V>(): Record<number, V> {
  const map = {};

  Object.defineProperty(map, 'toJSON', {
    value: toJSONIntMapped,
    enumerable: false,
    configurable: false,
    writable: false,
  });

  return map;
}

export function toJSONIntMapped(this: Record<number, any>): Record<string, any> {
  return Object.entries(this).reduce((obj, [key, internalId]) => {
    obj[key] = this[internalId];

    return obj;
  }, { } as Record<string, any>)
}
