import type { Orama, ScalarSearchableValue, TokenScore, GroupByParams, GroupResult, Result } from '../types.js'
import { getNested, intersect } from '../utils.js'

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

const DEFAULT_REDUCE = {
  reducer: (_: ScalarSearchableValue[], acc: unknown, res: Result, index: number) => {
    (acc as Result[])[index] = res
    return acc
  },
  getInitialValue: (length: number) => Array.from({ length }),
}

export async function getGroups(orama: Orama, results: TokenScore[], by: GroupByParams): Promise<GroupResult> {
  const groupBy = by!
  const allIDs = results.map(([id]) => id)

  // allDocs is already sorted by the sortBy algorithm
  // We leverage on that to limit the number of documents returned
  const allDocs = await orama.documentsStore.getMultiple(orama.data.docs, allIDs)
  const allDocsLength = allDocs.length

  const returnedCount = groupBy.maxResult || Number.MAX_SAFE_INTEGER
  const properties = groupBy.property ? [groupBy.property] : groupBy.properties || []
  const propertiesLength = properties.length

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

  const groups: {
    values: ScalarSearchableValue[]
    indexes: number[]
  }[] = []
  for (let i = 0; i < combinationsLength; i++) {
    const combination = combinations[i]
    const combinationLength = combination.length

    const group: {
      values: ScalarSearchableValue[]
      indexes: number[]
    } = {
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

  const res: GroupResult = []

  const groupsLength = groups.length
  for (let i = 0; i < groupsLength; i++) {
    const group = groups[i]

    const reduce = groupBy.reduce || DEFAULT_REDUCE

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

    res.push({
      values: group.values,
      result: aggregationValue,
    })
  }

  return res
}

function calculateCombination(arrs: ScalarSearchableValue[][]): ScalarSearchableValue[][] {
  const result: ScalarSearchableValue[][] = []
  const arrays = arrs.slice()
  const array = arrays.shift()
  if (array) {
    for (const elem of array) {
      result.push([elem])
    }
  }
  const arraysLength = arrays.length
  for (let i = 0; i < arraysLength; i++) {
    const array = arrays[i]
    const arrayLength = array.length
    const newResult = []
    for (let j = 0; j < arrayLength; j++) {
      const elem = array[j]
      for (const r of result) {
        newResult.push([...r, elem])
      }
    }
    result.length = 0
    result.push(...newResult)
  }

  return result
}
