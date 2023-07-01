import { Nullable } from '../types.js'

type Node<V> = {
  left: Nullable<Node<V>>
  right: Nullable<Node<V>>
  key: number
  value: V
  rank: number
}

export function create<V>(key: number, value: V): Node<V> {
  return {
    value,
    key,
    rank: Math.random(),
    left: null,
    right: null
  }
}

export function insert<V>(root: Nullable<Node<V>>, key: number, value: V): Nullable<Node<V>> {
  const newNode = create(key, value)

  if (root === null) {
    return newNode
  }

  const [left, right] = split(root, key)

  return merge(merge(left, newNode), right)
}

export function remove<V>(root: Nullable<Node<V>>, key: number): Nullable<Node<V>> {
  if (root === null) {
    return null
  }

  const [left, right] = split(root, key)
  const [, value] = split(right, key + 1)

  return merge(left, value)
}

export function find<V>(root: Nullable<Node<V>>, key: number): Nullable<Node<V>> {
  let currentNode: Nullable<Node<V>> = root
  while (currentNode !== null) {
    if (currentNode.value === key) {
      return currentNode
    }
    currentNode = (currentNode.key < key) ? currentNode.right : currentNode.left
  }
  return null
}

export function contains<V>(root: Nullable<Node<V>>, key: number): boolean {
  return !!find(root, key)
}

export function rangeSearch<V>(root: Nullable<Node<V>>, min: number, max: number): Node<V>[] {
  const results: Node<V>[] = []
  const stack: Nullable<Node<V>>[] = []
  let currentNode = root;

  while (currentNode !== null || stack.length > 0) {

    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.left
    }

    currentNode = stack.pop()!
    if (currentNode.key >= min && currentNode.key <= max) {

      results.push(currentNode)
    }

    currentNode = currentNode.right
  }

  return results
}

export function greaterThan<V>(root: Nullable<Node<V>>, key: number): Node<V>[] {
  const results: Node<V>[] = []
  const stack: Nullable<Node<V>>[] = []
  let currentNode = root

  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.left
    }

    currentNode = stack.pop()!
    if (currentNode.key > key) {
      results.push(currentNode)
    }

    currentNode = currentNode.right
  }

  return results
}

export function lessThan<V>(root: Nullable<Node<V>>, key: number): Node<V>[] {
  const results: Node<V>[] = []
  const stack: Nullable<Node<V>>[] = []
  let currentNode = root

  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.left
    }

    currentNode = stack.pop()!
    if (currentNode.key < key) {
      results.push(currentNode)
    }

    currentNode = currentNode.right
  }

  return results
}

export function getSize<V>(root: Nullable<Node<V>>): number {
  const stack: Nullable<Node<V>>[] = []
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


function split<V>(root: Nullable<Node<V>>, key: number): [Nullable<Node<V>>, Nullable<Node<V>>] {
  let left: Nullable<Node<V>> = null
  let right: Nullable<Node<V>> = null

  let currentNode: Nullable<Node<V>> = root
  while (currentNode !== null) {
    if (currentNode.key < key) {
      if (currentNode.right === null) {
        right = null
        left = currentNode
        break
      } else if (currentNode.right.rank < currentNode.rank) {
        const tmp = currentNode.right
        currentNode.right = tmp.left
        tmp.left = currentNode
        currentNode = tmp
      } else {
        left = currentNode
        currentNode = currentNode.right
      }
    } else {
      if (currentNode.left === null) {
        left = null
        right = currentNode
        break;
      } else if (currentNode.left.rank < currentNode.rank) {
        const tmp = currentNode.left
        currentNode.left = tmp.right
        tmp.right = currentNode
        currentNode = tmp
      } else {
        right = currentNode
        currentNode = currentNode.left
      }
    }
  }

  return [left, right]
}

function merge<V>(left: Nullable<Node<V>>, right: Nullable<Node<V>>): Nullable<Node<V>> {
  let root: Nullable<Node<V>> = null
  let currentNode: Nullable<Node<V>> = null

  while (left !== null && right !== null) {
    if (left.rank < right.rank) {
      if (root === null) {
        root = left
      } else {
        currentNode!.left = left
      }
      currentNode = left
      left = left.right
      currentNode.right = null
    } else {
      if (root === null) {
        root = right
      } else {
        currentNode!.right = right
      }
      currentNode = right
      right = right.left
      currentNode.left = null
    }
  }

  if (left !== null) {
    if (root === null) {
      root = left
    } else {
      currentNode!.right = left
    }
  }

  if (right !== null) {
    if (root === null) {
      root = right
    } else {
      currentNode!.left = right
    }
  }

  return root
}