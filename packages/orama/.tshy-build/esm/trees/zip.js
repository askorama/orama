function randomRank() {
  const r = Math.random()
  return Math.floor(Math.log(1 - r) / Math.log(1 - 0.5))
}
export function create(key, value) {
  return {
    v: value,
    k: key,
    n: randomRank(),
    l: null,
    r: null,
    p: null
  }
}
export function insert(root, key, value) {
  const newNode = create(key, value)
  if (!root) {
    return
  }
  let currentNode = root
  let parent = null
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
export function remove(root, key) {
  if (root === null) {
    return null
  }
  const [left, mid] = split(root, key)
  const [, right] = split(mid, key + 1)
  const newRoot = merge(left, right)
  return newRoot
}
export function find(root, key) {
  let currentNode = root
  while (currentNode !== null) {
    if (currentNode.k === key) {
      return currentNode.v
    }
    currentNode = currentNode.k < key ? currentNode.r : currentNode.l
  }
  return null
}
export function contains(root, key) {
  return !!find(root, key)
}
export function rangeSearch(root, min, max) {
  const results = []
  const stack = []
  let currentNode = root
  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.l
    }
    currentNode = stack.pop()
    if (currentNode.k >= min && currentNode.k <= max) {
      results.push(currentNode.v)
    }
    currentNode = currentNode.r
  }
  return results
}
export function greaterThan(root, key) {
  const results = []
  const stack = []
  let currentNode = root
  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.l
    }
    currentNode = stack.pop()
    if (currentNode.k > key) {
      results.push(currentNode.v)
    }
    currentNode = currentNode.r
  }
  return results
}
export function lessThan(root, key) {
  const results = []
  const stack = []
  let currentNode = root
  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.l
    }
    currentNode = stack.pop()
    if (currentNode.k < key) {
      results.push(currentNode.v)
    }
    currentNode = currentNode.r
  }
  return results
}
export function getSize(root) {
  const stack = []
  let count = 0
  let currentNode = root
  while (currentNode !== null || stack.length > 0) {
    while (currentNode !== null) {
      stack.push(currentNode)
      currentNode = currentNode.l
    }
    currentNode = stack.pop()
    count++
    currentNode = currentNode.r
  }
  return count
}
function split(root, key) {
  let left = null
  let leftTail = null
  let right = null
  let rightTail = null
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
function merge(left, right) {
  if (left == null) return right
  if (right == null) return left
  let currentNode = left
  while (currentNode.r !== null) {
    currentNode = currentNode.r
  }
  currentNode.r = right
  right.p = currentNode
  return left
}
export function removeDocument(root, id, key) {
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
function getNodeByKey(root, key) {
  let currentNode = root
  while (currentNode !== null) {
    if (currentNode.k === key) {
      return currentNode
    }
    currentNode = currentNode.k < key ? currentNode.r : currentNode.l
  }
  return null
}
//# sourceMappingURL=zip.js.map
