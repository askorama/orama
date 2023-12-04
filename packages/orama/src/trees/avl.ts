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

export interface RootNode<K, V> {
  root: Node<K, V>
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

export function contains<K, V> (node: RootNode<K, V>, key: K): boolean {
  return !!find(node, key)
}

export function getSize<K, V> (root: Nullable<RootNode<K, V>>): number {
  let size = 0
  const queue: Array<Node<K, V>> = []

  if (root !== null) {
    queue.push(root.root)
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

export function isBalanced<K, V> (root: Nullable<RootNode<K, V>>): boolean {
  if (root === null) return true

  const stack: Array<Node<K, V>> = [root.root]

  while (stack.length > 0) {
    const node = stack.pop()

    if (node != null) {
      const leftHeight = getHeight(node.l)
      const rightHeight = getHeight(node.r)
      const heightDiff = leftHeight - rightHeight

      if (Math.abs(heightDiff) > 1) {
        return false
      }

      if (node.l !== null) {
        stack.push(node.l)
      }
      if (node.r !== null) {
        stack.push(node.r)
      }
    }
  }

  return true
}

export function rangeSearch<K, V> (node: RootNode<K, V>, min: K, max: K): V {
  const result: V[] = []

  function traverse (node: Node<K, V>) {
    if (node === null) {
      return
    }
  
    if (min < node.k) {
      traverse(node.l as Node<K, V>)
    }
  
    if (node.k >= min && node.k <= max) {
      safeArrayPush(result, node.v as V[])
    }
  
    if (max > node.k) {
      traverse(node.r as Node<K, V>)
    }
  }

  traverse(node.root)

  return result as V
}

export function greaterThan<K, V> (node: RootNode<K, V>, key: K, inclusive = false): V {
  const result: V[] = []

  function traverse (node: Node<K, V>) {
    if (node === null) {
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

  traverse(node.root)

  return result as V
}

export function lessThan<K, V> (node: RootNode<K, V>, key: K, inclusive = false): V {
  const result: V[] = []

  function traverse (node: Node<K, V>) {
    if (node === null) {
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

  traverse(node.root)

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

export function create<K, V> (key: K, value: V): RootNode<K, V> {
  return {
    root: {
      k: key,
      v: value,
      l: null,
      r: null,
      h: 0
    }
  }
}

export function insert<K, V> (rootNode: RootNode<K, V[]>, key: K, newValue: V[]): void {
  function insertNode (node: Nullable<Node<K, V[]>>, key: K, newValue: V[]): Node<K, V[]> {
    if (node === null) {
      return {
        k: key,
        v: newValue,
        l: null,
        r: null,
        h: 0
      }
    }

    if (key < node.k) {
      node.l = insertNode(node.l, key, newValue)
    } else if (key > node.k) {
      node.r = insertNode(node.r, key, newValue)
    } else {
      node.v = Array.from(new Set([...node.v, ...newValue]))
      return node
    }

    node.h = 1 + Math.max(getHeight(node.l), getHeight(node.r))

    const balanceFactor = getHeight(node.l) - getHeight(node.r)

    if (balanceFactor > 1 && key < node.l!.k) {
      return rotateRight(node)
    }

    if (balanceFactor < -1 && key > node.r!.k) {
      return rotateLeft(node)
    }

    if (balanceFactor > 1 && key > node.l!.k) {
      node.l = rotateLeft(node.l!)
      return rotateRight(node)
    }

    if (balanceFactor < -1 && key < node.r!.k) {
      node.r = rotateRight(node.r!)
      return rotateLeft(node)
    }

    return node
  }

  rootNode.root = insertNode(rootNode.root, key, newValue)
}

function getHeight<K, V> (node: Nullable<Node<K, V>>): number {
  return (node !== null) ? node.h : -1
}

export function find<K, V> (root: RootNode<K, V>, key: K): Nullable<V> {
  const node = getNodeByKey(root.root, key)
  if (node === null) {
    return null
  }
  return node.v
}

export function remove<K, V> (rootNode: Nullable<RootNode<K, V>>, key: K): void {
  if (rootNode === null || rootNode.root === null) {
    return
  }

  let node = rootNode.root
  let parentNode: Nullable<Node<K, V>> = null

  while (node != null && node.k !== key) {
    parentNode = node
    if (key < node.k) {
      node = node.l!
    } else {
      node = node.r!
    }
  }

  if (node === null) {
    return
  }

  const deleteNode = () => {
    if (node.l === null && node.r === null) {
      if (parentNode === null) {
        rootNode.root = null!
      } else {
        if (parentNode.l === node) {
          parentNode.l = null
        } else {
          parentNode.r = null
        }
      }
    } else if (node.l != null && node.r != null) {
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
      const childNode = node.l != null ? node.l : node.r

      if (parentNode === null) {
        rootNode.root = childNode!
      } else {
        if (parentNode.l === node) {
          parentNode.l = childNode
        } else {
          parentNode.r = childNode
        }
      }
    }
  }

  deleteNode()
}

export function removeDocument<K, V> (root: RootNode<K, V[]>, id: V, key: K): void {
  const node = getNodeByKey(root.root, key)!

  if (!node) {
    return
  }

  if (node.v.length === 1) {
    remove(root, key)
    return
  }

  node.v.splice(node.v.indexOf(id), 1)
}
