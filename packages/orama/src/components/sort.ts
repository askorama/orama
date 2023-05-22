import { createError } from "../errors.js"
import { ISort, OpaqueSort, Orama, SortByParams, SortSchema, SortType, SortValue } from "../types.js"


interface PropertySort<K> {
  docs: Record<string, number>
  orderedDocs: [string, K][]
  type: SortType
  n: number
}

export interface Sort extends OpaqueSort {
  sortableProperties: string[],
  sortablePropertiesWithTypes: Record<string, SortType>
  sorts: Record<string, PropertySort<number | string | boolean>>
}

export type DefaultSort = ISort<Sort>

function innerCreate(
  orama: Orama<{ Sort: Sort }>,
  schema: SortSchema,
  prefix: string,
): Sort {
  const sort: Sort = {
    sortableProperties: [],
    sortablePropertiesWithTypes: {},
    sorts: {}
  }

  for (const [prop, type] of Object.entries(schema)) {
    const typeActualType = typeof type
    const path = `${prefix}${prefix ? '.' : ''}${prop}`

    if (typeActualType === 'object' && !Array.isArray(type)) {
      // Nested
      const ret = innerCreate(orama, type as SortSchema, path)
      sort.sortableProperties.push(...ret.sortableProperties)
      sort.sorts = {
        ...sort.sorts,
        ...ret.sorts
      }
      sort.sortablePropertiesWithTypes = {
        ...sort.sortablePropertiesWithTypes,
        ...ret.sortablePropertiesWithTypes
      }
      continue
    }

    switch (type) {
      case 'boolean':
      case 'number':
      case 'string':
        sort.sortableProperties.push(path)
        sort.sortablePropertiesWithTypes[path] = type
        sort.sorts[path] = {
          docs: {},
          orderedDocs: [],
          type: type,
          n: 0
        }
        break
      default:
        throw createError('INVALID_SORT_SCHEMA_TYPE', Array.isArray(type) ? 'array' : typeActualType)
    }
  }

  return sort
}

async function create(
  orama: Orama<{ Sort: Sort }>,
  schema: SortSchema,
): Promise<Sort> {
  return innerCreate(orama, schema, '')
}

async function insert(
  sort: Sort,
  prop: string,
  id: string,
  value: SortValue,
  schemaType: SortType,
  language: string | undefined,
): Promise<void> {
  const s = sort.sorts[prop] as PropertySort<SortValue>

  let predicate: (value: [string, SortValue]) => boolean
  switch(schemaType) {
    case "string":
      predicate = (d: [string, SortValue]) => (d[1] as string).localeCompare(value as string, language) > 0
      break;
    case "number":
      predicate = (d: [string, SortValue]) => (d[1] as number) > (value as number)
      break;
    case "boolean":
      predicate = (d: [string, SortValue]) => d[1] as boolean
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
  for (let i = index + 1; i < s.orderedDocs.length; i++) {
    const docId = s.orderedDocs[i][0]
    s.docs[docId]++
  }
}

async function remove(
  sort: Sort,
  prop: string,
  id: string,
) {
  const s = sort.sorts[prop] as PropertySort<SortValue>

  const index = s.docs[id]
  delete s.docs[id]

  // Decrement position for the greather documents
  for (let i = index + 1; i < s.orderedDocs.length; i++) {
    const docId = s.orderedDocs[i][0]
    s.docs[docId]--
  }

  s.orderedDocs.splice(index, 1)
}

async function sortBy(sort: Sort, docIds: [string, number][], by: SortByParams): Promise<[string, number][]> {
  const property = by.property
  const isDesc = by.order === 'DESC'

  const s = sort.sorts[property]
  if (!s) {
    throw createError('UNABLE_TO_SORT_ON_UNKNOWN_FIELD', property, sort.sortableProperties.join(', '))
  }

  const docIdsLength = docIds.length

  // Calculate how many documents aren't inside the sort index.
  // Used only for "desc" sort.
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

async function getSortableProperties(sort: Sort): Promise<string[]> {
  return sort.sortableProperties
}

async function getSortablePropertiesWithTypes(sort: Sort): Promise<Record<string, SortType>> {
  return sort.sortablePropertiesWithTypes
}

export async function load<R = unknown>(raw: R): Promise<Sort> {
  const rawDocument = raw as Sort

  return {
    sortableProperties: rawDocument.sortableProperties,
    sortablePropertiesWithTypes: rawDocument.sortablePropertiesWithTypes,
    sorts: rawDocument.sorts
  }
}

export async function save<R = unknown>(s: Sort): Promise<R> {
  return {
    sortableProperties: s.sortableProperties,
    sortablePropertiesWithTypes: s.sortablePropertiesWithTypes,
    sorts: s.sorts
  } as R
}

export async function createSort(): Promise<DefaultSort> {
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