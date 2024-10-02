import { intersect, safeArrayPush } from '../utils.js'
export function create() {
  return {
    numberToDocumentId: new Map()
  }
}
export function insert(root, key, value) {
  if (root.numberToDocumentId.has(key)) {
    root.numberToDocumentId.get(key).push(value)
    return root
  }
  root.numberToDocumentId.set(key, [value])
  return root
}
export function find(root, key) {
  return root.numberToDocumentId.get(key) ?? null
}
export function remove(root, key) {
  if (root != null) {
    root.numberToDocumentId.delete(key)
  }
  return root
}
export function removeDocument(root, id, key) {
  root?.numberToDocumentId.set(key, root?.numberToDocumentId.get(key)?.filter((v) => v !== id) ?? [])
  if (root?.numberToDocumentId.get(key)?.length === 0) {
    root?.numberToDocumentId.delete(key)
  }
}
export function contains(node, key) {
  return !(find(node, key) == null)
}
export function getSize(root) {
  let size = 0
  for (const [, value] of root?.numberToDocumentId ?? []) {
    size += value.length
  }
  return size
}
export function filter(root, operation) {
  const operationKeys = Object.keys(operation)
  if (operationKeys.length !== 1) {
    throw new Error('Invalid operation')
  }
  const operationType = operationKeys[0]
  switch (operationType) {
    case 'eq': {
      const value = operation[operationType]
      return root.numberToDocumentId.get(value) ?? []
    }
    case 'in': {
      const value = operation[operationType]
      const result = []
      for (const v of value) {
        const ids = root.numberToDocumentId.get(v)
        if (ids != null) {
          safeArrayPush(result, ids)
        }
      }
      return result
    }
    case 'nin': {
      const value = operation[operationType]
      const result = []
      const keys = root.numberToDocumentId.keys()
      for (const key of keys) {
        if (value.includes(key)) {
          continue
        }
        const ids = root.numberToDocumentId.get(key)
        if (ids != null) {
          safeArrayPush(result, ids)
        }
      }
      return result
    }
  }
  throw new Error('Invalid operation')
}
export function filterArr(root, operation) {
  const operationKeys = Object.keys(operation)
  if (operationKeys.length !== 1) {
    throw new Error('Invalid operation')
  }
  const operationType = operationKeys[0]
  switch (operationType) {
    case 'containsAll': {
      const values = operation[operationType]
      const ids = values.map((value) => root.numberToDocumentId.get(value) ?? [])
      return intersect(ids)
    }
  }
  throw new Error('Invalid operation')
}
//# sourceMappingURL=flat.js.map
