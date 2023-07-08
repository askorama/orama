import type { Orama, ScalarSearchableValue, TokenScore, GroupByParams, GroupResult, Result, Reduce } from '../types.js'
import { createError } from '../errors.js'
import { getNested, intersect } from '../utils.js'
import { getDocumentIdFromInternalId } from "./internal-document-id-store.js";

interface PropertyGroup {
  property: string
  perValue: Record<
    string,
    {
      indexes: number[]
      count: number
    }
  >
}

interface Group {
  values: ScalarSearchableValue[]
  indexes: number[]
}

const DEFAULT_REDUCE: Reduce<Result[]> = {
  reducer: (_, acc, res, index) => {
    acc[index] = res
    return acc
  },
  getInitialValue: length => Array.from({ length }),
}

const ALLOWED_TYPES = ['string', 'number', 'boolean']

export async function getGroups<AggValue>(
  orama: Orama,
  results: TokenScore[],
  groupBy: GroupByParams<AggValue>,
): Promise<GroupResult<AggValue>> {
  const properties = groupBy.properties
  const propertiesLength = properties.length

  const schemaProperties = await orama.index.getSearchablePropertiesWithTypes(orama.data.index)
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
  const allDocs = await orama.documentsStore.getMultiple(orama.data.docs, allIDs)
  const allDocsLength = allDocs.length

  const returnedCount = groupBy.maxResult || Number.MAX_SAFE_INTEGER

  const listOfValues: ScalarSearchableValue[][] = []

  // We want to understand which documents have which values
  // and group them by the property and values
  const g: Record<string, PropertyGroup> = {}
  for (let i = 0; i < propertiesLength; i++) {
    const groupByKey = properties[i]
    const group: PropertyGroup = {
      property: groupByKey,
      perValue: {},
    }

    const values: Set<ScalarSearchableValue> = new Set()
    for (let j = 0; j < allDocsLength; j++) {
      const doc = allDocs[j]

      const value = await getNested<ScalarSearchableValue>(doc as object, groupByKey)
      // we don't want to consider undefined values
      if (typeof value === 'undefined') {
        continue
      }
      const keyValue = typeof value !== 'boolean' ? value : '' + value
      if (typeof group.perValue[keyValue] === 'undefined') {
        group.perValue[keyValue] = {
          indexes: [],
          count: 0,
        }
      }
      if (group.perValue[keyValue].count >= returnedCount) {
        // We stop early because for this value we react the limit
        continue
      }

      // We use the index to keep track of the original order
      group.perValue[keyValue].indexes.push(j)
      group.perValue[keyValue].count++

      values.add(value)
    }

    listOfValues.push(Array.from(values))

    g[groupByKey] = group
  }

  const combinations = calculateCombination(listOfValues)
  const combinationsLength = combinations.length

  const groups: Group[] = []
  for (let i = 0; i < combinationsLength; i++) {
    const combination = combinations[i]
    const combinationLength = combination.length

    const group: Group = {
      values: [],
      indexes: [],
    }
    const indexes: number[][] = []
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
  const res: GroupResult<AggValue> = Array.from({ length: groupsLength })
  for (let i = 0; i < groupsLength; i++) {
    const group = groups[i]

    const reduce = (groupBy.reduce || DEFAULT_REDUCE) as Reduce<AggValue>

    const docs = group.indexes.map(index => {
      return {
        id: allIDs[index],
        score: results[index][1],
        document: allDocs[index]!,
      }
    })

    const func = reduce.reducer.bind(null, group.values)
    const initialValue = reduce.getInitialValue(group.indexes.length)
    const aggregationValue = docs.reduce(func, initialValue)

    res[i] = {
      values: group.values,
      result: aggregationValue,
    }
  }

  return res
}

function calculateCombination(arrs: ScalarSearchableValue[][], index = 0): ScalarSearchableValue[][] {
  if (index + 1 === arrs.length) return arrs[index].map(item => [item])

  const head = arrs[index]
  const c = calculateCombination(arrs, index + 1)

  const combinations = []
  for (const value of head) {
    for (const combination of c) {
      combinations.push([value, ...combination])
    }
  }

  return combinations
}
