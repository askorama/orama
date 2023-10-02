export interface Point {
  x: number
  y: number
}

export interface Node {
  point: Point
  left?: Node
  right?: Node
}

type MaybeNode = Node | undefined

interface InsertTask {
  points: Point[]
  depth: number
  parent?: Node
  direction?: 'left' | 'right'
}

interface SearchTask {
  node: MaybeNode
  depth: number
}

const K = 2 // 2D points
const EARTH_RADIUS = 6371000 // meters

export function create (points: Point[]): MaybeNode {
  if (points.length === 0) {
    return undefined
  }

  const stack: InsertTask[] = [{
    points,
    depth: 0
  }]

  let root: MaybeNode

  while (stack.length > 0) {
    const task = stack.pop()
    if (task == null) {
      continue
    }

    const { points, depth, parent, direction } = task

    const axis = depth % K
    points.sort((a, b) => (axis === 0 ? a.x - b.x : a.y - b.y))
    const median = Math.floor(points.length / 2)
    const node: Node = { point: points[median] }

    if ((parent != null) && direction) {
      parent[direction] = node
    } else {
      root = node
    }

    if (points.slice(0, median).length > 0) {
      stack.push({
        points: points.slice(0, median),
        depth: depth + 1,
        parent: node,
        direction: 'left'
      })
    }

    if (points.slice(median + 1).length > 0) {
      stack.push({
        points: points.slice(median + 1),
        depth: depth + 1,
        parent: node,
        direction: 'right'
      })
    }
  }

  return root
}

export function insert (root: MaybeNode, point: Point): Node {
  const newNode: Node = { point }
  if (root == null) {
    return newNode
  }

  let node: MaybeNode = root
  let depth = 0
  let parent: Node

  while (node) {
    parent = node
    const axis = depth % K

    let nextNode: MaybeNode

    if (axis === 0) {
      if (point.x < node.point.x) {
        nextNode = node.left
      } else {
        nextNode = node.right
      }
    } else {
      if (point.y < node.point.y) {
        nextNode = node.left
      } else {
        nextNode = node.right
      }
    }

    if (nextNode == null) break

    node = nextNode
    depth++
  }

  const axis = depth % K
  if (axis === 0) {
    if (point.x < parent!.point.x) {
      parent!.left = newNode
    } else {
      parent!.right = newNode
    }
  } else {
    if (point.y < parent!.point.y) {
      parent!.left = newNode
    } else {
      parent!.right = newNode
    }
  }

  return root
}

export function searchByRadius (
  root: MaybeNode,
  center: Point,
  radius: number,
  inclusive = true
): Point[] {
  const stack: SearchTask[] = [{ node: root, depth: 0 }]
  const result: Point[] = []

  while (stack.length > 0) {
    const task = stack.pop()
    if (task == null || task.node == null) continue

    const { node, depth } = task
    const axis = depth % K
    const diff = axis === 0 ? center.x - node.point.x : center.y - node.point.y
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

  return result
}

export function searchOutsideRadius (root: MaybeNode, center: Point, radius: number): Point[] {
  const stack: SearchTask[] = [{ node: root, depth: 0 }]
  const result: Point[] = []

  while (stack.length > 0) {
    const task = stack.pop()
    if ((task == null) || (task.node == null)) continue

    const { node, depth } = task
    const axis = depth % K
    const diff = axis === 0 ? center.x - node.point.x : center.y - node.point.y
    const nextDepth = depth + 1

    if (diff > radius && (node.left != null)) {
      stack.push({ node: node.left, depth: nextDepth })
    }

    if (diff < -radius && (node.right != null)) {
      stack.push({ node: node.right, depth: nextDepth })
    }

    if (distance(center, node.point) > radius) {
      result.push(node.point)
    }
  }

  return result
}

export function searchInsidePolygon (root: MaybeNode, polygon: Point[], inclusive = true): Point[] {
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
    const xi = polygon[i].x; const yi = polygon[i].y
    const xj = polygon[j].x; const yj = polygon[j].y

    const intersect = ((yi > point.y) !== (yj > point.y)) && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)
    if (intersect) isInside = !isInside
  }

  return isInside
}

function distance (a: Point, b: Point): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

function haversineDistance (coord1: Point, coord2: Point): number {
  const R = EARTH_RADIUS
  const lat1Rad = toRadians(coord1.y)
  const lat2Rad = toRadians(coord2.y)
  const deltaLat = toRadians(coord2.y - coord1.y)
  const deltaLon = toRadians(coord2.x - coord1.x)

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function toRadians (degrees: number): number {
  return degrees * Math.PI / 180
}
