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
      if (typeof facetValue === "string") {
        if (facets[facet].values[facetValue] === undefined) {
          facets[facet].values[facetValue] = 1;
        } else {
          facets[facet].values[facetValue]++;
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

function sortingPredicate(order: FacetSorting = "ASC", a: [string, number], b: [string, number]) {
  if (order.toLowerCase() === "asc") {
    return b[1] - a[1];
  } else {
    return a[1] - b[1];
  }
}