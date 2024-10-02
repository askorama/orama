import { createError } from '../errors.js'
import { getNested, intersect, safeArrayPush } from '../utils.js'
import { getDocumentIdFromInternalId } from './internal-document-id-store.js'
const DEFAULT_REDUCE = {
  reducer: (_, acc, res, index) => {
    acc[index] = res
    return acc
  },
  getInitialValue: (length) => Array.from({ length })
}
const ALLOWED_TYPES = ['string', 'number', 'boolean']
export function getGroups(orama, results, groupBy) {
  const properties = groupBy.properties
  const propertiesLength = properties.length
  const schemaProperties = orama.index.getSearchablePropertiesWithTypes(orama.data.index)
  for (let i = 0; i < propertiesLength; i++) {
    const property = properties[i]
    if (typeof schemaProperties[property] === 'undefined') {
      throw createError('UNKNOWN_GROUP_BY_PROPERTY', property)
    }
    if (!ALLOWED_TYPES.includes(schemaProperties[property])) {
      throw createError('INVALID_GROUP_BY_PROPERTY', property, ALLOWED_TYPES.join(', '), schemaProperties[property])
    }
  }
  const allIDs = results.map(([id]) => getDocumentIdFromInternalId(orama.internalDocumentIDStore, id))
  // allDocs is already sorted by the sortBy algorithm
  // We leverage on that to limit the number of documents returned
  const allDocs = orama.documentsStore.getMultiple(orama.data.docs, allIDs)
  const allDocsLength = allDocs.length
  const returnedCount = groupBy.maxResult || Number.MAX_SAFE_INTEGER
  const listOfValues = []
  // We want to understand which documents have which values
  // and group them by the property and values
  const g = {}
  for (let i = 0; i < propertiesLength; i++) {
    const groupByKey = properties[i]
    const group = {
      property: groupByKey,
      perValue: {}
    }
    const values = new Set()
    for (let j = 0; j < allDocsLength; j++) {
      const doc = allDocs[j]
      const value = getNested(doc, groupByKey)
      // we don't want to consider undefined values
      if (typeof value === 'undefined') {
        continue
      }
      const keyValue = typeof value !== 'boolean' ? value : '' + value
      const perValue = group.perValue[keyValue] ?? {
        indexes: [],
        count: 0
      }
      if (perValue.count >= returnedCount) {
        // We stop early because for this value we react the limit
        continue
      }
      // We use the index to keep track of the original order
      perValue.indexes.push(j)
      perValue.count++
      group.perValue[keyValue] = perValue
      values.add(value)
    }
    listOfValues.push(Array.from(values))
    g[groupByKey] = group
  }
  const combinations = calculateCombination(listOfValues)
  const combinationsLength = combinations.length
  const groups = []
  for (let i = 0; i < combinationsLength; i++) {
    const combination = combinations[i]
    const combinationLength = combination.length
    const group = {
      values: [],
      indexes: []
    }
    const indexes = []
    for (let j = 0; j < combinationLength; j++) {
      const value = combination[j]
      const property = properties[j]
      indexes.push(g[property].perValue[typeof value !== 'boolean' ? value : '' + value].indexes)
      group.values.push(value)
    }
    // We leverage on the index to sort the results by the original order
    group.indexes = intersect(indexes).sort((a, b) => a - b)
    // don't generate empty groups
    if (group.indexes.length === 0) {
      continue
    }
    groups.push(group)
  }
  const groupsLength = groups.length
  const res = Array.from({ length: groupsLength })
  for (let i = 0; i < groupsLength; i++) {
    const group = groups[i]
    const reduce = groupBy.reduce || DEFAULT_REDUCE
    const docs = group.indexes.map((index) => {
      return {
        id: allIDs[index],
        score: results[index][1],
        document: allDocs[index]
      }
    })
    const func = reduce.reducer.bind(null, group.values)
    const initialValue = reduce.getInitialValue(group.indexes.length)
    const aggregationValue = docs.reduce(func, initialValue)
    res[i] = {
      values: group.values,
      result: aggregationValue
    }
  }
  return res
}
function calculateCombination(arrs, index = 0) {
  if (index + 1 === arrs.length) return arrs[index].map((item) => [item])
  const head = arrs[index]
  const c = calculateCombination(arrs, index + 1)
  const combinations = []
  for (const value of head) {
    for (const combination of c) {
      const result = [value]
      safeArrayPush(result, combination)
      combinations.push(result)
    }
  }
  return combinations
}
//# sourceMappingURL=groups.js.map
