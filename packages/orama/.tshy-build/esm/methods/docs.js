export function getByID(db, id) {
  return db.documentsStore.get(db.data.docs, id)
}
export function count(db) {
  return db.documentsStore.count(db.data.docs)
}
//# sourceMappingURL=docs.js.map
