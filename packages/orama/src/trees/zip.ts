import { Nullable } from '../types.js'

interface Node<V = unknown> {
  left: Nullable<Node<V>>
  right: Nullable<Node<V>>
  parent: Nullable<Node<V>>
  key: number
  value: V
  rank: number
}

function randomRank (maxAttempts: number = 32): number {
  let heads = 0

  for (let i = 0; i < maxAttempts; i++) {
    if (Math.random() >= 0.5) break
    heads += 1
  }

  return heads
}

export function create<V> (key: number, value: V): Node<V> {
  return {
    value,
    key,
    rank: randomRank(),
    left: null,
    right: null,
    parent: null
  }
}

export function insert<V> (root: Node<V>, key: number, value: V): void {
  const newNode = create(key, value)
  if (!root) {
    return
  }

  let currentNode: Nullable<Node<V>> = root
  let parent: Nullable<Node<V>> = null

  while (currentNode != null) {
    parent = currentNode
    if (key < currentNode.key) {
      currentNode = currentNode.left
    } else if (key > currentNode.key) {
      currentNode = currentNode.right
    } else {
      currentNode.value = value
      return
    }
  }

  if ((parent != null) && key < parent.key) {
    parent.left = newNode
  } else {
    if (parent != null) {
      parent.right = newNode
    }
  }
  newNode.parent = parent
}

export function remove<V> (root: Nullable<Node<V>>, key: number): Nullable<Node<V>> {
  if (root === null) {
    return null
  }

  const [left, mid] = split(root, key)
  const [toDelete, right] = split(mid, key + 1)
  const newRoot = merge(left, right)

  return newRoot
}

export function find<V> (root: Nullable<Node<V>>, key: number): Nullable<V> {
  let currentNode: Nullable<Node<V>> = root

  while (currentNode !== null) {
    if (currentNode.key === key) {
      return currentNode.value
    }
    currentNode = (currentNode.key < key) ? currentNode.right : currentNode.left
  }

  return null
}

export function contains<V> (root: Nullable<Node<V>>, key: number): boolean {
  return !!find(root, key)
}

export function rangeSearch<V> (root: Nullable<Node<V>>, min: number, max: number): V[] {
  const results: V[] = []
  const stack: Array<Nullable<Node<V>>> = []
  let currentNode = root

  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.left
    }

    currentNode = stack.pop()!
    if (currentNode.key >= min && currentNode.key <= max) {
      results.push(currentNode.value)
    }

    currentNode = currentNode.right
  }

  return results
}

export function greaterThan<V> (root: Nullable<Node<V>>, key: number): V[] {
  const results: V[] = []
  const stack: Array<Nullable<Node<V>>> = []
  let currentNode = root

  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.left
    }

    currentNode = stack.pop()!
    if (currentNode.key > key) {
      results.push(currentNode.value)
    }

    currentNode = currentNode.right
  }

  return results
}

export function lessThan<V> (root: Nullable<Node<V>>, key: number): V[] {
  const results: V[] = []
  const stack: Array<Nullable<Node<V>>> = []
  let currentNode = root

  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.left
    }

    currentNode = stack.pop()!
    if (currentNode.key < key) {
      results.push(currentNode.value)
    }

    currentNode = currentNode.right
  }

  return results
}

export function getSize<V> (root: Nullable<Node<V>>): number {
  const stack: Array<Nullable<Node<V>>> = []
  let count = 0
  let currentNode = root

  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.left
    }

    currentNode = stack.pop()!
    count++
    currentNode = currentNode.right
  }

  return count
}

function split<V> (root: Nullable<Node<V>>, key: number): [Nullable<Node<V>>, Nullable<Node<V>>] {
  let left: Nullable<Node<V>> = null
  let leftTail: Nullable<Node<V>> = null
  let right: Nullable<Node<V>> = null
  let rightTail: Nullable<Node<V>> = null
  let currentNode = root

  while (currentNode !== null) {
    if (currentNode.key < key) {
      if (leftTail != null) {
        leftTail.right = currentNode
        currentNode.parent = leftTail
      } else {
        left = currentNode
      }
      leftTail = currentNode
      currentNode = currentNode.right
      leftTail.right = null
    } else {
      if (rightTail != null) {
        rightTail.left = currentNode
        currentNode.parent = rightTail
      } else {
        right = currentNode
      }
      rightTail = currentNode
      currentNode = currentNode.left
      rightTail.left = null
    }
  }
  return [left, right]
}

function merge<V> (left: Nullable<Node<V>>, right: Nullable<Node<V>>): Nullable<Node<V>> {
  if (left == null) return right
  if (right == null) return left

  let currentNode: Nullable<Node<V>> = left
  while (currentNode.right !== null) {
    currentNode = currentNode.right
  }

  currentNode.right = right
  right.parent = currentNode

  return left
}
