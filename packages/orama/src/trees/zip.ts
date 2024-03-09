import { Nullable } from '../types.ts'

interface Node<V = unknown> {
  // Left child
  l: Nullable<Node<V>>
  // Right child
  r: Nullable<Node<V>>
  // Parent node
  p: Nullable<Node<V>>
  // Node key
  k: number
  // Node value
  v: V
  // Node rank
  n: number
}

function randomRank(): number {
  const r = Math.random()
  return Math.floor(Math.log(1 - r) / Math.log(1 - 0.5))
}

export function create<V>(key: number, value: V): Node<V> {
  return {
    v: value,
    k: key,
    n: randomRank(),
    l: null,
    r: null,
    p: null
  }
}

export function insert<V>(root: Node<V>, key: number, value: V): void {
  const newNode = create(key, value)
  if (!root) {
    return
  }

  let currentNode: Nullable<Node<V>> = root
  let parent: Nullable<Node<V>> = null

  while (currentNode != null) {
    parent = currentNode
    if (key < currentNode.k) {
      currentNode = currentNode.l
    } else if (key > currentNode.k) {
      currentNode = currentNode.r
    } else {
      currentNode.v = value
      return
    }
  }

  if (parent != null && key < parent.k) {
    parent.l = newNode
  } else {
    if (parent != null) {
      parent.r = newNode
    }
  }
  newNode.p = parent
}

export function remove<V>(root: Nullable<Node<V>>, key: number): Nullable<Node<V>> {
  if (root === null) {
    return null
  }

  const [left, mid] = split(root, key)
  const [, right] = split(mid, key + 1)
  const newRoot = merge(left, right)

  return newRoot
}

export function find<V>(root: Nullable<Node<V>>, key: number): Nullable<V> {
  let currentNode: Nullable<Node<V>> = root

  while (currentNode !== null) {
    if (currentNode.k === key) {
      return currentNode.v
    }
    currentNode = currentNode.k < key ? currentNode.r : currentNode.l
  }

  return null
}

export function contains<V>(root: Nullable<Node<V>>, key: number): boolean {
  return !!find(root, key)
}

export function rangeSearch<V>(root: Nullable<Node<V>>, min: number, max: number): V[] {
  const results: V[] = []
  const stack: Array<Nullable<Node<V>>> = []
  let currentNode = root

  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.l
    }

    currentNode = stack.pop()!
    if (currentNode.k >= min && currentNode.k <= max) {
      results.push(currentNode.v)
    }

    currentNode = currentNode.r
  }

  return results
}

export function greaterThan<V>(root: Nullable<Node<V>>, key: number): V[] {
  const results: V[] = []
  const stack: Array<Nullable<Node<V>>> = []
  let currentNode = root

  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.l
    }

    currentNode = stack.pop()!
    if (currentNode.k > key) {
      results.push(currentNode.v)
    }

    currentNode = currentNode.r
  }

  return results
}

export function lessThan<V>(root: Nullable<Node<V>>, key: number): V[] {
  const results: V[] = []
  const stack: Array<Nullable<Node<V>>> = []
  let currentNode = root

  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.l
    }

    currentNode = stack.pop()!
    if (currentNode.k < key) {
      results.push(currentNode.v)
    }

    currentNode = currentNode.r
  }

  return results
}

export function getSize<V>(root: Nullable<Node<V>>): number {
  const stack: Array<Nullable<Node<V>>> = []
  let count = 0
  let currentNode = root

  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.l
    }

    currentNode = stack.pop()!
    count++
    currentNode = currentNode.r
  }

  return count
}

function split<V>(root: Nullable<Node<V>>, key: number): [Nullable<Node<V>>, Nullable<Node<V>>] {
  let left: Nullable<Node<V>> = null
  let leftTail: Nullable<Node<V>> = null
  let right: Nullable<Node<V>> = null
  let rightTail: Nullable<Node<V>> = null
  let currentNode = root

  while (currentNode !== null) {
    if (currentNode.k < key) {
      if (leftTail != null) {
        leftTail.r = currentNode
        currentNode.p = leftTail
      } else {
        left = currentNode
      }
      leftTail = currentNode
      currentNode = currentNode.r
      leftTail.r = null
    } else {
      if (rightTail != null) {
        rightTail.l = currentNode
        currentNode.p = rightTail
      } else {
        right = currentNode
      }
      rightTail = currentNode
      currentNode = currentNode.l
      rightTail.l = null
    }
  }
  return [left, right]
}

function merge<V>(left: Nullable<Node<V>>, right: Nullable<Node<V>>): Nullable<Node<V>> {
  if (left == null) return right
  if (right == null) return left

  let currentNode: Nullable<Node<V>> = left
  while (currentNode.r !== null) {
    currentNode = currentNode.r
  }

  currentNode.r = right
  right.p = currentNode

  return left
}

export function removeDocument<V>(root: Node<V[]>, id: V, key: number): void {
  const node = getNodeByKey(root, key)

  if (node == null) return

  if (node.v.length === 1 && node.v[0] === id) {
    remove(root, key)
  } else {
    const index = node.v.indexOf(id)
    if (index !== -1) {
      node.v.splice(index, 1)
    }
  }
}

function getNodeByKey<V>(root: Nullable<Node<V>>, key: number): Nullable<Node<V>> {
  let currentNode: Nullable<Node<V>> = root

  while (currentNode !== null) {
    if (currentNode.k === key) {
      return currentNode
    }
    currentNode = currentNode.k < key ? currentNode.r : currentNode.l
  }

  return null
}
