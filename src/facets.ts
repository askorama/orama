import type { FacetSorting, FacetsSearch, PropertiesSchema, ResolveSchema, TokenScore } from "./types.d.ts";

export type FacetReturningValue = {
  [key: string]: {
    count: number;
    values: {
      [key: string]: number;
    }
  }
}

export async function populateFacets<S extends PropertiesSchema>(docs: Record<string, ResolveSchema<S> | undefined>, facets: FacetReturningValue, results: TokenScore[], facetsConfig: FacetsSearch<S>): Promise<FacetReturningValue> {
  const allIDs = results.map(([id]) => id);
  const allDocs = allIDs.map((id) => docs[id]);
  const facetKeys = Object.keys(facetsConfig);

  for (const facet of facetKeys) {
    facets[facet] = {
      count: 0,
      values: {},
    };
  }

  const allDocsLength = allDocs.length;
  for (let i = 0; i < allDocsLength; i++) {
    const doc = allDocs[i];
    for (const facet of facetKeys) {
      const facetValue = doc![facet];

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
    facets[facet].count = Object.keys(facets[facet].values).length;
    facets[facet].values = Object.fromEntries(
      Object.entries(facets[facet].values)
        .sort((a, b) => sortingPredicate((facetsConfig as any)[facet].sort, a, b))
        .slice(0, (facetsConfig as any)[facet].size ?? 10),
    )
  }

  return facets;
}

function sortingPredicate(order: FacetSorting = "asc", a: [string, number], b: [string, number]) {
  if (order.toLowerCase() === "asc") {
    return b[1] - a[1];
  } else {
    return a[1] - b[1];
  }
}