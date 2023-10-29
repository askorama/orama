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
  sort: SortGeoPoints = 'asc',
  highPrecision = false
): GeoSearchResult[] {
  const distanceFn = highPrecision ? vincentyDistance : haversineDistance
  const stack: Array<{ node: Nullable<Node>, depth: number }> = [{ node, depth: 0 }]
  const result: GeoSearchResult[] = []

  while (stack.length > 0) {
    const { node, depth } = stack.pop() as { node: Node, depth: number }
    if (node === null) continue

    const dist = distanceFn(center, node.point)

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
      const distA = distanceFn(center, a.point)
      const distB = distanceFn(center, b.point)
      return sort.toLowerCase() === 'asc' ? distA - distB : distB - distA
    })
  }

  return result
}

export function searchByPolygon (root: Nullable<Node>, polygon: Point[], inclusive = true, sort: SortGeoPoints = null, highPrecision = false): GeoSearchResult[] {
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

  if (sort) {
    const sortFn = highPrecision ? vincentyDistance : haversineDistance

    result.sort((a, b) => {
      const distA = sortFn(centroid, a.point)
      const distB = sortFn(centroid, b.point)
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

function haversineDistance (coord1: Point, coord2: Point): number {
  const P = Math.PI / 180
  const lat1 = coord1.lat * (P)
  const lat2 = coord2.lat * (P)
  const deltaLat = (coord2.lat - coord1.lat) * (P)
  const deltaLon = (coord2.lon - coord1.lon) * (P)

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS * c
}

function vincentyDistance (coord1: Point, coord2: Point): number {
  // Constants for WGS 84 ellipsoidal Earth model (https://epsg.org/ellipsoid_7030/WGS-84.html)
  
  // Semi-major axis of the Earth in meters
  const a = 6378137

  // Flattening of the ellipsoid
  const f = 1 / 298.257223563

  // Semi-minor axis
  const b = (1 - f) * a

  // Convert degrees to radians for calculations
  const P = Math.PI / 180
  const lat1 = coord1.lat * P
  const lat2 = coord2.lat * P
  const deltaLon = (coord2.lon - coord1.lon) * P

  // Reduced latitudes - account for flattening by transforming from geodetic to auxiliary latitude
  const U1 = Math.atan((1 - f) * Math.tan(lat1))
  const U2 = Math.atan((1 - f) * Math.tan(lat2))

  const sinU1 = Math.sin(U1)
  const cosU1 = Math.cos(U1)
  const sinU2 = Math.sin(U2)
  const cosU2 = Math.cos(U2)

  // Initial approximation for the longitude difference between the two points
  let lambda = deltaLon
  let prevLambda: number

  // Limit the iterations to ensure we don't get stuck in an infinite loop
  let iterationLimit = 1000
  let sinAlpha: number
  let cos2Alpha: number
  let sinSigma: number
  let cosSigma: number
  let sigma: number

  // Refine the value of lambda (longitude difference)
  do {
    const sinLambda = Math.sin(lambda)
    const cosLambda = Math.cos(lambda)

    // Compute the trigonometric values required for Vincenty formulae
    sinSigma = Math.sqrt(
      (cosU2 * sinLambda) * (cosU2 * sinLambda) +
      (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) *
      (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
    )

    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda
    sigma = Math.atan2(sinSigma, cosSigma)

    // Angular separation between the two points and the equator
    sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma
    cos2Alpha = 1 - sinAlpha * sinAlpha

    const cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cos2Alpha

    // Compensation factor for the Earth's shape
    const C = f / 16 * cos2Alpha * (4 + f * (4 - 3 * cos2Alpha))

    // Store previous lambda to check for convergence
    prevLambda = lambda

    // Refine the estimate of lambda using the Vincenty formula
    lambda = deltaLon + (1 - C) * f * sinAlpha *
      (sigma + C * sinSigma *
      (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)))
  } while (Math.abs(lambda - prevLambda) > 1e-12 && --iterationLimit > 0)

  // Compute factors that depend on the shape of the Earth and angular distances
  const u2 = cos2Alpha * (a * a - b * b) / (b * b)
  const A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)))
  const B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)))

  // Compute the correction factor for the ellipsoidal shape of the Earth
  const deltaSigma = B * sinSigma *
    (cosSigma - 2 * sinU1 * sinU2 / cos2Alpha + B / 4 *
    (cosSigma * (-1 + 2 * sinSigma * sinSigma) -
    B / 6 * sigma * (-3 + 4 * sinSigma * sinSigma) *
    (-3 + 4 * sigma * sigma)))

  // Final calculation of distance using Vincenty formula
  const s = b * A * (sigma - deltaSigma)

  return s
}
