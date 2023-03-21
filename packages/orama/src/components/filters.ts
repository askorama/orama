export function intersectFilteredIDs(filtered: string[], lookedUp: [string, number][]): [string, number][] {
  const map = new Map<string, boolean>()
  const result: [string, number][] = []

  for (const id of filtered) {
    map.set(id, true)
  }

  for (const [id, score] of lookedUp) {
    if (map.has(id)) {
      result.push([id, score])
      map.delete(id)
    }
  }

  return result
}
