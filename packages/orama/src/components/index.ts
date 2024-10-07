import type {
  AnyIndexStore,
  AnyOrama,
  ArraySearchableType,
  BM25Params,
  ComparisonOperator,
  EnumArrComparisonOperator,
  EnumComparisonOperator,
  GeosearchOperation,
  GeosearchPolygonOperator,
  GeosearchRadiusOperator,
  IIndex,
  ScalarSearchableType,
  SearchableType,
  SearchableValue,
  Tokenizer,
  TokenScore,
  VectorIndex,
  VectorType,
  WhereCondition
} from '../types.js'
import type { InsertOptions } from '../methods/insert.js'
import type { Point as BKDGeoPoint } from '../trees/bkd.js'
import { RadixNode } from '../trees/radix.js'
import { createError } from '../errors.js'
import { AVLTree } from '../trees/avl.js'
import { FlatTree } from '../trees/flat.js'
import { RadixTree } from '../trees/radix.js'
import { BKDTree } from '../trees/bkd.js'
import { BoolNode } from '../trees/bool.js'

import { convertDistanceToMeters, intersect, safeArrayPush } from '../utils.js'
import { BM25 } from './algorithms.js'
import { getMagnitude } from './cosine-similarity.js'
import { getInnerType, getVectorSize, isArrayType, isVectorType } from './defaults.js'
import {
  DocumentID,
  getInternalDocumentId,
  InternalDocumentID,
  InternalDocumentIDStore
} from './internal-document-id-store.js'

export type FrequencyMap = {
  [property: string]: {
    [documentID: InternalDocumentID]:
      | {
          [token: string]: number
        }
      | undefined
  }
}

export type TreeType = 'AVL' | 'Radix' | 'Bool' | 'Flat' | 'BKD'

export type TTree<T = TreeType, N = unknown> = {
  type: T
  node: N
  isArray: boolean
}

export type Tree =
  | TTree<'Radix', RadixNode>
  | TTree<'AVL', AVLTree<number, InternalDocumentID[]>>
  | TTree<'Bool', BoolNode>
  | TTree<'Flat', FlatTree>
  | TTree<'BKD', BKDTree>

export interface Index extends AnyIndexStore {
  sharedInternalDocumentStore: InternalDocumentIDStore
  indexes: Record<string, Tree>
  vectorIndexes: Record<string, VectorIndex>
  searchableProperties: string[]
  searchablePropertiesWithTypes: Record<string, SearchableType>
  frequencies: FrequencyMap
  tokenOccurrences: Record<string, Record<string, number>>
  avgFieldLength: Record<string, number>
  fieldLengths: Record<string, Record<InternalDocumentID, number | undefined>>
}

export function insertDocumentScoreParameters(
  index: Index,
  prop: string,
  id: DocumentID,
  tokens: string[],
  docsCount: number
): void {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)

  index.avgFieldLength[prop] = ((index.avgFieldLength[prop] ?? 0) * (docsCount - 1) + tokens.length) / docsCount
  index.fieldLengths[prop][internalId] = tokens.length
  index.frequencies[prop][internalId] = {}
}

export function insertTokenScoreParameters(
  index: Index,
  prop: string,
  id: DocumentID,
  tokens: string[],
  token: string
): void {
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

export function removeDocumentScoreParameters(index: Index, prop: string, id: DocumentID, docsCount: number): void {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)

  if (docsCount > 1) {
    index.avgFieldLength[prop] =
      (index.avgFieldLength[prop] * docsCount - index.fieldLengths[prop][internalId]!) / (docsCount - 1)
  } else {
    index.avgFieldLength[prop] = undefined as unknown as number
  }
  index.fieldLengths[prop][internalId] = undefined
  index.frequencies[prop][internalId] = undefined
}

export function removeTokenScoreParameters(index: Index, prop: string, token: string): void {
  index.tokenOccurrences[prop][token]--
}

export function create<T extends AnyOrama, TSchema extends T['schema']>(
  orama: T,
  sharedInternalDocumentStore: T['internalDocumentIDStore'],
  schema: TSchema,
  index?: Index,
  prefix = ''
): Index {
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
      fieldLengths: {}
    }
  }

  for (const [prop, type] of Object.entries<SearchableType>(schema)) {
    const path = `${prefix}${prefix ? '.' : ''}${prop}`

    if (typeof type === 'object' && !Array.isArray(type)) {
      // Nested
      create(orama, sharedInternalDocumentStore, type, index, path)
      continue
    }

    if (isVectorType(type)) {
      index.searchableProperties.push(path)
      index.searchablePropertiesWithTypes[path] = type
      index.vectorIndexes[path] = {
        size: getVectorSize(type),
        vectors: {}
      }
    } else {
      const isArray = /\[/.test(type as string)
      switch (type) {
        case 'boolean':
        case 'boolean[]':
          index.indexes[path] = { type: 'Bool', node: new BoolNode(), isArray }
          break
        case 'number':
        case 'number[]':
          index.indexes[path] = { type: 'AVL', node: new AVLTree<number, InternalDocumentID[]>(0, []), isArray }
          break
        case 'string':
        case 'string[]':
          index.indexes[path] = { type: 'Radix', node: new RadixTree(), isArray }
          index.avgFieldLength[path] = 0
          index.frequencies[path] = {}
          index.tokenOccurrences[path] = {}
          index.fieldLengths[path] = {}
          break
        case 'enum':
        case 'enum[]':
          index.indexes[path] = { type: 'Flat', node: new FlatTree(), isArray }
          break
        case 'geopoint':
          index.indexes[path] = { type: 'BKD', node: new BKDTree(), isArray }
          break
        default:
          throw createError('INVALID_SCHEMA_TYPE', Array.isArray(type) ? 'array' : type, path)
      }

      index.searchableProperties.push(path)
      index.searchablePropertiesWithTypes[path] = type
    }
  }

  return index
}

function insertScalarBuilder(
  implementation: IIndex<Index>,
  index: Index,
  prop: string,
  internalId: InternalDocumentID,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
  options?: InsertOptions
) {
  return (value: SearchableValue) => {
    const { type, node } = index.indexes[prop]
    switch (type) {
      case 'Bool': {
        node[value ? 'true' : 'false'].add(internalId)
        break
      }
      case 'AVL': {
        const avlRebalanceThreshold = options?.avlRebalanceThreshold ?? 1
        node.insert(value as number, [internalId], avlRebalanceThreshold)
        break
      }
      case 'Radix': {
        const tokens = tokenizer.tokenize(value as string, language, prop)
        implementation.insertDocumentScoreParameters(index, prop, internalId, tokens, docsCount)

        for (const token of tokens) {
          implementation.insertTokenScoreParameters(index, prop, internalId, tokens, token)

          node.insert(token, internalId)
        }

        break
      }
      case 'Flat': {
        node.insert(value as ScalarSearchableType, internalId)
        break
      }
      case 'BKD': {
        node.insert(value as unknown as BKDGeoPoint, [internalId])
        break
      }
    }
  }
}

export function insert(
  implementation: IIndex<Index>,
  index: Index,
  prop: string,
  id: DocumentID,
  internalId: InternalDocumentID,
  value: SearchableValue,
  schemaType: SearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
  options?: InsertOptions
): void {
  if (isVectorType(schemaType)) {
    return insertVector(index, prop, value as number[] | Float32Array, id)
  }

  const insertScalar = insertScalarBuilder(implementation, index, prop, internalId, language, tokenizer, docsCount, options)

  if (!isArrayType(schemaType)) {
    return insertScalar(value)
  }

  const elements = value as Array<string | number | boolean>
  const elementsLength = elements.length
  for (let i = 0; i < elementsLength; i++) {
    insertScalar(elements[i])
  }
}

export function insertVector(index: AnyIndexStore, prop: string, value: number[] | VectorType, id: DocumentID): void {
  if (!(value instanceof Float32Array)) {
    value = new Float32Array(value)
  }

  const size = index.vectorIndexes[prop].size
  const magnitude = getMagnitude(value, size)

  index.vectorIndexes[prop].vectors[id] = [magnitude, value]
}

function removeScalar(
  implementation: IIndex<Index>,
  index: Index,
  prop: string,
  id: DocumentID,
  value: SearchableValue,
  schemaType: ScalarSearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number
): boolean {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)

  if (isVectorType(schemaType)) {
    delete index.vectorIndexes[prop].vectors[id]
    return true
  }

  const { type, node } = index.indexes[prop]
  switch (type) {
    case 'AVL': {
      node.removeDocument(internalId, value as number[])
      return true
    }
    case 'Bool': {
      node[value ? 'true' : 'false'].delete(internalId)
      return true
    }
    case 'Radix': {
      const tokens = tokenizer.tokenize(value as string, language, prop)

      implementation.removeDocumentScoreParameters(index, prop, id, docsCount)

      for (const token of tokens) {
        implementation.removeTokenScoreParameters(index, prop, token)
        node.removeDocumentByWord(token, internalId)
      }

      return true
    }
    case 'Flat': {
      node.removeDocument(internalId, value as ScalarSearchableType)
      return true
    }
    case 'BKD': {
      node.removeDocByID(value as unknown as BKDGeoPoint, internalId)
      return false
    }
  }
}

export function remove(
  implementation: IIndex<Index>,
  index: Index,
  prop: string,
  id: DocumentID,
  value: SearchableValue,
  schemaType: SearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number
): boolean {
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
      docsCount
    )
  }

  const innerSchemaType = getInnerType(schemaType as ArraySearchableType)

  const elements = value as Array<string | number | boolean>
  const elementsLength = elements.length
  for (let i = 0; i < elementsLength; i++) {
    removeScalar(implementation, index, prop, id, elements[i], innerSchemaType, language, tokenizer, docsCount)
  }

  return true
}

export function calculateResultScores(
  index: Index,
  prop: string,
  term: string,
  ids: InternalDocumentID[],
  docsCount: number,
  bm25Relevance: Required<BM25Params>,
  resultsMap: Map<number, number>,
  boostPerProperty: number,
) {
  const documentIDs = Array.from(ids)

  // Exact fields for TF-IDF
  const avgFieldLength = index.avgFieldLength[prop]
  const fieldLengths = index.fieldLengths[prop]
  const oramaOccurrences = index.tokenOccurrences[prop]
  const oramaFrequencies = index.frequencies[prop]

  // oramaOccurrences[term] can be undefined, 0, string, or { [k: string]: number }
  const termOccurrences = typeof oramaOccurrences[term] === 'number' ? oramaOccurrences[term] ?? 0 : 0

  // Calculate TF-IDF value for each term, in each document, for each index.
  const documentIDsLength = documentIDs.length
  for (let k = 0; k < documentIDsLength; k++) {
    const internalId = documentIDs[k]
    const tf = oramaFrequencies?.[internalId]?.[term] ?? 0

    const bm25 = BM25(
      tf,
      termOccurrences,
      docsCount,
      fieldLengths[internalId]!,
      avgFieldLength,
      bm25Relevance,
    )

    if (resultsMap.has(internalId)) {
      resultsMap.set(internalId, resultsMap.get(internalId)! + bm25 * boostPerProperty)
    } else {
      resultsMap.set(internalId, bm25 * boostPerProperty)
    }
  }
}

function searchInProperty(
  index: Index,
  tree: RadixTree,
  prop: string,
  tokens: string[],
  exact: boolean,
  tolerance: number,
  resultsMap: Map<number, number>,
  boostPerProperty: number,
  bm25Relevance: Required<BM25Params>,
  docsCount: number,
) {
  const tokenLength = tokens.length;
  for (let i = 0; i < tokenLength; i++) {
    const term = tokens[i];

    const searchResult = tree.find({ term, exact, tolerance })

    const termsFound = Object.keys(searchResult)
    const termsFoundLength = termsFound.length;
    for (let j = 0; j < termsFoundLength; j++) {
      const word = termsFound[j]
      const ids = searchResult[word]
      calculateResultScores(
        index,
        prop,
        word,
        ids,
        docsCount,
        bm25Relevance,
        resultsMap,
        boostPerProperty,
      )
    }
  }
}

export function search(
  index: Index,
  term: string,
  tokenizer: Tokenizer,
  language: string | undefined,
  propertiesToSearch: string[],
  exact: boolean,
  tolerance: number,
  boost: Record<string, number>,
  relevance: Required<BM25Params>,
  docsCount: number
): TokenScore[] {
  const tokens = tokenizer.tokenize(term, language)

  const resultsMap = new Map<number, number>()
  for (const prop of propertiesToSearch) {
    if (!(prop in index.indexes)) {
      continue
    }

    const tree = index.indexes[prop]
    const { type } = tree
    if (type !== 'Radix') {
      throw createError('WRONG_SEARCH_PROPERTY_TYPE', prop)
    }
    const boostPerProperty = boost[prop] ?? 1
    if (boostPerProperty <= 0) {
      throw createError('INVALID_BOOST_VALUE', boostPerProperty)
    }

    // if the tokenizer returns an empty array, we returns all the documents
    if (tokens.length === 0 && !term) {
      tokens.push('')
    }

    searchInProperty(
      index,
      tree.node,
      prop,
      tokens,
      exact,
      tolerance,
      resultsMap,
      boostPerProperty,
      relevance,
      docsCount
    )
  }

  return Array.from(resultsMap)
}

export function searchByWhereClause<T extends AnyOrama>(
  index: Index,
  tokenizer: Tokenizer,
  filters: Partial<WhereCondition<T['schema']>>,
  language: string | undefined
): number[] {
  const filterKeys = Object.keys(filters)

  const filtersMap: Record<string, InternalDocumentID[]> = filterKeys.reduce(
    (acc, key) => ({
      [key]: [],
      ...acc
    }),
    {}
  )

  for (const param of filterKeys) {
    const operation = filters[param]!

    if (typeof index.indexes[param] === 'undefined') {
      throw createError('UNKNOWN_FILTER_PROPERTY', param)
    }

    const { node, type, isArray } = index.indexes[param]

    if (type === 'Bool') {
      const idx = node
      const filteredIDs = Array.from(operation ? idx.true : idx.false)
      safeArrayPush(filtersMap[param], filteredIDs)
      continue
    }

    if (type === 'BKD') {
      let reqOperation: 'radius' | 'polygon'

      if ('radius' in (operation as GeosearchOperation)) {
        reqOperation = 'radius'
      } else if ('polygon' in (operation as GeosearchOperation)) {
        reqOperation = 'polygon'
      } else {
        throw new Error(`Invalid operation ${operation}`)
      }

      if (reqOperation === 'radius') {
        const {
          value,
          coordinates,
          unit = 'm',
          inside = true,
          highPrecision = false
        } = operation[reqOperation] as GeosearchRadiusOperator['radius']
        const distanceInMeters = convertDistanceToMeters(value, unit)
        const ids = node.searchByRadius(coordinates as BKDGeoPoint, distanceInMeters, inside, undefined, highPrecision)
        // @todo: convert this into a for loop
        safeArrayPush(
          filtersMap[param],
          ids.flatMap(({ docIDs }) => docIDs)
        )
      } else {
        const {
          coordinates,
          inside = true,
          highPrecision = false
        } = operation[reqOperation] as GeosearchPolygonOperator['polygon']
        const ids = node.searchByPolygon(coordinates as BKDGeoPoint[], inside, undefined, highPrecision)
        // @todo: convert this into a for loop
        safeArrayPush(
          filtersMap[param],
          ids.flatMap(({ docIDs }) => docIDs)
        )
      }

      continue
    }

    if (type === 'Radix' && (typeof operation === 'string' || Array.isArray(operation))) {
      for (const raw of [operation].flat()) {
        const term = tokenizer.tokenize(raw, language, param)
        for (const t of term) {
          const filteredIDsResults = node.find({ term: t, exact: true })
          safeArrayPush(filtersMap[param], Object.values(filteredIDsResults).flat())
        }
      }

      continue
    }

    const operationKeys = Object.keys(operation)

    if (operationKeys.length > 1) {
      throw createError('INVALID_FILTER_OPERATION', operationKeys.length)
    }

    if (type === 'Flat') {
      const results = isArray
        ? node.filterArr(operation as EnumArrComparisonOperator)
        : node.filter(operation as EnumComparisonOperator)

      safeArrayPush(filtersMap[param], results)
      continue
    }

    if (type === 'AVL') {
      const operationOpt = operationKeys[0] as keyof ComparisonOperator
      const operationValue = (operation as ComparisonOperator)[operationOpt]
      let filteredIDs: InternalDocumentID[] = []

      switch (operationOpt) {
        case 'gt': {
          filteredIDs = node.greaterThan(operationValue as number, false) as unknown as number[]
          break
        }
        case 'gte': {
          filteredIDs = node.greaterThan(operationValue as number, true) as unknown as number[]
          break
        }
        case 'lt': {
          filteredIDs = node.lessThan(operationValue as number, false) as unknown as number[]
          break
        }
        case 'lte': {
          filteredIDs = node.lessThan(operationValue as number, true) as unknown as number[]
          break
        }
        case 'eq': {
          filteredIDs = node.find(operationValue as number) ?? []
          break
        }
        case 'between': {
          const [min, max] = operationValue as number[]
          filteredIDs = node.rangeSearch(min, max) as unknown as number[]
          break
        }
      }

      safeArrayPush(filtersMap[param], filteredIDs)
    }
  }

  // AND operation: calculate the intersection between all the IDs in filterMap
  return intersect(Object.values(filtersMap))
}

export function getSearchableProperties(index: Index): string[] {
  return index.searchableProperties
}

export function getSearchablePropertiesWithTypes(index: Index): Record<string, SearchableType> {
  return index.searchablePropertiesWithTypes
}

export function load<R = unknown>(sharedInternalDocumentStore: InternalDocumentIDStore, raw: R): Index {
  const {
    indexes: rawIndexes,
    vectorIndexes: rawVectorIndexes,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrences,
    avgFieldLength,
    fieldLengths
  } = raw as Index

  const indexes: Index['indexes'] = {}
  const vectorIndexes: Index['vectorIndexes'] = {}

  for (const prop of Object.keys(rawIndexes)) {
    const { node, type, isArray } = rawIndexes[prop]

    switch (type) {
      case 'Radix':
        indexes[prop] = {
          type: 'Radix',
          node: RadixTree.fromJSON(node),
          isArray
        }
        break
      case 'Flat':
        indexes[prop] = {
          type: 'Flat',
          node: FlatTree.fromJSON(node),
          isArray
        }
        break
      case 'AVL':
        indexes[prop] = {
          type: 'AVL',
          node: AVLTree.fromJSON(node),
          isArray
        }
        break
      case 'BKD':
        indexes[prop] = {
          type: 'BKD',
          node: BKDTree.fromJSON(node),
          isArray
        }
        break
      case 'Bool':
        indexes[prop] = {
          type: 'Bool',
          node: BoolNode.fromJSON(node),
          isArray
        }
        break
      default:
        indexes[prop] = rawIndexes[prop]
    }
  }

  for (const idx of Object.keys(rawVectorIndexes)) {
    const vectors = rawVectorIndexes[idx].vectors

    for (const vec in vectors) {
      vectors[vec] = [vectors[vec][0], new Float32Array(vectors[vec][1])]
    }

    vectorIndexes[idx] = {
      size: rawVectorIndexes[idx].size,
      vectors
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
    fieldLengths
  }
}

export function save<R = unknown>(index: Index): R {
  const {
    indexes,
    vectorIndexes,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrences,
    avgFieldLength,
    fieldLengths
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const savedIndexes: any = {}
  for (const name of Object.keys(indexes)) {
    const { type, node, isArray } = indexes[name]
    if (type === 'Flat' || type === 'Radix' || type === 'AVL' || type === 'BKD' || type === 'Bool') {
      savedIndexes[name] = {
        type,
        node: node.toJSON(),
        isArray
      }
    } else {
      savedIndexes[name] = indexes[name]
      savedIndexes[name].node = savedIndexes[name].node.toJSON()
    }
  }

  return {
    indexes: savedIndexes,
    vectorIndexes: vectorIndexesAsArrays,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrences,
    avgFieldLength,
    fieldLengths
  } as R
}

export function createIndex(): IIndex<Index> {
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
    save
  }
}
