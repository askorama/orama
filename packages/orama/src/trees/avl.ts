import { Nullable } from '../types.js'
import { safeArrayPush } from '../utils.js'

export interface Node<K, V> {
  // Node key
  k: K
  // Node value
  v: V
  // Left child node
  l: Nullable<Node<K, V>>
  // Right child node
  r: Nullable<Node<K, V>>
  // Tree height from this node
  h: number
}

const BALANCE_STATE = {
  UNBALANCED_RIGHT: -2,
  SLIGHTLY_UNBALANCED_RIGHT: -1,
  BALANCED: 0,
  SLIGHTLY_UNBALANCED_LEFT: 1,
  UNBALANCED_LEFT: 2
}

function getHeight<K, V> (node: Nullable<Node<K, V>>): number {
  return (node != null) ? node.h : -1
}

function rotateLeft<K, V> (node: Node<K, V>): Node<K, V> {
  const right = node.r as Node<K, V>
  node.r = right.l
  right.l = node
  node.h = Math.max(getHeight(node.l), getHeight(node.r)) + 1
  right.h = Math.max(getHeight(right.l), getHeight(right.r)) + 1
  return right
}

function rotateRight<K, V> (node: Node<K, V>): Node<K, V> {
  const left = node.l as Node<K, V>
  node.l = left.r
  left.r = node
  node.h = Math.max(getHeight(node.l), getHeight(node.r)) + 1
  left.h = Math.max(getHeight(left.l), getHeight(left.r)) + 1
  return left
}

export function contains<K, V> (node: Node<K, V>, key: K): boolean {
  return !!find(node, key)
}

export function getSize<K, V> (root: Nullable<Node<K, V>>): number {
  let size = 0
  const queue: Array<Node<K, V>> = []

  if (root !== null) {
    queue.push(root)
  }

  while (queue.length > 0) {
    const node = queue.shift() as Node<K, V>
    size++

    if (node.l !== null) {
      queue.push(node.l)
    }

    if (node.r !== null) {
      queue.push(node.r)
    }
  }

  return size
}

export function isBalanced<K, V> (root: Nullable<Node<K, V>>): boolean {
  if (root === null) return true

  const stack: Array<Node<K, V>> = [root]

  while (stack.length > 0) {
    const node = stack.pop()

    if (node === undefined) return true

    const heightDiff = getHeight(node.l) - getHeight(node.r)

    if (heightDiff > 1 || heightDiff < -1) {
      return false
    }

    if (node.r !== null) {
      stack.push(node.r)
    }

    if (node.l !== null) {
      stack.push(node.l)
    }
  }

  return true
}

export function rangeSearch<K, V> (node: Node<K, V>, min: K, max: K): V {
  if (!node) {
    return [] as unknown as V
  }

  const result: V[] = []

  function traverse (node: Node<K, V>) {
    if (!node) {
      return
    }

    if (node.k > min) {
      traverse(node.l as Node<K, V>)
    }

    if (node.k >= min && node.k <= max) {
      safeArrayPush(result, node.v as V[])
    }

    if (node.k < max) {
      traverse(node.r as Node<K, V>)
    }
  }

  traverse(node)

  return result as V
}

export function greaterThan<K, V> (node: Node<K, V>, key: K, inclusive = false): V {
  if (!node) {
    return [] as unknown as V
  }

  const result: V[] = []

  function traverse (node: Node<K, V>) {
    if (!node) {
      return
    }

    if (inclusive && node.k >= key) {
      safeArrayPush(result, node.v as V[])
    }

    if (!inclusive && node.k > key) {
      safeArrayPush(result, node.v as V[])
    }

    traverse(node.l as Node<K, V>)
    traverse(node.r as Node<K, V>)
  }

  traverse(node)

  return result as V
}

export function lessThan<K, V> (node: Node<K, V>, key: K, inclusive = false): V {
  if (!node) {
    return [] as unknown as V
  }

  const result: V[] = []

  function traverse (node: Node<K, V>) {
    if (!node) {
      return
    }

    if (inclusive && node.k <= key) {
      safeArrayPush(result, node.v as V[])
    }

    if (!inclusive && node.k < key) {
      safeArrayPush(result, node.v as V[])
    }

    traverse(node.l as Node<K, V>)
    traverse(node.r as Node<K, V>)
  }

  traverse(node)

  return result as V
}

function getNodeByKey<K, V> (node: Nullable<Node<K, V>>, key: K): Nullable<Node<K, V>> {
  while (node !== null) {
    if (key < node.k) {
      node = node.l
    } else if (key > node.k) {
      node = node.r
    } else {
      return node
    }
  }
  return null
}

export function create<K, V> (key: K, value: V): Node<K, V> {
  return {
    k: key,
    v: value,
    l: null,
    r: null,
    h: 0
  }
}

export function insert<K, V> (root: Node<K, V>, key: K, value: V): Node<K, V> {
  let parent: Nullable<Node<K, V>> = null
  let current: Nullable<Node<K, V>> = root

  while (current !== null) {
    parent = current
    if (key < current.k) {
      current = current.l
    } else if (key > current.k) {
      current = current.r
    } else {
      // assuming value is an array here
      (current.v as string[]) = (current.v as string[]).concat(value as string)
      return root
    }
  }

  const newNode = create(key, value)

  if (parent == null) {
    root = newNode // tree was empty
  } else if (key < parent.k) {
    parent.l = newNode
  } else {
    parent.r = newNode
  }

  current = newNode

  while (parent != null) {
    const balanceFactor = getHeight(parent.l) - getHeight(parent.r)

    if (balanceFactor === BALANCE_STATE.UNBALANCED_LEFT) {
      if (key > (parent.l as Node<K, V>).k) {
        parent.l = rotateLeft(parent.l as Node<K, V>)
      }
      parent = rotateRight(parent)
    }

    if (balanceFactor === BALANCE_STATE.UNBALANCED_RIGHT) {
      if (key < (parent.r as Node<K, V>).k) {
        parent.r = rotateRight(parent.r as Node<K, V>)
      }
      parent = rotateLeft(parent)
    }

    if (parent === root) {
      break
    }

    current = parent
    parent = getNodeParent(root, current.k)
  }

  return root
}

function getNodeParent<K, V> (root: Node<K, V>, key: K): Nullable<Node<K, V>> {
  let current: Nullable<Node<K, V>> = root
  let parent: Nullable<Node<K, V>> = null

  while (current !== null) {
    if (key < current.k) {
      parent = current
      current = current.l
    } else if (key > current.k) {
      parent = current
      current = current.r
    } else {
      break
    }
  }

  return parent
}

export function find<K, V> (root: Node<K, V>, key: K): V | null {
  const node = getNodeByKey(root, key)
  if (node == null) {
    return null
  }
  return node.v
}

export function remove<K, V> (root: Nullable<Node<K, V>>, key: K): Nullable<Node<K, V>> {
  let node = root
  let parentNode: Nullable<Node<K, V>> = null

  while ((node != null) && node.k !== key) {
    parentNode = node
    if (key < node.k) {
      node = node.l as Node<K, V>
    } else {
      node = node.r as Node<K, V>
    }
  }

  if (node == null) {
    return null
  }

  if ((node.l == null) && (node.r == null)) {
    if (parentNode == null) {
      // Node to be deleted is root
      root = null
    } else {
      if (parentNode.l === node) {
        parentNode.l = null
      } else {
        parentNode.r = null
      }
    }
  } else if ((node.l != null) && (node.r != null)) {
    let minValueNode = node.r
    let minValueParent = node

    while (minValueNode.l != null) {
      minValueParent = minValueNode
      minValueNode = minValueNode.l
    }

    node.k = minValueNode.k

    if (minValueParent === node) {
      minValueParent.r = minValueNode.r
    } else {
      minValueParent.l = minValueNode.r
    }
  } else {
    const childNode = (node.l != null) ? node.l : node.r

    if (parentNode == null) {
      root = childNode as Node<K, V>
    } else {
      if (parentNode.l === node) {
        parentNode.l = childNode
      } else {
        parentNode.r = childNode
      }
    }
  }

  return root
}

export function removeDocument<K, V> (root: Node<K, V[]>, id: V, key: K): void {
  const node = getNodeByKey(root, key)!

  if (!node) {
    return
  }

  if (node.v.length === 1) {
    remove(root, key)
    return
  }

  node.v.splice(node.v.indexOf(id), 1)
}
