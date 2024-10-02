export function createInternalDocumentIDStore() {
  return {
    idToInternalId: new Map(),
    internalIdToId: [],
    save,
    load
  }
}
export function save(store) {
  return {
    internalIdToId: store.internalIdToId
  }
}
export function load(orama, raw) {
  const { internalIdToId } = raw
  orama.internalDocumentIDStore.idToInternalId.clear()
  orama.internalDocumentIDStore.internalIdToId = []
  const internalIdToIdLength = internalIdToId.length
  for (let i = 0; i < internalIdToIdLength; i++) {
    const internalIdItem = internalIdToId[i]
    orama.internalDocumentIDStore.idToInternalId.set(internalIdItem, i + 1)
    orama.internalDocumentIDStore.internalIdToId.push(internalIdItem)
  }
}
export function getInternalDocumentId(store, id) {
  if (typeof id === 'string') {
    const internalId = store.idToInternalId.get(id)
    if (internalId) {
      return internalId
    }
    const currentId = store.idToInternalId.size + 1
    store.idToInternalId.set(id, currentId)
    store.internalIdToId.push(id)
    return currentId
  }
  if (id > store.internalIdToId.length) {
    return getInternalDocumentId(store, id.toString())
  }
  return id
}
export function getDocumentIdFromInternalId(store, internalId) {
  if (store.internalIdToId.length < internalId) {
    throw new Error(`Invalid internalId ${internalId}`)
  }
  return store.internalIdToId[internalId - 1]
}
//# sourceMappingURL=internal-document-id-store.js.map
