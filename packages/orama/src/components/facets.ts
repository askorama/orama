import type {
  FacetResult,
  FacetSorting,
  NumberFacetDefinition,
  Orama,
  SearchParams,
  SearchableValue,
  StringFacetDefinition,
  TokenScore,
} from '../types.js'
import { getNested } from '../utils.js'

function sortingPredicate(order: FacetSorting = 'desc', a: [string, number], b: [string, number]) {
  if (order.toLowerCase() === 'asc') {
    return a[1] - b[1]
  } else {
    return b[1] - a[1]
  }
}

export async function getFacets(
  orama: Orama,
  results: TokenScore[],
  facetsConfig: Required<SearchParams>['facets'],
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
      const tmp = []
      for (const range of ranges) {
        tmp.push([`${range.from}-${range.to}`, 0])
      }
      values = Object.fromEntries(tmp)
    }

    facets[facet] = {
      count: 0,
      values,
    }
  }

  const allDocsLength = allDocs.length
  for (let i = 0; i < allDocsLength; i++) {
    const doc = allDocs[i]

    for (const facet of facetKeys) {
      const facetValue = facet.includes('.')
        ? (await getNested<string>(doc!, facet))!
        : (doc![facet] as SearchableValue)

      const alreadyInsertedValues = new Set()
      switch (properties[facet]) {
        case 'number': {
          for (const range of (facetsConfig[facet] as NumberFacetDefinition).ranges) {
            if ((facetValue as number) >= range.from && (facetValue as number) <= range.to) {
              if (facets[facet].values[`${range.from}-${range.to}`] === undefined) {
                facets[facet].values[`${range.from}-${range.to}`] = 1
              } else {
                facets[facet].values[`${range.from}-${range.to}`]++
              }
            }
          }
          break
        }
        case 'boolean':
        case 'string': {
          // String or boolean based facets
          const value = facetValue?.toString() ?? (properties[facet] === 'boolean' ? 'false' : '')
          facets[facet].values[value] = (facets[facet].values[value] ?? 0) + 1
          break
        }
        case 'boolean[]':
        case 'string[]': {
          for (const v of (facetValue as Array<string>)) {
            // String or boolean based facets
            const value = v?.toString() ?? (properties[facet] === 'boolean' ? 'false' : '')
            if (alreadyInsertedValues.has(value)) {
              continue
            }

            facets[facet].values[value] = (facets[facet].values[value] ?? 0) + 1

            alreadyInsertedValues.add(value)
          }
          break
        }
        case 'number[]': {
          const ranges = (facetsConfig[facet] as NumberFacetDefinition).ranges
          for (const range of ranges) {
            const value = `${range.from}-${range.to}`

            for (const v of (facetValue as Array<number>)) {
              if ((v as number) >= range.from && (v as number) <= range.to) {
                if (facets[facet].values[value] === undefined) {
                  facets[facet].values[value] = 1
                } else {
                  facets[facet].values[value]++
                  alreadyInsertedValues.add(value)
                  break
                }
              }
            }

          }
          break
        }
      }
    }
  }

  for (const facet of facetKeys) {
    // Count the number of values for each facet
    facets[facet].count = Object.keys(facets[facet].values).length

    // Sort only string-based facets
    if (properties[facet] === 'string') {
      const stringFacetDefinition = facetsConfig as StringFacetDefinition

      facets[facet].values = Object.fromEntries(
        Object.entries(facets[facet].values)
          .sort((a, b) => sortingPredicate(stringFacetDefinition.sort, a, b))
          .slice(stringFacetDefinition.offset ?? 0, stringFacetDefinition.limit ?? 10),
      )
    }
  }

  return facets
}
