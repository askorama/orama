import type { FacetSorting, FacetsSearch, PropertiesSchema, ResolveSchema, TokenScore } from "./types/index.js";
import { getNested } from './utils.js';

export type FacetReturningValue = {
  [key: string]: {
    count: number;
    values: {
      [key: string]: number;
    }
  }
}

export function getFacets<S extends PropertiesSchema>(schema: PropertiesSchema, docs: Record<string, ResolveSchema<S> | undefined>, results: TokenScore[], facetsConfig: FacetsSearch<S>): FacetReturningValue {
  const facets: FacetReturningValue = {};
  const allIDs = results.map(([id]) => id);
  const allDocs = allIDs.map((id) => docs[id]);
  const facetKeys = Object.keys(facetsConfig);

  for (const facet of facetKeys) {
    const facetType = getFacetType(schema, facet);
    let values = {};

    // Hack to guarantee the same order of ranges as specified by the user
    if (facetType === "number") {
      const { ranges } = (facetsConfig as any)[facet];
      const tmp = [];
      for (const range of ranges) {
        tmp.push([`${range.from}-${range.to}`, 0]);
      }
      values = Object.fromEntries(tmp as any);
    }

    facets[facet] = {
      count: 0,
      values,
    };
  }

  const allDocsLength = allDocs.length;
  for (let i = 0; i < allDocsLength; i++) {
    const doc = allDocs[i];

    for (const facet of facetKeys) {
      const facetValue = facet.includes('.')
        ? getNested<string>(doc!, facet)!
        : doc![facet] as number | boolean;

      // String based facets
      if (typeof facetValue === "string") {
        if (facets[facet].values[facetValue] === undefined) {
          facets[facet].values[facetValue] = 1;
        } else {
          facets[facet].values[facetValue]++;
        }

      // Boolean facets
      } else if (typeof facetValue === "boolean") {
        if (facets[facet].values[facetValue.toString()] === undefined) {
          facets[facet].values[facetValue.toString()] = 1;
        } else {
          facets[facet].values[facetValue.toString()]++;
        }
      }

      // Range facets based on numbers
      else if (typeof facetValue === "number") {
        for (const range of (facetsConfig as any)[facet].ranges) {
          if (facetValue >= range.from && facetValue <= range.to) {
            if (facets[facet].values[`${range.from}-${range.to}`] === undefined) {
              facets[facet].values[`${range.from}-${range.to}`] = 1;
            } else {
              facets[facet].values[`${range.from}-${range.to}`]++;
            }
          }
        }
      }
    }
  }

  for (const facet of facetKeys) {
    const facetType = getFacetType(schema, facet);

    // Count the number of values for each facet
    facets[facet].count = Object.keys(facets[facet].values).length;

    // Sort only string-based facets
    if (facetType === "string") {
      facets[facet].values = Object.fromEntries(
        Object.entries(facets[facet].values)
          .sort((a, b) => sortingPredicate((facetsConfig as any)[facet].sort, a, b))
          .slice((facetsConfig as any)[facet].offset ?? 0, (facetsConfig as any)[facet].limit ?? 10),
      )
    }
  }

  return facets;
}

const facetTypeCache = new Map<string, string>();

function getFacetType(schema: PropertiesSchema, facet: string) {
  if (facetTypeCache.has(facet)) {
    return facetTypeCache.get(facet)!;
  }

  const facetType = getNested<string>(schema, facet)!;
  facetTypeCache.set(facet, facetType);
  return facetType;
}

function sortingPredicate(order: FacetSorting = "desc", a: [string, number], b: [string, number]) {
  if (order.toLowerCase() === "asc") {
    return a[1] - b[1];
  } else {
    return b[1] - a[1];
  }
}