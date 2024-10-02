import { getInternalDocumentId } from './internal-document-id-store.js'
export function create(_, sharedInternalDocumentStore) {
  return {
    sharedInternalDocumentStore,
    docs: {},
    count: 0
  }
}
export function get(store, id) {
  const internalId = getInternalDocumentId(store.sharedInternalDocumentStore, id)
  return store.docs[internalId]
}
export function getMultiple(store, ids) {
  const idsLength = ids.length
  const found = Array.from({ length: idsLength })
  for (let i = 0; i < idsLength; i++) {
    const internalId = getInternalDocumentId(store.sharedInternalDocumentStore, ids[i])
    found[i] = store.docs[internalId]
  }
  return found
}
export function getAll(store) {
  return store.docs
}
export function store(store, id, doc) {
  const internalId = getInternalDocumentId(store.sharedInternalDocumentStore, id)
  if (typeof store.docs[internalId] !== 'undefined') {
    return false
  }
  store.docs[internalId] = doc
  store.count++
  return true
}
export function remove(store, id) {
  const internalId = getInternalDocumentId(store.sharedInternalDocumentStore, id)
  if (typeof store.docs[internalId] === 'undefined') {
    return false
  }
  delete store.docs[internalId]
  store.count--
  return true
}
export function count(store) {
  return store.count
}
export function load(sharedInternalDocumentStore, raw) {
  const rawDocument = raw
  return {
    docs: rawDocument.docs,
    count: rawDocument.count,
    sharedInternalDocumentStore
  }
}
export function save(store) {
  return {
    docs: store.docs,
    count: store.count
  }
}
export function createDocumentsStore() {
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
//# sourceMappingURL=documents-store.js.map
