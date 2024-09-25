import { InternalDocumentID } from '../components/internal-document-id-store.js'
import { ScalarSearchableValue } from '../types.js'

export const BoolType = 'Bool' as const

export interface BoolTree {
  type: typeof BoolType
  true: InternalDocumentID[]
  false: InternalDocumentID[]
  isArray
}

export function create(isArray: boolean): BoolTree {
  return {
    type: BoolType,
    true: [],
    false: [],
    isArray
  }
}

export function insert(root: BoolTree, internalId: InternalDocumentID, value: boolean) {
  const booleanKey = value ? 'true' : 'false'
  root[booleanKey].push(internalId)
}

export function where(root: BoolTree, value: boolean) {
  const booleanKey = value ? 'true' : 'false'
  return root[booleanKey]
}

export function removeDocument(root: BoolTree, internalId: InternalDocumentID, value: ScalarSearchableValue): void {
  const booleanKey = value ? 'true' : 'false'
  const position = root[booleanKey].indexOf(internalId)
  if (position > -1) {
    root[booleanKey].splice(position, 1)
  }
}
