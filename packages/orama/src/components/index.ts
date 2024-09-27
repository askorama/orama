import type {
  AnyIndexStore,
  AnyOrama,
  ArraySearchableType,
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
import { createError } from '../errors.js'
import {
  create as avlCreate,
  find as avlFind,
  greaterThan as avlGreaterThan,
  insert as avlInsert,
  lessThan as avlLessThan,
  rangeSearch as avlRangeSearch,
  removeDocument as avlRemoveDocument,
  AVLTree,
  AVLType
} from '../trees/avl.js'
import {
  create as flatCreate,
  filter as flatFilter,
  filterArr as flatFilterArr,
  insert as flatInsert,
  removeDocument as flatRemoveDocument,
  FlatTree,
  FlatType,
  load as loadFlatNode,
  save as saveFlatNode
} from '../trees/flat.js'
import {
  save as saveRadixTree,
  load as loadRadixTree,
  create as radixCreate,
  find as radixFind,
  insert as radixInsert,
  removeDocumentByWord as radixRemoveDocument,
  RadixTree,
  RadixType
} from '../trees/radix.js'
import {
  create as bkdCreate,
  insert as bkdInsert,
  removeDocByID as bkdRemoveDocByID,
  Point as BKDGeoPoint,
  searchByRadius,
  searchByPolygon,
  BKDTree,
  BKDType
} from '../trees/bkd.js'
import {
  create as boolCreate,
  removeDocument as boolRemoveDocument,
  insert as boolInsert,
  where as boolWhere,
  BoolType,
  BoolTree
} from '../trees/bool.js'

import { convertDistanceToMeters, intersect, safeArrayPush } from '../utils.js'
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

export type Tree =
  | ReturnType<typeof radixCreate>
  | ReturnType<typeof avlCreate<number, InternalDocumentID[]>>
  | ReturnType<typeof flatCreate>
  | ReturnType<typeof bkdCreate>
  | ReturnType<typeof boolCreate>

export interface Index extends AnyIndexStore {
  sharedInternalDocumentStore: InternalDocumentIDStore
  indexes: Record<string, Tree>
  vectorIndexes: Record<string, VectorIndex>
  searchableProperties: string[]
  searchablePropertiesWithTypes: Record<string, SearchableType>
}

/*
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
*/

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
      searchablePropertiesWithTypes: {}
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
          index.indexes[path] = boolCreate(isArray)
          break
        case 'number':
        case 'number[]':
          index.indexes[path] = avlCreate<number, InternalDocumentID[]>(0, [], isArray)
          break
        case 'string':
        case 'string[]':
          index.indexes[path] = radixCreate(false, '', '', isArray)
          break
        case 'enum':
        case 'enum[]':
          index.indexes[path] = flatCreate(isArray)
          break
        case 'geopoint':
          index.indexes[path] = bkdCreate(isArray)
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
  id: DocumentID,
  internalDocumentId: InternalDocumentID,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
  options?: InsertOptions
) {
  return async (value: SearchableValue): Promise<void> => {
    const treeForProperty = index.indexes[prop]
    switch (treeForProperty.type) {
      // enum & bool & enum[] & bool[]
      case FlatType: {
        flatInsert(index.indexes[prop] as FlatTree, value as ScalarSearchableType, internalDocumentId)
        break
      }
      // number & number[]
      case AVLType: {
        const avlRebalanceThreshold = options?.avlRebalanceThreshold ?? 1
        avlInsert(
          index.indexes[prop] as AVLTree<number, InternalDocumentID[]>,
          value as number,
          internalDocumentId,
          avlRebalanceThreshold
        )
        break
      }
      // Geopoint
      case BKDType: {
        bkdInsert(index.indexes[prop] as BKDTree, value as unknown as BKDGeoPoint, [internalDocumentId])
        break
      }
      // string & string[]
      case RadixType: {
        await radixInsert(
          index.indexes[prop] as RadixTree,
          value as string,
          internalDocumentId,
          tokenizer,
          language,
          prop
        )
        break
      }
      case BoolType: {
        await boolInsert(
          index.indexes[prop] as BoolTree,
          internalDocumentId,
          value as boolean
        )
      }
    }
  }
}

export async function insert(
  implementation: IIndex<Index>,
  index: Index,
  prop: string,
  id: DocumentID,
  internalDocumentId: InternalDocumentID,
  value: SearchableValue,
  schemaType: SearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
  options?: InsertOptions
): Promise<void> {
  if (isVectorType(schemaType)) {
    return insertVector(index, prop, value as number[] | Float32Array, id)
  }

  const insertScalar = insertScalarBuilder(
    implementation,
    index,
    prop,
    id,
    internalDocumentId,
    language,
    tokenizer,
    docsCount,
    options
  )

  if (!isArrayType(schemaType)) {
    return insertScalar(value)
  }

  const elements = value as Array<string | number | boolean>
  const elementsLength = elements.length
  for (let i = 0; i < elementsLength; i++) {
    await insertScalar(elements[i])
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
): Promise<boolean> {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)

  if (isVectorType(schemaType)) {
    delete index.vectorIndexes[prop].vectors[id]
    return true
  }

  const { type } = index.indexes[prop]
  switch (type) {
    case AVLType: {
      avlRemoveDocument(index.indexes[prop], internalId, value as number)
      return true
    }
    case RadixType: {
      const tokens = await tokenizer.tokenize(value as string, language, prop)

      for (const token of tokens) {
        radixRemoveDocument(index.indexes[prop], token, internalId)
      }

      return true
    }
    case FlatType: {
      flatRemoveDocument(index.indexes[prop], internalId, value as ScalarSearchableType)
      return true
    }
    case BoolType: {
      boolRemoveDocument(index.indexes[prop], internalId, value as ScalarSearchableType)
      return true
    }
    case BKDType: {
      bkdRemoveDocByID(index.indexes[prop], value as unknown as BKDGeoPoint, internalId)
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
    )
  }

  const innerSchemaType = getInnerType(schemaType as ArraySearchableType)

  const elements = value as Array<string | number | boolean>
  const elementsLength = elements.length
  for (let i = 0; i < elementsLength; i++) {
    await removeScalar(implementation, index, prop, id, elements[i], innerSchemaType, language, tokenizer)
  }

  return true
}

const BIT_MASK_20 = 0b11111111111111111111

export function bitmask_20(n: number) {
  return n & BIT_MASK_20
}
export function count(n: number) {
  return n >> 20
}
function numberOfOnes(n: number) {
  let i = 0
  do {
    if (n & 1) {
      ++i
    }
  } while ((n >>= 1))
  return i
}

function searchInProperty(
  tree: RadixTree,
  tokens: string[],
  exact: boolean,
  tolerance: number,
  resultsMap: Map<number, number>,
  boostPerProperty: number
) {
  let foundWords = {} as Record<string, number[]>

  for (const word of tokens) {
    const searchResult = radixFind(tree, { term: word, exact, tolerance })

    foundWords = {
      ...foundWords,
      ...searchResult
    }
  }

  const foundKeys = Object.getOwnPropertyNames(foundWords)

  const foundKeysLength = foundKeys.length
  const resultMap = new Map<number, [number, number[]]>()
  for (let i = 0; i < foundKeysLength; i++) {
    const key = foundKeys[i]
    const matchedDocs = foundWords[key]
    const matchedDocsLength = matchedDocs.length
    const isExactMatch = tokens.includes(key)

    for (let j = 0; j < matchedDocsLength; j++) {
      const docId = matchedDocs[j]

      const numberOfQuantums = tree.tokensLength.get(docId)!
      const tokenQuantumDescriptor = tree.tokenQuantums[docId][key]

      const occurrence = count(tokenQuantumDescriptor)
      const bitMask = bitmask_20(tokenQuantumDescriptor)

      const score = ((occurrence * occurrence) / numberOfQuantums + (isExactMatch ? 1 : 0)) * boostPerProperty

      if (!resultMap.has(docId)) {
        resultMap.set(docId, [score, [bitMask]])
        continue
      }

      const current = resultMap.get(docId)!
      let totalScore = current[0] + score
      const othersMatches = current[1]
      const othersLength = othersMatches.length
      for (let k = 0; k < othersLength; k++) {
        const other = othersMatches[k]
        if (other & bitMask) {
          totalScore += numberOfOnes(other & bitMask) * 2
        }
      }
      othersMatches.push(tokenQuantumDescriptor)
      current[0] = totalScore
    }
  }

  for (const [id, [score]] of resultMap.entries()) {
    if (resultsMap.has(id)) {
      resultsMap.set(id, resultsMap.get(id)! + score)
    } else {
      resultsMap.set(id, score)
    }
  }
}

export async function search(
  index: Index,
  term: string,
  tokenizer: Tokenizer,
  language: string | undefined,
  propertiesToSearch: string[],
  exact: boolean,
  tolerance: number,
  boost: Record<string, number>
): Promise<TokenScore[]> {
  const tokens = await tokenizer.tokenize(term, language)

  const resultsMap = new Map<number, number>()
  for (const prop of propertiesToSearch) {
    if (!(prop in index.indexes)) {
      continue
    }

    const tree = index.indexes[prop] as RadixTree
    const { type } = tree
    if (type !== RadixType) {
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

    searchInProperty(tree, tokens, exact, tolerance, resultsMap, boostPerProperty)
  }

  return Array.from(resultsMap)
}

export async function searchByWhereClause<T extends AnyOrama>(
  index: Index,
  tokenizer: Tokenizer,
  filters: Partial<WhereCondition<T['schema']>>,
  language: string | undefined
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

    const { type, isArray } = index.indexes[param]

    if (type === BoolType) {
      safeArrayPush(filtersMap[param], boolWhere(index.indexes[param], operation as boolean))
      continue
    }

    if (type === BKDType) {
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
          index.indexes[param].root,
          coordinates as BKDGeoPoint,
          distanceInMeters,
          inside,
          undefined,
          highPrecision
        )
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
        const ids = searchByPolygon(
          index.indexes[param].root,
          coordinates as BKDGeoPoint[],
          inside,
          undefined,
          highPrecision
        )
        // @todo: convert this into a for loop
        safeArrayPush(
          filtersMap[param],
          ids.flatMap(({ docIDs }) => docIDs)
        )
      }

      continue
    }

    if (type === RadixType && (typeof operation === 'string' || Array.isArray(operation))) {
      for (const raw of [operation].flat()) {
        const term = await tokenizer.tokenize(raw, language, param)
        for (const t of term) {
          const filteredIDsResults = radixFind(index.indexes[param], { term: t, exact: true })
          safeArrayPush(filtersMap[param], Object.values(filteredIDsResults).flat())
        }
      }

      continue
    }

    const operationKeys = Object.keys(operation)

    if (operationKeys.length > 1) {
      throw createError('INVALID_FILTER_OPERATION', operationKeys.length)
    }

    if (type === FlatType) {
      const flatOperation = isArray ? flatFilterArr : flatFilter
      safeArrayPush(
        filtersMap[param],
        flatOperation(index.indexes[param], operation as EnumComparisonOperator & EnumArrComparisonOperator)
      )

      continue
    }

    if (type === AVLType) {
      const operationOpt = operationKeys[0] as keyof ComparisonOperator
      const operationValue = (operation as ComparisonOperator)[operationOpt]
      let filteredIDs: InternalDocumentID[] = []

      switch (operationOpt) {
        case 'gt': {
          filteredIDs = avlGreaterThan(index.indexes[param], operationValue, false)
          break
        }
        case 'gte': {
          filteredIDs = avlGreaterThan(index.indexes[param], operationValue, true)
          break
        }
        case 'lt': {
          filteredIDs = avlLessThan(index.indexes[param], operationValue, false)
          break
        }
        case 'lte': {
          filteredIDs = avlLessThan(index.indexes[param], operationValue, true)
          break
        }
        case 'eq': {
          filteredIDs = avlFind(index.indexes[param], operationValue) ?? []
          break
        }
        case 'between': {
          const [min, max] = operationValue as number[]
          filteredIDs = avlRangeSearch(index.indexes[param], min, max)
          break
        }
      }

      safeArrayPush(filtersMap[param], filteredIDs)
    }
  }

  // AND operation: calculate the intersection between all the IDs in filterMap
  return intersect(Object.values(filtersMap))
}

export async function getSearchableProperties(index: Index): Promise<string[]> {
  return index.searchableProperties
}

export async function getSearchablePropertiesWithTypes(index: Index): Promise<Record<string, SearchableType>> {
  return index.searchablePropertiesWithTypes
}

export async function load<R = unknown>(sharedInternalDocumentStore: InternalDocumentIDStore, raw: R): Promise<Index> {
  const {
    indexes: rawIndexes,
    vectorIndexes: rawVectorIndexes,
    searchableProperties,
    searchablePropertiesWithTypes
  } = raw as Index

  const indexes: Index['indexes'] = {}
  const vectorIndexes: Index['vectorIndexes'] = {}

  for (const prop of Object.keys(rawIndexes)) {
    const { type } = rawIndexes[prop]

    switch (type) {
      case RadixType:
        indexes[prop] = loadRadixTree(rawIndexes[prop])
        break
      case FlatType:
        indexes[prop] = loadFlatNode(rawIndexes[prop])
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
    searchablePropertiesWithTypes
  }
}

export async function save<R = unknown>(index: Index): Promise<R> {
  const { indexes, vectorIndexes, searchableProperties, searchablePropertiesWithTypes } = index

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
    const { type } = indexes[name]
    switch (type) {
      case RadixType:
        savedIndexes[name] = saveRadixTree(indexes[name])
        break
      case FlatType:
        savedIndexes[name] = saveFlatNode(indexes[name])
        break
      default:
        savedIndexes[name] = indexes[name]
        break
    }
  }

  return {
    indexes: savedIndexes,
    vectorIndexes: vectorIndexesAsArrays,
    searchableProperties,
    searchablePropertiesWithTypes
  } as R
}

export async function createIndex(): Promise<IIndex<Index>> {
  return {
    create,
    insert,
    remove,
    search,
    searchByWhereClause,
    getSearchableProperties,
    getSearchablePropertiesWithTypes,
    load,
    save
  }
}
