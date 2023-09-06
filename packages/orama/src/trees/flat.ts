import { InternalDocumentID } from "../components/internal-document-id-store.js"
import { EnumComparisonOperator, Nullable, ScalarSearchableValue } from "../types.js"

export interface FlatTree {
  numberToDocumentId: Map<ScalarSearchableValue, InternalDocumentID[]>
}

export function create(): FlatTree {
  return {
    numberToDocumentId: new Map()
  }
}

export function insert(root: FlatTree, key: ScalarSearchableValue, value: InternalDocumentID): FlatTree {
  if (root.numberToDocumentId.has(key)) {
    root.numberToDocumentId.get(key)!.push(value)
    return root
  }
  root.numberToDocumentId.set(key, [value])
  return root
}

export function find(root: FlatTree, key: ScalarSearchableValue): Nullable<InternalDocumentID[]> {
  return root.numberToDocumentId.get(key) ?? null
}

export function remove(root: Nullable<FlatTree>, key: ScalarSearchableValue): Nullable<FlatTree> {
  if (root) {
    root.numberToDocumentId.delete(key)
  }
  return root
}
export function removeDocument(root: FlatTree, id: InternalDocumentID, key: ScalarSearchableValue): void {
  root?.numberToDocumentId.set(key, root?.numberToDocumentId.get(key)?.filter((v) => v !== id) ?? [])
  if (root?.numberToDocumentId.get(key)?.length === 0) {
    root?.numberToDocumentId.delete(key)
  }
}


export function contains(node: FlatTree, key: ScalarSearchableValue): boolean {
  return !!find(node, key)
}

export function getSize(root: Nullable<FlatTree>): number {
  let size = 0
  for (const [, value] of root?.numberToDocumentId ?? []) {
    size += value.length
  }
  return size
}
export function filter(root: FlatTree, operation: EnumComparisonOperator): InternalDocumentID[] {
  const operationKeys = Object.keys(operation)

  if (operationKeys.length !== 1) {
    throw new Error('Invalid operation')
  }

  const operationType = operationKeys[0] as keyof EnumComparisonOperator
  switch (operationType) {
    case 'eq': {
      const value = operation[operationType]!
      return root.numberToDocumentId.get(value) ?? []
    }
    case 'in': {
      const value = operation[operationType]!
      const result: InternalDocumentID[] = []
      for (const v of value) {
        const ids = root.numberToDocumentId.get(v)
        if (ids) {
          result.push(...ids)
        }
      }
      return result
    }
  }

  throw new Error('Invalid operation')
}
