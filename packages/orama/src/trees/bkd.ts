import type { Nullable } from '../types.js'

export interface Point {
  lon: number
  lat: number
}

export interface Node {
  point: Point
  left?: Node
  right?: Node
  parent?: Node
}

export type SortGeoPoints = Nullable<'asc' | 'desc' | 'ASC' | 'DESC'>

interface SearchTask {
  node: Nullable<Node>
  depth: number
}

const K = 2 // 2D points
const EARTH_RADIUS = 6371000 // meters

export function create (): { root: Nullable<Node> } {
  return { root: null }
}

export function insert (tree: { root: Nullable<Node> }, point: Point): void {
  const newNode: Node = { point }

  if (tree.root == null) {
    tree.root = newNode
    return
  }

  let node: Nullable<Node> = tree.root
  let depth = 0

  while (node !== null) {
    const axis = depth % K

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

export function searchByRadius (
  root: Nullable<Node>,
  center: Point,
  radius: number,
  inclusive = true,
  sort: SortGeoPoints
): Point[] {
  const stack: SearchTask[] = [{ node: root, depth: 0 }]
  const result: Point[] = []

  while (stack.length > 0) {
    const task = stack.pop()
    if (task == null || task.node == null) continue

    const { node, depth } = task
    const axis = depth % K
    const diff = axis === 0 ? center.lon - node.point.lon : center.lat - node.point.lat
    const nextDepth = depth + 1

    let left = diff <= 0
    let right = diff >= 0

    const diffInMeters = haversineDistance(center, node.point)

    if (Math.abs(diffInMeters) <= radius) {
      left = true
      right = true
    }

    if (left && node.left != null) {
      stack.push({ node: node.left, depth: nextDepth })
    }

    if (right && node.right != null) {
      stack.push({ node: node.right, depth: nextDepth })
    }

    const dist = haversineDistance(center, node.point)
    if (inclusive ? dist <= radius : dist > radius) {
      result.push(node.point)
    }
  }

  if (sort !== null) {
    return result.sort((a, b) => {
      if (sort.toLowerCase() === 'asc') {
        return haversineDistance(center, a) - haversineDistance(center, b)
      } else {
        return haversineDistance(center, b) - haversineDistance(center, a)
      }
    })
  }

  return result
}

export function searchInsidePolygon (root: Nullable<Node>, polygon: Point[], inclusive = true): Point[] {
  const stack: SearchTask[] = [{ node: root, depth: 0 }]
  const result: Point[] = []

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
      result.push(node.point)
    } else if (!isInsidePolygon && !inclusive) {
      result.push(node.point)
    }
  }

  return result
}

function isPointInPolygon (polygon: Point[], point: Point): boolean {
  let isInside = false
  const polygonLength = polygon.length

  for (let i = 0, j = polygonLength - 1; i < polygonLength; j = i++) {
    const xi = polygon[i].lon; const yi = polygon[i].lat
    const xj = polygon[j].lon; const yj = polygon[j].lat

    const intersect = ((yi > point.lat) !== (yj > point.lat)) && (point.lon < (xj - xi) * (point.lat - yi) / (yj - yi) + xi)
    if (intersect) isInside = !isInside
  }

  return isInside
}

function haversineDistance (coord1: Point, coord2: Point): number {
  const lat1Rad = toRadians(coord1.lat)
  const lat2Rad = toRadians(coord2.lat)
  const deltaLat = toRadians(coord2.lat - coord1.lat)
  const deltaLon = toRadians(coord2.lon - coord1.lon)

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS * c
}

function toRadians (degrees: number): number {
  return degrees * Math.PI / 180
}
