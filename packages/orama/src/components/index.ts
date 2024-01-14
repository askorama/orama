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
  SearchContext,
  SearchParamsFullText,
  Tokenizer,
  TokenScore,
  TypedDocument,
  VectorIndex,
  VectorType,
  WhereCondition
} from '../types.js'
import { createError } from '../errors.js'
import {
  create as avlCreate,
  find as avlFind,
  greaterThan as avlGreaterThan,
  insert as avlInsert,
  lessThan as avlLessThan,
  RootNode as AVLRootNode,
  rangeSearch as avlRangeSearch,
  removeDocument as avlRemoveDocument
} from '../trees/avl.js'
import {
  create as flatCreate,
  filter as flatFilter,
  filterArr as flatFilterArr,
  insert as flatInsert,
  removeDocument as flatRemoveDocument,
  FlatTree
} from '../trees/flat.js'
import {
  create as radixCreate,
  find as radixFind,
  insert as radixInsert,
  Node as RadixNode,
  removeDocumentByWord as radixRemoveDocument
} from '../trees/radix.js'
import {
  create as bkdCreate,
  insert as bkdInsert,
  removeDocByID as bkdRemoveDocByID,
  RootNode as BKDNode,
  Point as BKDGeoPoint,
  searchByRadius,
  searchByPolygon
} from '../trees/bkd.js'

import { convertDistanceToMeters, intersect, safeArrayPush, getOwnProperty } from '../utils.js'
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

export type BooleanIndex = {
  true: InternalDocumentID[]
  false: InternalDocumentID[]
}

export type TreeType = 'AVL' | 'Radix' | 'Bool' | 'Flat' | 'BKD'

export type TTree<T = TreeType, N = unknown> = {
  type: T
  node: N
  isArray: boolean
}

export type Tree =
  | TTree<'Radix', RadixNode>
  | TTree<'AVL', AVLRootNode<number, InternalDocumentID[]>>
  | TTree<'Bool', BooleanIndex>
  | TTree<'Flat', FlatTree>
  | TTree<'BKD', BKDNode>

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

export async function insertDocumentScoreParameters(
  index: Index,
  prop: string,
  id: DocumentID,
  tokens: string[],
  docsCount: number
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
  token: string
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
  docsCount: number
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

export async function calculateResultScores<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  context: SearchContext<T, ResultDocument, SearchParamsFullText<T, ResultDocument>>,
  index: Index,
  prop: string,
  term: string,
  ids: DocumentID[]
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
      context.params.relevance! as Required<BM25Params>
    )

    scoreList.push([internalId, bm25])
  }
  return scoreList
}

export async function create<T extends AnyOrama, TSchema extends T['schema']>(
  orama: T,
  sharedInternalDocumentStore: T['internalDocumentIDStore'],
  schema: TSchema,
  index?: Index,
  prefix = ''
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
          index.indexes[path] = { type: 'Bool', node: { true: [], false: [] }, isArray }
          break
        case 'number':
        case 'number[]':
          index.indexes[path] = { type: 'AVL', node: avlCreate<number, InternalDocumentID[]>(0, []), isArray }
          break
        case 'string':
        case 'string[]':
          index.indexes[path] = { type: 'Radix', node: radixCreate(), isArray }
          index.avgFieldLength[path] = 0
          index.frequencies[path] = {}
          index.tokenOccurrences[path] = {}
          index.fieldLengths[path] = {}
          break
        case 'enum':
        case 'enum[]':
          index.indexes[path] = { type: 'Flat', node: flatCreate(), isArray }
          break
        case 'geopoint':
          index.indexes[path] = { type: 'BKD', node: bkdCreate(), isArray }
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

async function insertScalar(
  implementation: IIndex<Index>,
  index: Index,
  prop: string,
  id: DocumentID,
  value: SearchableValue,
  schemaType: ScalarSearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number
): Promise<void> {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)

  const { type, node } = index.indexes[prop]
  switch (type) {
    case 'Bool': {
      node[value ? 'true' : 'false'].push(internalId)
      break
    }
    case 'AVL': {
      avlInsert(node, value as number, [internalId])
      break
    }
    case 'Radix': {
      const tokens = await tokenizer.tokenize(value as string, language, prop)
      await implementation.insertDocumentScoreParameters(index, prop, internalId, tokens, docsCount)

      for (const token of tokens) {
        await implementation.insertTokenScoreParameters(index, prop, internalId, tokens, token)

        radixInsert(node, token, internalId)
      }

      break
    }
    case 'Flat': {
      flatInsert(node, value as ScalarSearchableType, internalId)
      break
    }
    case 'BKD': {
      bkdInsert(node, value as unknown as BKDGeoPoint, [internalId])
      break
    }
  }
}

export async function insert(
  implementation: IIndex<Index>,
  index: Index,
  prop: string,
  id: DocumentID,
  value: SearchableValue,
  schemaType: SearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number
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
      docsCount
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
  docsCount: number
): Promise<boolean> {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)

  if (isVectorType(schemaType)) {
    delete index.vectorIndexes[prop].vectors[id]
    return true
  }

  const { type, node } = index.indexes[prop]
  switch (type) {
    case 'AVL': {
      avlRemoveDocument(node, internalId, value as number)
      return true
    }
    case 'Bool': {
      const booleanKey = value ? 'true' : 'false'
      const position = node[booleanKey].indexOf(internalId)

      node[value ? 'true' : 'false'].splice(position, 1)
      return true
    }
    case 'Radix': {
      const tokens = await tokenizer.tokenize(value as string, language, prop)

      await implementation.removeDocumentScoreParameters(index, prop, id, docsCount)

      for (const token of tokens) {
        await implementation.removeTokenScoreParameters(index, prop, token)
        radixRemoveDocument(node, token, internalId)
      }

      return true
    }
    case 'Flat': {
      flatRemoveDocument(node, internalId, value as ScalarSearchableType)
      return true
    }
    case 'BKD': {
      bkdRemoveDocByID(node, value as unknown as BKDGeoPoint, internalId)
      return false
    }
  }
}

export async function remove(
  implementation: IIndex<Index>,
  index: Index,
  prop: string,
  id: DocumentID,
  value: SearchableValue,
  schemaType: SearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number
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
      docsCount
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

export async function search<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  context: SearchContext<T, ResultDocument, SearchParamsFullText<T, ResultDocument>>,
  index: Index,
  prop: string,
  term: string
): Promise<TokenScore[]> {
  if (!(prop in index.tokenOccurrences)) {
    return []
  }

  const { node, type } = index.indexes[prop]
  if (type !== 'Radix') {
    throw createError('WRONG_SEARCH_PROPERTY_TYPE', prop)
  }

  const { exact, tolerance } = context.params
  const searchResult = radixFind(node, { term, exact, tolerance })
  const ids = new Set<InternalDocumentID>()

  for(const key in searchResult){
    //skip keys inherited from prototype
    const ownProperty = getOwnProperty(searchResult, key);
    if(!ownProperty) continue;

    for (const id of searchResult[key]){
        ids.add(id);
    }
  }

  return context.index.calculateResultScores(context, index, prop, term, Array.from(ids))
}

export async function searchByWhereClause<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  context: SearchContext<T, ResultDocument>,
  index: Index,
  filters: Partial<WhereCondition<T['schema']>>
): Promise<number[]> {
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
      const filteredIDs = idx[operation.toString() as keyof BooleanIndex]
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
        const ids = searchByRadius(
          node.root,
          coordinates as BKDGeoPoint,
          distanceInMeters,
          inside,
          undefined,
          highPrecision
        )
        // @todo: convert this into a for loop
        safeArrayPush(filtersMap[param], ids.map(({ docIDs }) => docIDs).flat())
      } else {
        const {
          coordinates,
          inside = true,
          highPrecision = false
        } = operation[reqOperation] as GeosearchPolygonOperator['polygon']
        const ids = searchByPolygon(node.root, coordinates as BKDGeoPoint[], inside, undefined, highPrecision)
        // @todo: convert this into a for loop
        safeArrayPush(filtersMap[param], ids.map(({ docIDs }) => docIDs).flat())
      }

      continue
    }

    if (type === 'Radix' && (typeof operation === 'string' || Array.isArray(operation))) {
      for (const raw of [operation].flat()) {
        const term = await context.tokenizer.tokenize(raw, context.language, param)
        for (const t of term) {
          const filteredIDsResults = radixFind(node, { term: t, exact: true })
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
      if (isArray) {
        safeArrayPush(filtersMap[param], flatFilterArr(node, operation as EnumArrComparisonOperator))
      } else {
        safeArrayPush(filtersMap[param], flatFilter(node, operation as EnumComparisonOperator))
      }
      continue
    }

    if (type === 'AVL') {
      const operationOpt = operationKeys[0] as keyof ComparisonOperator
      const operationValue = (operation as ComparisonOperator)[operationOpt]
      let filteredIDs: InternalDocumentID[] = []

      switch (operationOpt) {
        case 'gt': {
          filteredIDs = avlGreaterThan(node, operationValue, false)
          break
        }
        case 'gte': {
          filteredIDs = avlGreaterThan(node, operationValue, true)
          break
        }
        case 'lt': {
          filteredIDs = avlLessThan(node, operationValue, false)
          break
        }
        case 'lte': {
          filteredIDs = avlLessThan(node, operationValue, true)
          break
        }
        case 'eq': {
          filteredIDs = avlFind(node, operationValue) ?? []
          break
        }
        case 'between': {
          const [min, max] = operationValue as number[]
          filteredIDs = avlRangeSearch(node, min, max)
          break
        }
      }

      safeArrayPush(filtersMap[param], filteredIDs)
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

function loadRadixNode(node: RadixNode): RadixNode {
  const convertedNode = radixCreate(node.e, node.s, node.k)

  convertedNode.d = node.d
  convertedNode.w = node.w

  for (const childrenKey of Object.keys(node.c)) {
    convertedNode.c[childrenKey] = loadRadixNode(node.c[childrenKey])
  }

  return convertedNode
}

function loadFlatNode(node: unknown): FlatTree {
  return {
    numberToDocumentId: new Map(node as [ScalarSearchableType, InternalDocumentID[]][])
  }
}

function saveFlatNode(node: FlatTree): unknown {
  return Array.from(node.numberToDocumentId.entries())
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
          node: loadRadixNode(node),
          isArray
        }
        break
      case 'Flat':
        indexes[prop] = {
          type: 'Flat',
          node: loadFlatNode(node),
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

export async function save<R = unknown>(index: Index): Promise<R> {
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
    if (type !== 'Flat') {
      savedIndexes[name] = indexes[name]
      continue
    }
    savedIndexes[name] = {
      type: 'Flat',
      node: saveFlatNode(node),
      isArray
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

export async function createIndex(): Promise<IIndex<Index>> {
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
