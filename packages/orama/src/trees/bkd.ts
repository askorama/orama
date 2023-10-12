import type { Nullable, GenericSorting } from '../types.js'
import type { InternalDocumentID } from '../components/internal-document-id-store.js'

export interface Point {
  lon: number
  lat: number
}

export interface Node {
  point: Point
  docIDs?: InternalDocumentID[]
  left?: Node
  right?: Node
  parent?: Node
}

export interface RootNode {
  root: Nullable<Node>
}

export interface GeoSearchResult {
  point: Point
  docIDs: InternalDocumentID[]
}

export type SortGeoPoints = Nullable<GenericSorting>

interface SearchTask {
  node: Nullable<Node>
  depth: number
}

const K = 2 // 2D points
const EARTH_RADIUS = 6371e3 // Earth radius in meters

export function create (): RootNode {
  return { root: null }
}

export function insert (tree: RootNode, point: Point, docIDs: InternalDocumentID[]): void {
  const newNode: Node = { point, docIDs }

  if (tree.root == null) {
    tree.root = newNode
    return
  }

  let node: Nullable<Node> = tree.root
  let depth = 0

  while (node !== null) {
    // Check if the current node's point matches the new point
    if (node.point.lon === point.lon && node.point.lat === point.lat) {
      // Merge the new docIDs with the existing ones and remove duplicates
      const newDocIDs = node.docIDs ?? []
      node.docIDs = Array.from(new Set([...newDocIDs, ...docIDs || []]))
      return
    }

    const axis = depth % K

    // Compare by longitude
    if (axis === 0) {
      if (point.lon < node.point.lon) {
        if (node.left == null) {
          node.left = newNode
          return
        }
        node = node.left
      } else {
        if (node.right == null) {
          node.right = newNode
          return
        }
        node = node.right
      }
    // Compare by latitude
    } else {
      if (point.lat < node.point.lat) {
        if (node.left == null) {
          node.left = newNode
          return
        }
        node = node.left
      } else {
        if (node.right == null) {
          node.right = newNode
          return
        }
        node = node.right
      }
    }

    depth++
  }
}

export function contains (tree: RootNode, point: Point): boolean {
  let node: Nullable<Node> | undefined = tree.root
  let depth = 0

  while (node != null) {
    if (node?.point.lon === point.lon && node.point.lat === point.lat) {
      return true
    }

    const axis = depth % K

    // Compare by longitude
    if (axis === 0) {
      if (point.lon < node.point.lon) {
        node = node?.left
      } else {
        node = node?.right
      }
    // Compare by latitude
    } else {
      if (point.lat < node.point.lat) {
        node = node?.left
      } else {
        node = node?.right
      }
    }

    depth++
  }

  return false
}

// @todo: this is very inefficient. Fix this later.
export function removeDocByID (tree: RootNode, point: Point, docID: InternalDocumentID): void {
  let node: Nullable<Node> | undefined = tree.root
  let depth = 0
  let parentNode: Nullable<Node> = null
  let direction: 'left' | 'right' | null = null

  while (node !== null) {
    if (node?.point.lon === point.lon && node.point.lat === point.lat) {
      const index = node.docIDs?.indexOf(docID)
      if (index !== undefined && index > -1) {
        // Remove the docID from the array
        node.docIDs?.splice(index, 1)

        if ((node.docIDs == null) || node.docIDs.length === 0) {
          // If the node doesn't have any more docIDs, remove the node
          if (parentNode != null) {
            if (direction === 'left') {
              parentNode.left = (node.left !== null) ? node.left : node.right
            } else if (direction === 'right') {
              parentNode.right = (node.right !== null) ? node.right : node.left
            }
          } else {
            // If the node to be removed is the root
            tree.root = ((node.left !== null) ? node.left : node.right) as Node
          }
        }

        return
      }
    }

    const axis = depth % K

    parentNode = node as Nullable<Node>
    // Compare by longitude
    if (axis === 0) {
      if (point.lon < node!.point.lon) {
        node = node?.left
        direction = 'left'
      } else {
        node = node?.right
        direction = 'right'
      }
    // Compare by latitude
    } else {
      if (point.lat < node!.point.lat) {
        node = node?.left
        direction = 'left'
      } else {
        node = node?.right
        direction = 'right'
      }
    }

    depth++
  }
}

export function getDocIDsByCoordinates (tree: RootNode, point: Point): Nullable<InternalDocumentID[]> {
  let node: Nullable<Node> = tree.root
  let depth = 0

  while (node !== null) {
    if (node.point.lon === point.lon && node.point.lat === point.lat) {
      // prettier-ignore
      return node.docIDs ?? null
    }

    const axis = depth % K

    // Compare by longitude
    if (axis === 0) {
      if (point.lon < node.point.lon) {
        node = node.left as Nullable<Node>
      } else {
        node = node.right as Nullable<Node>
      }
    // Compare by latitude
    } else {
      if (point.lat < node.point.lat) {
        node = node.left as Nullable<Node>
      } else {
        node = node.right as Nullable<Node>
      }
    }

    depth++
  }

  return null
}

export function searchByRadius (
  node: Nullable<Node>,
  center: Point,
  radius: number,
  inclusive = true,
  sort: SortGeoPoints = 'asc'
): GeoSearchResult[] {
  const stack: Array<{ node: Nullable<Node>, depth: number }> = [{ node, depth: 0 }]
  const result: GeoSearchResult[] = []

  while (stack.length > 0) {
    const { node, depth } = stack.pop() as { node: Node, depth: number }
    if (node === null) continue

    const dist = haversineDistance(center, node.point)

    if (inclusive ? dist <= radius : dist > radius) {
      result.push({ point: node.point, docIDs: node.docIDs ?? [] })
    }

    if (node.left != null) {
      stack.push({ node: node.left, depth: depth + 1 })
    }
    if (node.right != null) {
      stack.push({ node: node.right, depth: depth + 1 })
    }
  }

  if (sort) {
    result.sort((a, b) => {
      const distA = haversineDistance(center, a.point)
      const distB = haversineDistance(center, b.point)
      return sort.toLowerCase() === 'asc' ? distA - distB : distB - distA
    })
  }

  return result
}

export function searchByPolygon (root: Nullable<Node>, polygon: Point[], inclusive = true, sort: SortGeoPoints = null): GeoSearchResult[] {
  const stack: SearchTask[] = [{ node: root, depth: 0 }]
  const result: GeoSearchResult[] = []

  while (stack.length > 0) {
    const task = stack.pop()
    if ((task == null) || (task.node == null)) continue

    const { node, depth } = task
    const nextDepth = depth + 1

    if (node.left != null) {
      stack.push({ node: node.left, depth: nextDepth })
    }

    if (node.right != null) {
      stack.push({ node: node.right, depth: nextDepth })
    }

    const isInsidePolygon = isPointInPolygon(polygon, node.point)

    if (isInsidePolygon && inclusive) {
      result.push({ point: node.point, docIDs: node.docIDs ?? [] })
    } else if (!isInsidePolygon && !inclusive) {
      result.push({ point: node.point, docIDs: node.docIDs ?? [] })
    }
  }

  const centroid = calculatePolygonCentroid(polygon)

  if (sort !== null) {
    result.sort((a, b) => {
      const distA = haversineDistance(centroid, a.point)
      const distB = haversineDistance(centroid, b.point)
      return sort.toLowerCase() === 'asc' ? distA - distB : distB - distA
    })
  }

  return result
}

function calculatePolygonCentroid (polygon: Point[]): Point {
  let totalArea = 0
  let centroidX = 0
  let centroidY = 0

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lon
    const yi = polygon[i].lat
    const xj = polygon[j].lon
    const yj = polygon[j].lat

    const areaSegment = xi * yj - xj * yi
    totalArea += areaSegment

    centroidX += (xi + xj) * areaSegment
    centroidY += (yi + yj) * areaSegment
  }

  totalArea /= 2

  centroidX /= (6 * totalArea)
  centroidY /= (6 * totalArea)

  return { lon: centroidX, lat: centroidY }
}

function isPointInPolygon (polygon: Point[], point: Point): boolean {
  let isInside = false
  const x = point.lon; const y = point.lat
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lon; const yi = polygon[i].lat
    const xj = polygon[j].lon; const yj = polygon[j].lat

    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersect) isInside = !isInside
  }

  return isInside
}

function haversineDistance (coord1, coord2): number {
  const lat1 = coord1.lat * (Math.PI / 180)
  const lat2 = coord2.lat * (Math.PI / 180)
  const deltaLat = (coord2.lat - coord1.lat) * (Math.PI / 180)
  const deltaLon = (coord2.lon - coord1.lon) * (Math.PI / 180)

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS * c
}
