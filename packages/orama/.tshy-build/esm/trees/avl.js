import { safeArrayPush } from '../utils.js'
function rotateLeft(node) {
  const right = node.r
  node.r = right.l
  right.l = node
  node.h = Math.max(getHeight(node.l), getHeight(node.r)) + 1
  right.h = Math.max(getHeight(right.l), getHeight(right.r)) + 1
  return right
}
function rotateRight(node) {
  const left = node.l
  node.l = left.r
  left.r = node
  node.h = Math.max(getHeight(node.l), getHeight(node.r)) + 1
  left.h = Math.max(getHeight(left.l), getHeight(left.r)) + 1
  return left
}
export function contains(node, key) {
  return !!find(node, key)
}
export function getSize(root) {
  let size = 0
  const queue = []
  if (root !== null) {
    queue.push(root.root)
  }
  while (queue.length > 0) {
    const node = queue.shift()
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
export function isBalanced(root) {
  if (root === null) return true
  const stack = [root.root]
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
export function rangeSearch(node, min, max) {
  const result = []
  function traverse(node) {
    if (node === null) {
      return
    }
    if (min < node.k) {
      traverse(node.l)
    }
    if (node.k >= min && node.k <= max) {
      safeArrayPush(result, node.v)
    }
    if (max > node.k) {
      traverse(node.r)
    }
  }
  traverse(node.root)
  return result
}
export function greaterThan(node, key, inclusive = false) {
  const result = []
  if (node === null) return result
  const stack = [node.root]
  while (stack.length > 0) {
    const node = stack.pop()
    if (!node) {
      continue
    }
    if (inclusive && node.k >= key) {
      safeArrayPush(result, node.v)
    }
    if (!inclusive && node.k > key) {
      safeArrayPush(result, node.v)
    }
    stack.push(node.r)
    stack.push(node.l)
  }
  return result
}
export function lessThan(node, key, inclusive = false) {
  const result = []
  if (node === null) return result
  const stack = [node.root]
  while (stack.length > 0) {
    const node = stack.pop()
    if (!node) {
      continue
    }
    if (inclusive && node.k <= key) {
      safeArrayPush(result, node.v)
    }
    if (!inclusive && node.k < key) {
      safeArrayPush(result, node.v)
    }
    stack.push(node.r)
    stack.push(node.l)
  }
  return result
}
function getNodeByKey(node, key) {
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
export function create(key, value) {
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
let insertCount = 0
export function insert(rootNode, key, newValue, rebalanceThreshold = 500) {
  function insertNode(node, key, newValue) {
    if (node === null) {
      insertCount++
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
      node.v.push(...newValue)
      return node
    }
    // Rebalance the tree if the insert count reaches the threshold.
    // This will improve insertion performance since we won't be rebalancing the tree on every insert.
    // When inserting docs using `insertMultiple`, the threshold will be set to the number of docs being inserted.
    // We can force rebalancing the tree by setting the threshold to 1 (default).
    if (insertCount % rebalanceThreshold === 0) {
      return rebalanceNode(node, key)
    }
    return node
  }
  rootNode.root = insertNode(rootNode.root, key, newValue)
}
function rebalanceNode(node, key) {
  node.h = 1 + Math.max(getHeight(node.l), getHeight(node.r))
  const balanceFactor = getHeight(node.l) - getHeight(node.r)
  if (balanceFactor > 1 && key < node.l.k) {
    return rotateRight(node)
  }
  if (balanceFactor < -1 && key > node.r.k) {
    return rotateLeft(node)
  }
  if (balanceFactor > 1 && key > node.l.k) {
    node.l = rotateLeft(node.l)
    return rotateRight(node)
  }
  if (balanceFactor < -1 && key < node.r.k) {
    node.r = rotateRight(node.r)
    return rotateLeft(node)
  }
  return node
}
function getHeight(node) {
  return node !== null ? node.h : -1
}
export function find(root, key) {
  const node = getNodeByKey(root.root, key)
  if (node === null) {
    return null
  }
  return node.v
}
export function remove(rootNode, key) {
  if (rootNode === null || rootNode.root === null) {
    return
  }
  let node = rootNode.root
  let parentNode = null
  while (node != null && node.k !== key) {
    parentNode = node
    if (key < node.k) {
      node = node.l
    } else {
      node = node.r
    }
  }
  if (node === null) {
    return
  }
  const deleteNode = () => {
    if (node.l === null && node.r === null) {
      if (parentNode === null) {
        rootNode.root = null
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
        rootNode.root = childNode
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
export function removeDocument(root, id, key) {
  const node = getNodeByKey(root.root, key)
  if (!node) {
    return
  }
  if (node.v.length === 1) {
    remove(root, key)
    return
  }
  node.v.splice(node.v.indexOf(id), 1)
}
//# sourceMappingURL=avl.js.map
