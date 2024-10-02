export function intersectFilteredIDs(filtered, lookedUp) {
  const map = new Map()
  const result = []
  for (const id of filtered) {
    map.set(id, true)
  }
  for (const looked of lookedUp) {
    const [id] = looked
    if (map.has(id)) {
      result.push(looked)
      map.delete(id)
    }
  }
  return result
}
//# sourceMappingURL=filters.js.map
