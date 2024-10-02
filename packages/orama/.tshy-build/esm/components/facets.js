import { createError } from '../errors.js'
import { getNested } from '../utils.js'
function sortAsc(a, b) {
  return a[1] - b[1]
}
function sortDesc(a, b) {
  return b[1] - a[1]
}
function sortingPredicateBuilder(order = 'desc') {
  return order.toLowerCase() === 'asc' ? sortAsc : sortDesc
}
export function getFacets(orama, results, facetsConfig) {
  const facets = {}
  const allIDs = results.map(([id]) => id)
  const allDocs = orama.documentsStore.getMultiple(orama.data.docs, allIDs)
  const facetKeys = Object.keys(facetsConfig)
  const properties = orama.index.getSearchablePropertiesWithTypes(orama.data.index)
  for (const facet of facetKeys) {
    let values
    // Hack to guarantee the same order of ranges as specified by the user
    // TODO: Revisit this once components land
    if (properties[facet] === 'number') {
      const { ranges } = facetsConfig[facet]
      const rangesLength = ranges.length
      const tmp = Array.from({ length: rangesLength })
      for (let i = 0; i < rangesLength; i++) {
        const range = ranges[i]
        tmp[i] = [`${range.from}-${range.to}`, 0]
      }
      values = Object.fromEntries(tmp)
    }
    facets[facet] = {
      count: 0,
      values: values ?? {}
    }
  }
  const allDocsLength = allDocs.length
  for (let i = 0; i < allDocsLength; i++) {
    const doc = allDocs[i]
    for (const facet of facetKeys) {
      const facetValue = facet.includes('.') ? getNested(doc, facet) : doc[facet]
      const propertyType = properties[facet]
      const facetValues = facets[facet].values
      switch (propertyType) {
        case 'number': {
          const ranges = facetsConfig[facet].ranges
          calculateNumberFacetBuilder(ranges, facetValues)(facetValue)
          break
        }
        case 'number[]': {
          const alreadyInsertedValues = new Set()
          const ranges = facetsConfig[facet].ranges
          const calculateNumberFacet = calculateNumberFacetBuilder(ranges, facetValues, alreadyInsertedValues)
          for (const v of facetValue) {
            calculateNumberFacet(v)
          }
          break
        }
        case 'boolean':
        case 'enum':
        case 'string': {
          calculateBooleanStringOrEnumFacetBuilder(facetValues, propertyType)(facetValue)
          break
        }
        case 'boolean[]':
        case 'enum[]':
        case 'string[]': {
          const alreadyInsertedValues = new Set()
          const innerType = propertyType === 'boolean[]' ? 'boolean' : 'string'
          const calculateBooleanStringOrEnumFacet = calculateBooleanStringOrEnumFacetBuilder(
            facetValues,
            innerType,
            alreadyInsertedValues
          )
          for (const v of facetValue) {
            calculateBooleanStringOrEnumFacet(v)
          }
          break
        }
        default:
          throw createError('FACET_NOT_SUPPORTED', propertyType)
      }
    }
  }
  // TODO: We are looping again with the same previous keys, should we creat a single loop instead?
  for (const facet of facetKeys) {
    const currentFacet = facets[facet]
    // Count the number of values for each facet
    currentFacet.count = Object.keys(currentFacet.values).length
    // Sort only string-based facets
    if (properties[facet] === 'string') {
      const stringFacetDefinition = facetsConfig[facet]
      const sortingPredicate = sortingPredicateBuilder(stringFacetDefinition.sort)
      currentFacet.values = Object.fromEntries(
        Object.entries(currentFacet.values)
          .sort(sortingPredicate)
          .slice(stringFacetDefinition.offset ?? 0, stringFacetDefinition.limit ?? 10)
      )
    }
  }
  return facets
}
function calculateNumberFacetBuilder(ranges, values, alreadyInsertedValues) {
  return (facetValue) => {
    for (const range of ranges) {
      const value = `${range.from}-${range.to}`
      if (alreadyInsertedValues?.has(value)) {
        continue
      }
      if (facetValue >= range.from && facetValue <= range.to) {
        if (values[value] === undefined) {
          values[value] = 1
        } else {
          values[value]++
          alreadyInsertedValues?.add(value)
        }
      }
    }
  }
}
function calculateBooleanStringOrEnumFacetBuilder(values, propertyType, alreadyInsertedValues) {
  const defaultValue = propertyType === 'boolean' ? 'false' : ''
  return (facetValue) => {
    // String or boolean based facets
    const value = facetValue?.toString() ?? defaultValue
    if (alreadyInsertedValues?.has(value)) {
      return
    }
    values[value] = (values[value] ?? 0) + 1
    alreadyInsertedValues?.add(value)
  }
}
//# sourceMappingURL=facets.js.map
