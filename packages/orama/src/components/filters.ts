import { InternalDocumentID } from './internal-document-id-store.js';

export function intersectFilteredIDs(filtered: InternalDocumentID[], lookedUp: [InternalDocumentID, number][]): [InternalDocumentID, number][] {
  const map = new Map<number, boolean>()
  const result: [number, number][] = []

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
