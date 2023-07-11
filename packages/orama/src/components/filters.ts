export function intersectFilteredIDs(filtered: number[], lookedUp: [number, number][]): [number, number][] {
  const map = new Map<number, boolean>()
  const result: [number, number][] = []

  for (const id of filtered) {
    map.set(id, true)
  }

  for (const [id, score] of lookedUp) {
    if (map.has(id)) {
      result.push([+id, score])
      map.delete(id)
    }
  }

  return result
}
