import { createError } from '../errors.js'
import type {
  AnyOrama,
  FacetResult,
  FacetSorting,
  FacetsParams,
  NumberFacetDefinition,
  SearchableValue,
  StringFacetDefinition,
  TokenScore
} from '../types.js'
import { getNested } from '../utils.js'

type FacetValue = string | boolean | number

function sortingPredicate(order: FacetSorting = 'desc', a: [string, number], b: [string, number]) {
  if (order.toLowerCase() === 'asc') {
    return a[1] - b[1]
  } else {
    return b[1] - a[1]
  }
}

export async function getFacets<T extends AnyOrama>(
  orama: T,
  results: TokenScore[],
  facetsConfig: FacetsParams<T>
): Promise<FacetResult> {
  const facets: FacetResult = {}
  const allIDs = results.map(([id]) => id)
  const allDocs = await orama.documentsStore.getMultiple(orama.data.docs, allIDs)
  const facetKeys = Object.keys(facetsConfig!)

  const properties = await orama.index.getSearchablePropertiesWithTypes(orama.data.index)

  for (const facet of facetKeys) {
    let values = {}

    // Hack to guarantee the same order of ranges as specified by the user
    // TODO: Revisit this once components land
    if (properties[facet] === 'number') {
      const { ranges } = facetsConfig[facet] as NumberFacetDefinition
      const tmp: [string, number][] = []
      for (const range of ranges) {
        tmp.push([`${range.from}-${range.to}`, 0])
      }
      values = Object.fromEntries(tmp)
    }

    facets[facet] = {
      count: 0,
      values
    }
  }

  const allDocsLength = allDocs.length
  for (let i = 0; i < allDocsLength; i++) {
    const doc = allDocs[i]

    for (const facet of facetKeys) {
      const facetValue = facet.includes('.')
        ? (await getNested<string>(doc!, facet))!
        : (doc![facet] as SearchableValue)

      const propertyType = properties[facet]
      switch (propertyType) {
        case 'number': {
          const ranges = (facetsConfig[facet] as NumberFacetDefinition).ranges
          calculateNumberFacet(ranges, facets[facet].values, facetValue as number)
          break
        }
        case 'number[]': {
          const alreadyInsertedValues = new Set<string>()
          const ranges = (facetsConfig[facet] as NumberFacetDefinition).ranges
          for (const v of facetValue as Array<number>) {
            calculateNumberFacet(ranges, facets[facet].values, v, alreadyInsertedValues)
          }
          break
        }
        case 'boolean':
        case 'enum':
        case 'string': {
          calculateBooleanStringOrEnumFacet(facets[facet].values, facetValue as FacetValue, propertyType)
          break
        }
        case 'boolean[]':
        case 'enum[]':
        case 'string[]': {
          const alreadyInsertedValues = new Set<string>()
          const innerType = propertyType === 'boolean[]' ? 'boolean' : 'string'
          for (const v of facetValue as Array<FacetValue>) {
            calculateBooleanStringOrEnumFacet(facets[facet].values, v, innerType, alreadyInsertedValues)
          }
          break
        }
        default:
          throw createError('FACET_NOT_SUPPORTED', propertyType)
      }
    }
  }

  for (const facet of facetKeys) {
    // Count the number of values for each facet
    facets[facet].count = Object.keys(facets[facet].values).length
    // Sort only string-based facets
    if (properties[facet] === 'string') {
      const stringFacetDefinition = facetsConfig[facet] as StringFacetDefinition

      facets[facet].values = Object.fromEntries(
        Object.entries(facets[facet].values)
          .sort((a, b) => sortingPredicate(stringFacetDefinition.sort, a, b))
          .slice(stringFacetDefinition.offset ?? 0, stringFacetDefinition.limit ?? 10)
      )
    }
  }

  return facets
}

function calculateNumberFacet(
  ranges: NumberFacetDefinition['ranges'],
  values: Record<string, number>,
  facetValue: number,
  alreadyInsertedValues?: Set<string>
) {
  for (const range of ranges) {
    const value = `${range.from}-${range.to}`
    if (alreadyInsertedValues && alreadyInsertedValues.has(value)) {
      continue
    }

    if (facetValue >= range.from && facetValue <= range.to) {
      if (values[value] === undefined) {
        values[value] = 1
      } else {
        values[value]++

        if (alreadyInsertedValues) {
          alreadyInsertedValues.add(value)
        }
      }
    }
  }
}

function calculateBooleanStringOrEnumFacet(
  values: Record<string, number>,
  facetValue: FacetValue,
  propertyType: 'string' | 'boolean' | 'enum',
  alreadyInsertedValues?: Set<string>
) {
  // String or boolean based facets
  const value = facetValue?.toString() ?? (propertyType === 'boolean' ? 'false' : '')
  if (alreadyInsertedValues && alreadyInsertedValues.has(value)) {
    return
  }
  values[value] = (values[value] ?? 0) + 1
  if (alreadyInsertedValues) {
    alreadyInsertedValues.add(value)
  }
}
