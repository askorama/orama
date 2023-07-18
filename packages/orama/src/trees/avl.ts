export type Node<K, V> = {
  key: K
  value: V
  left: Node<K, V> | null
  right: Node<K, V> | null
  height: number
}

const BALANCE_STATE = {
  UNBALANCED_RIGHT: -2,
  SLIGHTLY_UNBALANCED_RIGHT: -1,
  BALANCED: 0,
  SLIGHTLY_UNBALANCED_LEFT: 1,
  UNBALANCED_LEFT: 2,
}

function getHeight<K, V>(node: Node<K, V> | null): number {
  return node ? node.height : -1
}

function rotateLeft<K, V>(node: Node<K, V>): Node<K, V> {
  const right = node.right as Node<K, V>
  node.right = right.left
  right.left = node
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1
  right.height = Math.max(getHeight(right.left), getHeight(right.right)) + 1
  return right
}

function rotateRight<K, V>(node: Node<K, V>): Node<K, V> {
  const left = node.left as Node<K, V>
  node.left = left.right
  left.right = node
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1
  left.height = Math.max(getHeight(left.left), getHeight(left.right)) + 1
  return left
}

export function contains<K, V>(node: Node<K, V>, key: K): boolean {
  return !!find(node, key)
}

export function getSize<K, V>(root: Node<K, V> | null): number {
  let size = 0
  const queue: Array<Node<K, V>> = []

  if (root !== null) {
    queue.push(root)
  }

  while (queue.length > 0) {
    const node = queue.shift() as Node<K, V>
    size++

    if (node.left !== null) {
      queue.push(node.left)
    }

    if (node.right !== null) {
      queue.push(node.right)
    }
  }

  return size
}

export function isBalanced<K, V>(root: Node<K, V> | null): boolean {
  if (root === null) return true

  const stack: Node<K, V>[] = [root]

  while (stack.length > 0) {
    const node = stack.pop()

    if (node === undefined) return true

    const heightDiff = getHeight(node.left) - getHeight(node.right)

    if (heightDiff > 1 || heightDiff < -1) {
      return false
    }

    if (node.right !== null) {
      stack.push(node.right)
    }

    if (node.left !== null) {
      stack.push(node.left)
    }
  }

  return true
}

export function rangeSearch<K, V>(node: Node<K, V>, min: K, max: K): V {
  if (!node) {
    return [] as unknown as V
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result: V[] = []

  function traverse(node: Node<K, V>) {
    if (!node) {
      return
    }

    if (node.key > min) {
      traverse(node.left as Node<K, V>)
    }

    if (node.key >= min && node.key <= max) {
      result.push(...(node.value as V[]))
    }

    if (node.key < max) {
      traverse(node.right as Node<K, V>)
    }
  }

  traverse(node)

  return result as V
}

export function greaterThan<K, V>(node: Node<K, V>, key: K, inclusive = false): V {
  if (!node) {
    return [] as unknown as V
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result: V[] = []

  function traverse(node: Node<K, V>) {
    if (!node) {
      return
    }

    if (inclusive && node.key >= key) {
      result.push(...(node.value as V[]))
    }

    if (!inclusive && node.key > key) {
      result.push(...(node.value as V[]))
    }

    traverse(node.left as Node<K, V>)
    traverse(node.right as Node<K, V>)
  }

  traverse(node)

  return result as V
}

export function lessThan<K, V>(node: Node<K, V>, key: K, inclusive = false): V {
  if (!node) {
    return [] as unknown as V
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result: V[] = []

  function traverse(node: Node<K, V>) {
    if (!node) {
      return
    }

    if (inclusive && node.key <= key) {
      result.push(...(node.value as V[]))
    }

    if (!inclusive && node.key < key) {
      result.push(...(node.value as V[]))
    }

    traverse(node.left as Node<K, V>)
    traverse(node.right as Node<K, V>)
  }

  traverse(node)

  return result as V
}

function getNodeByKey<K, V>(node: Node<K, V> | null, key: K): Node<K, V> | null {
  while (node !== null) {
    if (key < node.key) {
      node = node.left
    } else if (key > node.key) {
      node = node.right
    } else {
      return node
    }
  }
  return null
}

export function create<K, V>(key: K, value: V): Node<K, V> {
  return {
    key,
    value,
    left: null,
    right: null,
    height: 0,
  }
}

export function insert<K, V>(root: Node<K, V>, key: K, value: V): Node<K, V> {
  let parent = null
  let current = root

  while (current !== null) {
    parent = current
    if (key < current.key) {
      current = current.left as Node<K, V>
    } else if (key > current.key) {
      current = current.right as Node<K, V>
    } else {
      // assuming value is an array here
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(current.value as string[]) = (current.value as string[]).concat(value as string)
      return root
    }
  }

  const newNode = create(key, value)

  if (!parent) {
    root = newNode // tree was empty
  } else if (key < parent.key) {
    parent.left = newNode
  } else {
    parent.right = newNode
  }

  current = newNode

  while (parent) {
    const balanceFactor = getHeight(parent.left) - getHeight(parent.right)

    if (balanceFactor === BALANCE_STATE.UNBALANCED_LEFT) {
      if (key > (parent.left as Node<K, V>).key) {
        parent.left = rotateLeft(parent.left as Node<K, V>)
      }
      parent = rotateRight(parent)
    }

    if (balanceFactor === BALANCE_STATE.UNBALANCED_RIGHT) {
      if (key < (parent.right as Node<K, V>).key) {
        parent.right = rotateRight(parent.right as Node<K, V>)
      }
      parent = rotateLeft(parent)
    }

    if (parent === root) {
      break
    }

    current = parent
    parent = getNodeParent(root, current.key)
  }

  return root
}

function getNodeParent<K, V>(root: Node<K, V>, key: K): Node<K, V> | null {
  let current = root
  let parent = null

  while (current !== null) {
    if (key < current.key) {
      parent = current
      current = current.left as Node<K, V>
    } else if (key > current.key) {
      parent = current
      current = current.right as Node<K, V>
    } else {
      break
    }
  }

  return parent
}

export function find<K, V>(root: Node<K, V>, key: K): V | null {
  const node = getNodeByKey(root, key)
  if (!node) {
    return null
  }
  return node.value
}

export function remove<K, V>(root: Node<K, V> | null, key: K): Node<K, V> | null {
  let node = root
  let parentNode: Node<K, V> | null = null

  while (node && node.key !== key) {
    parentNode = node
    if (key < node.key) {
      node = node.left as Node<K, V>
    } else {
      node = node.right as Node<K, V>
    }
  }

  if (!node) {
    return null
  }

  if (!node.left && !node.right) {
    if (!parentNode) {
      // Node to be deleted is root
      root = null
    } else {
      if (parentNode.left === node) {
        parentNode.left = null
      } else {
        parentNode.right = null
      }
    }
  } else if (node.left && node.right) {
    let minValueNode = node.right
    let minValueParent = node

    while (minValueNode.left) {
      minValueParent = minValueNode
      minValueNode = minValueNode.left
    }

    node.key = minValueNode.key

    if (minValueParent === node) {
      minValueParent.right = minValueNode.right
    } else {
      minValueParent.left = minValueNode.right
    }
  } else {
    const childNode = node.left ? node.left : node.right

    if (!parentNode) {
      root = childNode as Node<K, V>
    } else {
      if (parentNode.left === node) {
        parentNode.left = childNode
      } else {
        parentNode.right = childNode
      }
    }
  }

  return root
}

export function removeDocument<K, V>(root: Node<K, V[]>, id: V, key: K): void {
  const node = getNodeByKey(root, key)!

  if (node.value.length === 1) {
    remove(root, key)
    return
  }

  node.value.splice(node.value.indexOf(id), 1)
}
