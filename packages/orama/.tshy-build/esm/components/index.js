import { createError } from '../errors.js'
import {
  create as avlCreate,
  find as avlFind,
  greaterThan as avlGreaterThan,
  insert as avlInsert,
  lessThan as avlLessThan,
  rangeSearch as avlRangeSearch,
  removeDocument as avlRemoveDocument
} from '../trees/avl.js'
import {
  create as flatCreate,
  filter as flatFilter,
  filterArr as flatFilterArr,
  insert as flatInsert,
  removeDocument as flatRemoveDocument
} from '../trees/flat.js'
import {
  create as radixCreate,
  find as radixFind,
  insert as radixInsert,
  removeDocumentByWord as radixRemoveDocument
} from '../trees/radix.js'
import {
  create as bkdCreate,
  insert as bkdInsert,
  removeDocByID as bkdRemoveDocByID,
  searchByRadius,
  searchByPolygon
} from '../trees/bkd.js'
import { convertDistanceToMeters, intersect, safeArrayPush, getOwnProperty } from '../utils.js'
import { BM25 } from './algorithms.js'
import { getMagnitude } from './cosine-similarity.js'
import { getInnerType, getVectorSize, isArrayType, isVectorType } from './defaults.js'
import { getInternalDocumentId } from './internal-document-id-store.js'
export function insertDocumentScoreParameters(index, prop, id, tokens, docsCount) {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)
  index.avgFieldLength[prop] = ((index.avgFieldLength[prop] ?? 0) * (docsCount - 1) + tokens.length) / docsCount
  index.fieldLengths[prop][internalId] = tokens.length
  index.frequencies[prop][internalId] = {}
}
export function insertTokenScoreParameters(index, prop, id, tokens, token) {
  let tokenFrequency = 0
  for (const t of tokens) {
    if (t === token) {
      tokenFrequency++
    }
  }
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)
  const tf = tokenFrequency / tokens.length
  index.frequencies[prop][internalId][token] = tf
  if (!(token in index.tokenOccurrences[prop])) {
    index.tokenOccurrences[prop][token] = 0
  }
  // increase a token counter that may not yet exist
  index.tokenOccurrences[prop][token] = (index.tokenOccurrences[prop][token] ?? 0) + 1
}
export function removeDocumentScoreParameters(index, prop, id, docsCount) {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)
  if (docsCount > 1) {
    index.avgFieldLength[prop] =
      (index.avgFieldLength[prop] * docsCount - index.fieldLengths[prop][internalId]) / (docsCount - 1)
  } else {
    index.avgFieldLength[prop] = undefined
  }
  index.fieldLengths[prop][internalId] = undefined
  index.frequencies[prop][internalId] = undefined
}
export function removeTokenScoreParameters(index, prop, token) {
  index.tokenOccurrences[prop][token]--
}
export function calculateResultScores(context, index, prop, term, ids) {
  const documentIDs = Array.from(ids)
  // Exact fields for TF-IDF
  const avgFieldLength = index.avgFieldLength[prop]
  const fieldLengths = index.fieldLengths[prop]
  const oramaOccurrences = index.tokenOccurrences[prop]
  const oramaFrequencies = index.frequencies[prop]
  // oramaOccurrences[term] can be undefined, 0, string, or { [k: string]: number }
  const termOccurrences = typeof oramaOccurrences[term] === 'number' ? oramaOccurrences[term] ?? 0 : 0
  const scoreList = []
  // Calculate TF-IDF value for each term, in each document, for each index.
  const documentIDsLength = documentIDs.length
  for (let k = 0; k < documentIDsLength; k++) {
    const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, documentIDs[k])
    const tf = oramaFrequencies?.[internalId]?.[term] ?? 0
    const bm25 = BM25(
      tf,
      termOccurrences,
      context.docsCount,
      fieldLengths[internalId],
      avgFieldLength,
      context.params.relevance
    )
    scoreList.push([internalId, bm25])
  }
  return scoreList
}
export function create(orama, sharedInternalDocumentStore, schema, index, prefix = '') {
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
  for (const [prop, type] of Object.entries(schema)) {
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
      const isArray = /\[/.test(type)
      switch (type) {
        case 'boolean':
        case 'boolean[]':
          index.indexes[path] = { type: 'Bool', node: { true: [], false: [] }, isArray }
          break
        case 'number':
        case 'number[]':
          index.indexes[path] = { type: 'AVL', node: avlCreate(0, []), isArray }
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
function insertScalarBuilder(implementation, index, prop, id, language, tokenizer, docsCount, options) {
  return (value) => {
    const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)
    const { type, node } = index.indexes[prop]
    switch (type) {
      case 'Bool': {
        node[value ? 'true' : 'false'].push(internalId)
        break
      }
      case 'AVL': {
        const avlRebalanceThreshold = options?.avlRebalanceThreshold ?? 1
        avlInsert(node, value, [internalId], avlRebalanceThreshold)
        break
      }
      case 'Radix': {
        const tokens = tokenizer.tokenize(value, language, prop)
        implementation.insertDocumentScoreParameters(index, prop, internalId, tokens, docsCount)
        for (const token of tokens) {
          implementation.insertTokenScoreParameters(index, prop, internalId, tokens, token)
          radixInsert(node, token, internalId)
        }
        break
      }
      case 'Flat': {
        flatInsert(node, value, internalId)
        break
      }
      case 'BKD': {
        bkdInsert(node, value, [internalId])
        break
      }
    }
  }
}
export function insert(implementation, index, prop, id, value, schemaType, language, tokenizer, docsCount, options) {
  if (isVectorType(schemaType)) {
    return insertVector(index, prop, value, id)
  }
  const insertScalar = insertScalarBuilder(implementation, index, prop, id, language, tokenizer, docsCount, options)
  if (!isArrayType(schemaType)) {
    return insertScalar(value)
  }
  const elements = value
  const elementsLength = elements.length
  for (let i = 0; i < elementsLength; i++) {
    insertScalar(elements[i])
  }
}
function insertVector(index, prop, value, id) {
  if (!(value instanceof Float32Array)) {
    value = new Float32Array(value)
  }
  const size = index.vectorIndexes[prop].size
  const magnitude = getMagnitude(value, size)
  index.vectorIndexes[prop].vectors[id] = [magnitude, value]
}
function removeScalar(implementation, index, prop, id, value, schemaType, language, tokenizer, docsCount) {
  const internalId = getInternalDocumentId(index.sharedInternalDocumentStore, id)
  if (isVectorType(schemaType)) {
    delete index.vectorIndexes[prop].vectors[id]
    return true
  }
  const { type, node } = index.indexes[prop]
  switch (type) {
    case 'AVL': {
      avlRemoveDocument(node, internalId, value)
      return true
    }
    case 'Bool': {
      const booleanKey = value ? 'true' : 'false'
      const position = node[booleanKey].indexOf(internalId)
      node[value ? 'true' : 'false'].splice(position, 1)
      return true
    }
    case 'Radix': {
      const tokens = tokenizer.tokenize(value, language, prop)
      implementation.removeDocumentScoreParameters(index, prop, id, docsCount)
      for (const token of tokens) {
        implementation.removeTokenScoreParameters(index, prop, token)
        radixRemoveDocument(node, token, internalId)
      }
      return true
    }
    case 'Flat': {
      flatRemoveDocument(node, internalId, value)
      return true
    }
    case 'BKD': {
      bkdRemoveDocByID(node, value, internalId)
      return false
    }
  }
}
export function remove(implementation, index, prop, id, value, schemaType, language, tokenizer, docsCount) {
  if (!isArrayType(schemaType)) {
    return removeScalar(implementation, index, prop, id, value, schemaType, language, tokenizer, docsCount)
  }
  const innerSchemaType = getInnerType(schemaType)
  const elements = value
  const elementsLength = elements.length
  for (let i = 0; i < elementsLength; i++) {
    removeScalar(implementation, index, prop, id, elements[i], innerSchemaType, language, tokenizer, docsCount)
  }
  return true
}
export function search(context, index, prop, term) {
  if (!(prop in index.tokenOccurrences)) {
    return []
  }
  const { node, type } = index.indexes[prop]
  if (type !== 'Radix') {
    throw createError('WRONG_SEARCH_PROPERTY_TYPE', prop)
  }
  const { exact, tolerance } = context.params
  const searchResult = radixFind(node, { term, exact, tolerance })
  const ids = new Set()
  for (const key in searchResult) {
    //skip keys inherited from prototype
    const ownProperty = getOwnProperty(searchResult, key)
    if (!ownProperty) continue
    for (const id of searchResult[key]) {
      ids.add(id)
    }
  }
  return context.index.calculateResultScores(context, index, prop, term, Array.from(ids))
}
export function searchByWhereClause(context, index, filters) {
  const filterKeys = Object.keys(filters)
  const filtersMap = filterKeys.reduce(
    (acc, key) => ({
      [key]: [],
      ...acc
    }),
    {}
  )
  for (const param of filterKeys) {
    const operation = filters[param]
    if (typeof index.indexes[param] === 'undefined') {
      throw createError('UNKNOWN_FILTER_PROPERTY', param)
    }
    const { node, type, isArray } = index.indexes[param]
    if (type === 'Bool') {
      const idx = node
      const filteredIDs = idx[operation.toString()]
      safeArrayPush(filtersMap[param], filteredIDs)
      continue
    }
    if (type === 'BKD') {
      let reqOperation
      if ('radius' in operation) {
        reqOperation = 'radius'
      } else if ('polygon' in operation) {
        reqOperation = 'polygon'
      } else {
        throw new Error(`Invalid operation ${operation}`)
      }
      if (reqOperation === 'radius') {
        const { value, coordinates, unit = 'm', inside = true, highPrecision = false } = operation[reqOperation]
        const distanceInMeters = convertDistanceToMeters(value, unit)
        const ids = searchByRadius(node.root, coordinates, distanceInMeters, inside, undefined, highPrecision)
        // @todo: convert this into a for loop
        safeArrayPush(
          filtersMap[param],
          ids.flatMap(({ docIDs }) => docIDs)
        )
      } else {
        const { coordinates, inside = true, highPrecision = false } = operation[reqOperation]
        const ids = searchByPolygon(node.root, coordinates, inside, undefined, highPrecision)
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
        const term = context.tokenizer.tokenize(raw, context.language, param)
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
      const flatOperation = isArray ? flatFilterArr : flatFilter
      safeArrayPush(filtersMap[param], flatOperation(node, operation))
      continue
    }
    if (type === 'AVL') {
      const operationOpt = operationKeys[0]
      const operationValue = operation[operationOpt]
      let filteredIDs = []
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
          const [min, max] = operationValue
          filteredIDs = avlRangeSearch(node, min, max)
          break
        }
      }
      safeArrayPush(filtersMap[param], filteredIDs)
    }
  }
  // AND operation: calculate the intersection between all the IDs in filterMap
  return intersect(Object.values(filtersMap))
}
export function getSearchableProperties(index) {
  return index.searchableProperties
}
export function getSearchablePropertiesWithTypes(index) {
  return index.searchablePropertiesWithTypes
}
function loadRadixNode(node) {
  const convertedNode = radixCreate(node.e, node.s, node.k)
  convertedNode.d = node.d
  convertedNode.w = node.w
  for (const childrenKey of Object.keys(node.c)) {
    convertedNode.c[childrenKey] = loadRadixNode(node.c[childrenKey])
  }
  return convertedNode
}
function loadFlatNode(node) {
  return {
    numberToDocumentId: new Map(node)
  }
}
function saveFlatNode(node) {
  return Array.from(node.numberToDocumentId.entries())
}
export function load(sharedInternalDocumentStore, raw) {
  const {
    indexes: rawIndexes,
    vectorIndexes: rawVectorIndexes,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrences,
    avgFieldLength,
    fieldLengths
  } = raw
  const indexes = {}
  const vectorIndexes = {}
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
export function save(index) {
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
  const vectorIndexesAsArrays = {}
  for (const idx of Object.keys(vectorIndexes)) {
    const vectors = vectorIndexes[idx].vectors
    for (const vec in vectors) {
      vectors[vec] = [vectors[vec][0], Array.from(vectors[vec][1])]
    }
    vectorIndexesAsArrays[idx] = {
      size: vectorIndexes[idx].size,
      vectors
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const savedIndexes = {}
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
  }
}
export function createIndex() {
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
//# sourceMappingURL=index.js.map
