import { createError } from "../errors.js"
import { ISorter, OpaqueDocumentStore, OpaqueIndex, OpaqueSorter, Orama, Schema, SorterConfig, SorterParams, SortType, SortValue } from "../types.js"

interface PropertySort<K> {
  docs: Record<string, number>
  orderedDocs: [string, K][]
  type: SortType
  n: number
}

export interface Sorter extends OpaqueSorter {
  enabled: boolean,
  sortableProperties: string[],
  sortablePropertiesWithTypes: Record<string, SortType>
  sorts: Record<string, PropertySort<number | string | boolean>>
}

export type DefaultSorter = ISorter<Sorter>

function innerCreate(
  schema: Schema,
  sortableDeniedProperties: string[],
  prefix: string,
): Sorter {
  const sorter: Sorter = {
    enabled: true,
    sortableProperties: [],
    sortablePropertiesWithTypes: {},
    sorts: {}
  }

  for (const [prop, type] of Object.entries(schema)) {
    const typeActualType = typeof type
    const path = `${prefix}${prefix ? '.' : ''}${prop}`

    if (sortableDeniedProperties.includes(path)) {
      continue
    }

    if (typeActualType === 'object' && !Array.isArray(type)) {
      // Nested
      const ret = innerCreate(type as Schema, sortableDeniedProperties, path)
      sorter.sortableProperties.push(...ret.sortableProperties)
      sorter.sorts = {
        ...sorter.sorts,
        ...ret.sorts
      }
      sorter.sortablePropertiesWithTypes = {
        ...sorter.sortablePropertiesWithTypes,
        ...ret.sortablePropertiesWithTypes
      }
      continue
    }

    switch (type) {
      case 'boolean':
      case 'number':
      case 'string':
        sorter.sortableProperties.push(path)
        sorter.sortablePropertiesWithTypes[path] = type
        sorter.sorts[path] = {
          docs: {},
          orderedDocs: [],
          type: type,
          n: 0
        }
        break
      case 'boolean[]':
      case 'number[]':
      case 'string[]':
        // We don't allow to sort by arrays
        continue
      default:
        throw createError('INVALID_SORT_SCHEMA_TYPE', Array.isArray(type) ? 'array' : type as unknown as string, path)
    }
  }

  return sorter
}

async function create<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  _: Orama<S, I, D, Sorter>,
  schema: Schema,
  config?: SorterConfig,
): Promise<Sorter> {
  const isSortEnabled = config?.enabled !== false
  if (!isSortEnabled) {
    return {
      disabled: true
    } as unknown as Sorter
  }
  return innerCreate(schema, (config || {}).unsortableProperties || [], '')
}

function stringSort(value: SortValue, language: string | undefined, d: [string, SortValue]): boolean {
  return (d[1] as string).localeCompare(value as string, language) > 0
}
function numerSort(value: SortValue, d: [string, SortValue]): boolean {
  return (d[1] as number) > (value as number)
}
function booleanSort(value: SortValue, d: [string, SortValue]): boolean {
  return d[1] as boolean
}

async function insert(
  so: Sorter,
  prop: string,
  id: string,
  value: SortValue,
  schemaType: SortType,
  language: string | undefined,
): Promise<void> {
  const sorter = so as unknown as Sorter
  if (!sorter.enabled) {
    return
  }
  const s = sorter.sorts[prop] as PropertySort<SortValue>

  let predicate: (value: [string, SortValue]) => boolean
  switch(schemaType) {
    case 'string':
      predicate = stringSort.bind(null, value, language)
      break;
    case 'number':
      predicate = numerSort.bind(null, value)
      break;
    case 'boolean':
      predicate = booleanSort.bind(null, value)
      break;
  }

  // Find the right position to insert the element
  let index = s.orderedDocs.findIndex(predicate)
  if (index === -1) {
    index = s.orderedDocs.length
    s.orderedDocs.push([id, value])
  } else {
    s.orderedDocs.splice(index, 0, [id, value])
  }
  s.docs[id] = index

  // Increment position for the greather documents
  const orderedDocsLength = s.orderedDocs.length
  for (let i = index + 1; i < orderedDocsLength; i++) {
    const docId = s.orderedDocs[i][0]
    s.docs[docId]++
  }
}

async function remove(
  so: Sorter,
  prop: string,
  id: string,
) {
  const sorter = so as unknown as Sorter
  if (!sorter.enabled) {
    return
  }
  const s = sorter.sorts[prop] as PropertySort<SortValue>

  const index = s.docs[id]
  delete s.docs[id]

  // Decrement position for the greather documents
  const orderedDocsLength = s.orderedDocs.length
  for (let i = index + 1; i < orderedDocsLength; i++) {
    const docId = s.orderedDocs[i][0]
    s.docs[docId]--
  }

  s.orderedDocs.splice(index, 1)
}

async function sortBy(sorter: Sorter, docIds: [string, number][], by: SorterParams): Promise<[string, number][]> {
  if (!sorter.enabled) {
    throw createError('SORT_DISABLED')
  }

  const property = by.property
  const isDesc = by.order === 'DESC'

  const s = sorter.sorts[property]
  if (!s) {
    throw createError('UNABLE_TO_SORT_ON_UNKNOWN_FIELD', property, sorter.sortableProperties.join(', '))
  }

  const docIdsLength = docIds.length

  // Calculate how many documents aren't inside the sorter index.
  // Used only for "DESC" sort.
  let unsortableDocumentTotal = 0
  if (isDesc) {
    for (let i = 0; i < docIdsLength; i++) {
      if (typeof s.docs[docIds[i][0]] === 'undefined') {
        unsortableDocumentTotal++
      }
    }
  }

  let unsortableDocumentCount = 0
  const ret = new Array(docIdsLength)
  for (let i = 0; i < docIdsLength; i++) {
    const d = docIds[i]
    let pos = s.docs[d[0]]
    if (typeof pos === 'undefined') {
      unsortableDocumentCount++
      pos = docIdsLength - unsortableDocumentCount
    } else if (isDesc) {
      pos = docIdsLength - unsortableDocumentTotal - pos - 1
    }

    ret[pos] = d
  }

  return ret
}

async function getSortableProperties(sorter: Sorter): Promise<string[]> {
  if (!sorter.enabled) {
    return []
  }

  return sorter.sortableProperties
}

async function getSortablePropertiesWithTypes(sorter: Sorter): Promise<Record<string, SortType>> {
  if (!sorter.enabled) {
    return {}
  }

  return sorter.sortablePropertiesWithTypes
}

export async function load<R = unknown>(raw: R): Promise<Sorter> {
  const rawDocument = raw as Sorter
  if (!rawDocument.enabled) {
    return {
      enabled: false
    } as unknown as Sorter
  }

  return {
    sortableProperties: rawDocument.sortableProperties,
    sortablePropertiesWithTypes: rawDocument.sortablePropertiesWithTypes,
    sorts: rawDocument.sorts,
    enabled: true
  }
}

export async function save<R = unknown>(sorter: Sorter): Promise<R> {
  if (!sorter.enabled) {
    return {
      enabled: false
    } as unknown as R
  }

  return {
    sortableProperties: sorter.sortableProperties,
    sortablePropertiesWithTypes: sorter.sortablePropertiesWithTypes,
    sorts: sorter.sorts,
    enabled: sorter.enabled,
  } as R
}

export async function createSorter(): Promise<DefaultSorter> {
  return {
    create,
    insert,
    remove,
    save,
    load,
    sortBy,
    getSortableProperties,
    getSortablePropertiesWithTypes,
  }
}