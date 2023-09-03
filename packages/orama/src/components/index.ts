import type {
  ArraySearchableType,
  BM25Params,
  ComparisonOperator,
  IIndex,
  Magnitude,
  OpaqueDocumentStore,
  OpaqueIndex,
  Orama,
  ScalarSearchableType,
  Schema,
  SearchableType,
  SearchableValue,
  SearchContext,
  Tokenizer,
  TokenScore,
  VectorType,
} from '../types.js'
import { createError } from '../errors.js'
import {
  create as avlCreate,
  find as avlFind,
  greaterThan as avlGreaterThan,
  insert as avlInsert,
  lessThan as avlLessThan,
  Node as AVLNode,
  rangeSearch as avlRangeSearch,
  removeDocument as avlRemoveDocument,
} from '../trees/avl.js'
import {
  create as radixCreate,
  find as radixFind,
  insert as radixInsert,
  Node as RadixNode,
  removeDocumentByWord as radixRemoveDocument,
} from '../trees/radix.js'
import { intersect } from '../utils.js'
import { BM25 } from './algorithms.js'
import { getInnerType, getVectorSize, isArrayType, isVectorType } from './defaults.js'
import {
  DocumentID,
  getInternalDocumentId,
  InternalDocumentID,
  InternalDocumentIDStore,
} from './internal-document-id-store.js'
import { getMagnitude } from './cosine-similarity.js'

export type FrequencyMap = {
  [property: string]: {
    [documentID: InternalDocumentID]:
      | {
          [token: string]: number
        }
      | undefined
  }
}

export type BooleanIndex = {
  true: InternalDocumentID[]
  false: InternalDocumentID[]
}

export type VectorIndex = {
  size: number
  vectors: {
    [docID: string]: [Magnitude, VectorType]
  }
}

export interface Index extends OpaqueIndex {
  sharedInternalDocumentStore: InternalDocumentIDStore
  indexes: Record<string, RadixNode | AVLNode<number, InternalDocumentID[]> | BooleanIndex>
  vectorIndexes: Record<string, VectorIndex>
  searchableProperties: string[]
  searchablePropertiesWithTypes: Record<string, SearchableType>
  frequencies: FrequencyMap
  tokenOccurrences: Record<string, Record<string, number>>
  avgFieldLength: Record<string, number>
  fieldLengths: Record<string, Record<InternalDocumentID, number | undefined>>
}

export type DefaultIndex = IIndex<Index>

export async function insertDocumentScoreParameters(
  index: Index,
  prop: string,
  id: DocumentID,
  tokens: string[],
  docsCount: number,
): Promise<void> {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)

  index.avgFieldLength[prop] = ((index.avgFieldLength[prop] ?? 0) * (docsCount - 1) + tokens.length) / docsCount
  index.fieldLengths[prop][internalId] = tokens.length
  index.frequencies[prop][internalId] = {}
}

export async function insertTokenScoreParameters(
  index: Index,
  prop: string,
  id: DocumentID,
  tokens: string[],
  token: string,
): Promise<void> {
  let tokenFrequency = 0

  for (const t of tokens) {
    if (t === token) {
      tokenFrequency++
    }
  }

  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)
  const tf = tokenFrequency / tokens.length

  index.frequencies[prop][internalId]![token] = tf

  if (!(token in index.tokenOccurrences[prop])) {
    index.tokenOccurrences[prop][token] = 0
  }

  // increase a token counter that may not yet exist
  index.tokenOccurrences[prop][token] = (index.tokenOccurrences[prop][token] ?? 0) + 1
}

export async function removeDocumentScoreParameters(
  index: Index,
  prop: string,
  id: DocumentID,
  docsCount: number,
): Promise<void> {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)

  index.avgFieldLength[prop] =
    (index.avgFieldLength[prop] * docsCount - index.fieldLengths[prop][internalId]!) / (docsCount - 1)
  index.fieldLengths[prop][internalId] = undefined
  index.frequencies[prop][internalId] = undefined
}

export async function removeTokenScoreParameters(index: Index, prop: string, token: string): Promise<void> {
  index.tokenOccurrences[prop][token]--
}

export async function calculateResultScores<I extends OpaqueIndex, D extends OpaqueDocumentStore, AggValue>(
  context: SearchContext<I, D, AggValue>,
  index: Index,
  prop: string,
  term: string,
  ids: DocumentID[],
): Promise<TokenScore[]> {
  const documentIDs = Array.from(ids)

  // Exact fields for TF-IDF
  const avgFieldLength = index.avgFieldLength[prop]
  const fieldLengths = index.fieldLengths[prop]
  const oramaOccurrences = index.tokenOccurrences[prop]
  const oramaFrequencies = index.frequencies[prop]

  // oramaOccurrences[term] can be undefined, 0, string, or { [k: string]: number }
  const termOccurrences = typeof oramaOccurrences[term] === 'number' ? oramaOccurrences[term] ?? 0 : 0

  const scoreList: TokenScore[] = []

  // Calculate TF-IDF value for each term, in each document, for each index.
  const documentIDsLength = documentIDs.length
  for (let k = 0; k < documentIDsLength; k++) {
    const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, documentIDs[k])
    const tf = oramaFrequencies?.[internalId]?.[term] ?? 0

    const bm25 = BM25(
      tf,
      termOccurrences,
      context.docsCount,
      fieldLengths[internalId]!,
      avgFieldLength,
      context.params.relevance! as Required<BM25Params>,
    )

    scoreList.push([internalId, bm25])
  }
  return scoreList
}

export async function create(
  orama: Orama<{ Index: DefaultIndex }>,
  sharedInternalDocumentStore: InternalDocumentIDStore,
  schema: Schema,
  index?: Index,
  prefix = '',
): Promise<Index> {
  if (!index) {
    index = {
      sharedInternalDocumentStore,
      indexes: {},
      vectorIndexes: {},
      searchableProperties: [],
      searchablePropertiesWithTypes: {},
      frequencies: {},
      tokenOccurrences: {},
      avgFieldLength: {},
      fieldLengths: {},
    }
  }

  for (const [prop, type] of Object.entries(schema)) {
    const typeActualType = typeof type
    const path = `${prefix}${prefix ? '.' : ''}${prop}`

    if (typeActualType === 'object' && !Array.isArray(type)) {
      // Nested
      create(orama, sharedInternalDocumentStore, type as Schema, index, path)
      continue
    }

    if (isVectorType(type as string)) {
      index.searchableProperties.push(path)
      index.searchablePropertiesWithTypes[path] = (type as SearchableType)
      index.vectorIndexes[path] = {
        size: getVectorSize(type as string),
        vectors: {},
      }
    } else {
      switch (type) {
        case 'boolean':
        case 'boolean[]':
          index.indexes[path] = { true: [], false: [] }
          break
        case 'number':
        case 'number[]':
          index.indexes[path] = avlCreate<number, InternalDocumentID[]>(0, [])
          break
        case 'string':
        case 'string[]':
          index.indexes[path] = radixCreate()
          index.avgFieldLength[path] = 0
          index.frequencies[path] = {}
          index.tokenOccurrences[path] = {}
          index.fieldLengths[path] = {}
          break
        default:
          throw createError('INVALID_SCHEMA_TYPE', Array.isArray(type) ? 'array' : (type as unknown as string), path)
      }

      index.searchableProperties.push(path)
      index.searchablePropertiesWithTypes[path] = type
    }
  }

  return index
}

async function insertScalar(
  implementation: IIndex<Index>,
  index: Index,
  prop: string,
  id: DocumentID,
  value: SearchableValue,
  schemaType: ScalarSearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
): Promise<void> {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)

  switch (schemaType) {
    case 'boolean': {
      const booleanIndex = index.indexes[prop] as BooleanIndex
      booleanIndex[value ? 'true' : 'false'].push(internalId)
      break
    }
    case 'number':
      avlInsert(index.indexes[prop] as AVLNode<number, number[]>, value as number, [internalId])
      break
    case 'string': {
      const tokens = await tokenizer.tokenize(value as string, language, prop)
      await implementation.insertDocumentScoreParameters(index, prop, internalId, tokens, docsCount)

      for (const token of tokens) {
        await implementation.insertTokenScoreParameters(index, prop, internalId, tokens, token)

        radixInsert(index.indexes[prop] as RadixNode, token, internalId)
      }

      break
    }
  }
}

export async function insert(
  implementation: DefaultIndex,
  index: Index,
  prop: string,
  id: DocumentID,
  value: SearchableValue,
  schemaType: SearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
): Promise<void> {

  if (isVectorType(schemaType)) {
    return insertVector(index, prop, value as number[] | Float32Array, id)
  }

  if (!isArrayType(schemaType)) {
    return insertScalar(
      implementation,
      index,
      prop,
      id,
      value,
      schemaType as ScalarSearchableType,
      language,
      tokenizer,
      docsCount,
    )
  }

  const innerSchemaType = getInnerType(schemaType as ArraySearchableType)

  const elements = value as Array<string | number | boolean>
  const elementsLength = elements.length
  for (let i = 0; i < elementsLength; i++) {
    await insertScalar(implementation, index, prop, id, elements[i], innerSchemaType, language, tokenizer, docsCount)
  }
}

function insertVector(index: Index, prop: string, value: number[] | VectorType, id: DocumentID): void {
  if (!(value instanceof Float32Array)) {
    value = new Float32Array(value)
  }
  
  const size = index.vectorIndexes[prop].size
  const magnitude = getMagnitude(value, size)

  index.vectorIndexes[prop].vectors[id] = [magnitude, value]
}

async function removeScalar(
  implementation: IIndex<Index>,
  index: Index,
  prop: string,
  id: DocumentID,
  value: SearchableValue,
  schemaType: ScalarSearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
): Promise<boolean> {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)

  switch (schemaType) {
    case 'number': {
      avlRemoveDocument(index.indexes[prop] as AVLNode<number, InternalDocumentID[]>, internalId, value)
      return true
    }
    case 'boolean': {
      const booleanKey = value ? 'true' : 'false'
      const position = (index.indexes[prop] as BooleanIndex)[booleanKey].indexOf(internalId)

      ;(index.indexes[prop] as BooleanIndex)[value ? 'true' : 'false'].splice(position, 1)
      return true
    }
    case 'string': {
      const tokens = await tokenizer.tokenize(value as string, language, prop)

      await implementation.removeDocumentScoreParameters(index, prop, id, docsCount)

      for (const token of tokens) {
        await implementation.removeTokenScoreParameters(index, prop, token)
        radixRemoveDocument(index.indexes[prop] as RadixNode, token, internalId)
      }

      return true
    }
  }
}

export async function remove(
  implementation: DefaultIndex,
  index: Index,
  prop: string,
  id: DocumentID,
  value: SearchableValue,
  schemaType: SearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
): Promise<boolean> {
  if (!isArrayType(schemaType)) {
    return removeScalar(
      implementation,
      index,
      prop,
      id,
      value,
      schemaType as ScalarSearchableType,
      language,
      tokenizer,
      docsCount,
    )
  }

  const innerSchemaType = getInnerType(schemaType as ArraySearchableType)

  const elements = value as Array<string | number | boolean>
  const elementsLength = elements.length
  for (let i = 0; i < elementsLength; i++) {
    await removeScalar(implementation, index, prop, id, elements[i], innerSchemaType, language, tokenizer, docsCount)
  }

  return true
}

export async function search<D extends OpaqueDocumentStore, AggValue>(
  context: SearchContext<Index, D, AggValue>,
  index: Index,
  prop: string,
  term: string,
): Promise<TokenScore[]> {
  if (!(prop in index.tokenOccurrences)) {
    return []
  }

  // Performa the search
  const rootNode = index.indexes[prop] as RadixNode
  const { exact, tolerance } = context.params
  const searchResult = radixFind(rootNode, { term, exact, tolerance })
  const ids = new Set<InternalDocumentID>()

  for (const key in searchResult) {
    for (const id of searchResult[key]) {
      ids.add(id)
    }
  }

  return context.index.calculateResultScores(context, index, prop, term, Array.from(ids))
}

export async function searchByWhereClause<I extends OpaqueIndex, D extends OpaqueDocumentStore, AggValue>(
  context: SearchContext<I, D, AggValue>,
  index: Index,
  filters: Record<string, boolean | ComparisonOperator>,
): Promise<number[]> {
  const filterKeys = Object.keys(filters)

  const filtersMap: Record<string, InternalDocumentID[]> = filterKeys.reduce(
    (acc, key) => ({
      [key]: [],
      ...acc,
    }),
    {},
  )

  for (const param of filterKeys) {
    const operation = filters[param]

    if (typeof operation === 'boolean') {
      const idx = index.indexes[param] as BooleanIndex

      if (typeof idx === 'undefined') {
        throw createError('UNKNOWN_FILTER_PROPERTY', param)
      }

      const filteredIDs = idx[operation.toString() as keyof BooleanIndex]
      filtersMap[param].push(...filteredIDs)
      continue
    }

    if (typeof operation === 'string' || Array.isArray(operation)) {
      const idx = index.indexes[param] as RadixNode

      if (typeof idx === 'undefined') {
        throw createError('UNKNOWN_FILTER_PROPERTY', param)
      }

      for (const raw of [operation].flat()) {
        const term = await context.tokenizer.tokenize(raw, context.language, param)
        for (const t of term) {
          const filteredIDsResults = radixFind(idx, { term: t, exact: true })
          filtersMap[param].push(...Object.values(filteredIDsResults).flat())
        }
      }

      continue
    }

    const operationKeys = Object.keys(operation)

    if (operationKeys.length > 1) {
      throw createError('INVALID_FILTER_OPERATION', operationKeys.length)
    }

    const operationOpt = operationKeys[0] as keyof ComparisonOperator
    const operationValue = operation[operationOpt]

    const AVLNode = index.indexes[param] as AVLNode<number, InternalDocumentID[]>

    if (typeof AVLNode === 'undefined') {
      throw createError('UNKNOWN_FILTER_PROPERTY', param)
    }

    switch (operationOpt) {
      case 'gt': {
        const filteredIDs = avlGreaterThan(AVLNode, operationValue, false)
        filtersMap[param].push(...filteredIDs)
        break
      }
      case 'gte': {
        const filteredIDs = avlGreaterThan(AVLNode, operationValue, true)
        filtersMap[param].push(...filteredIDs)
        break
      }
      case 'lt': {
        const filteredIDs = avlLessThan(AVLNode, operationValue, false)
        filtersMap[param].push(...filteredIDs)
        break
      }
      case 'lte': {
        const filteredIDs = avlLessThan(AVLNode, operationValue, true)
        filtersMap[param].push(...filteredIDs)
        break
      }
      case 'eq': {
        const filteredIDs = avlFind(AVLNode, operationValue) ?? []
        filtersMap[param].push(...filteredIDs)
        break
      }
      case 'between': {
        const [min, max] = operationValue as number[]
        const filteredIDs = avlRangeSearch(AVLNode, min, max)
        filtersMap[param].push(...filteredIDs)
      }
    }
  }

  // AND operation: calculate the intersection between all the IDs in filterMap
  const result = intersect(Object.values(filtersMap))

  return result
}

export async function getSearchableProperties(index: Index): Promise<string[]> {
  return index.searchableProperties
}

export async function getSearchablePropertiesWithTypes(index: Index): Promise<Record<string, SearchableType>> {
  return index.searchablePropertiesWithTypes
}

function loadNode(node: RadixNode): RadixNode {
  const convertedNode = radixCreate(node.end, node.subWord, node.key)

  convertedNode.docs = node.docs
  convertedNode.word = node.word

  for (const childrenKey of Object.keys(node.children)) {
    convertedNode.children[childrenKey] = loadNode(node.children[childrenKey])
  }

  return convertedNode
}

export async function load<R = unknown>(sharedInternalDocumentStore: InternalDocumentIDStore, raw: R): Promise<Index> {
  const {
    indexes: rawIndexes,
    vectorIndexes: rawVectorIndexes,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrences,
    avgFieldLength,
    fieldLengths,
  } = raw as Index

  const indexes: Index['indexes'] = {}
  const vectorIndexes: Index['vectorIndexes'] = {}

  for (const prop of Object.keys(rawIndexes)) {
    const value = rawIndexes[prop]

    if (!('word' in value)) {
      indexes[prop] = value

      continue
    }

    indexes[prop] = loadNode(value)
  }

  for (const idx of Object.keys(rawVectorIndexes)) {
    const vectors = rawVectorIndexes[idx].vectors

    for (const vec in vectors) {
      vectors[vec] = [vectors[vec][0], new Float32Array(vectors[vec][1])]
    }

    vectorIndexes[idx] = {
      size: rawVectorIndexes[idx].size,
      vectors,
    }
  }

  return {
    sharedInternalDocumentStore,
    indexes,
    vectorIndexes,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrences,
    avgFieldLength,
    fieldLengths,
  }
}

export async function save<R = unknown>(index: Index): Promise<R> {
  const {
    indexes,
    vectorIndexes,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrences,
    avgFieldLength,
    fieldLengths,
  } = index

  const vectorIndexesAsArrays: Index['vectorIndexes'] = {}

  for (const idx of Object.keys(vectorIndexes)) {
    const vectors = vectorIndexes[idx].vectors
    
    for (const vec in vectors) {
      vectors[vec] = [vectors[vec][0], Array.from(vectors[vec][1]) as unknown as Float32Array]
    }

    vectorIndexesAsArrays[idx] = {
      size: vectorIndexes[idx].size,
      vectors
    }
  }

  return {
    indexes,
    vectorIndexes: vectorIndexesAsArrays,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrences,
    avgFieldLength,
    fieldLengths,
  } as R
}

export async function createIndex(): Promise<DefaultIndex> {
  return {
    create,
    insert,
    remove,
    insertDocumentScoreParameters,
    insertTokenScoreParameters,
    removeDocumentScoreParameters,
    removeTokenScoreParameters,
    calculateResultScores,
    search,
    searchByWhereClause,
    getSearchableProperties,
    getSearchablePropertiesWithTypes,
    load,
    save,
  }
}
