import { createError } from "../errors.js";
import {
  create as avlCreate,
  find as avlFind,
  greaterThan as avlGreaterThan,
  insert as avlInsert,
  lessThan as avlLessThan,
  Node as AVLNode,
  rangeSearch as avlRangeSearch,
  removeDocument as avlRemoveDocument,
} from "../trees/avl.js";
import {
  create as radixCreate,
  find as radixFind,
  insert as radixInsert,
  Node as RadixNode,
  removeDocumentByWord as radixRemoveDocument,
} from "../trees/radix.js";
import {
  BM25Params,
  ComparisonOperator,
  IIndex,
  Lyra,
  OpaqueDocumentStore,
  OpaqueIndex,
  Schema,
  SearchableType,
  SearchableValue,
  SearchContext,
  Tokenizer,
  TokenScore,
} from "../types.js";
import { intersect } from "../utils.js";
import { BM25 } from "./algorithms.js";

type FrequencyMap = {
  [property: string]: {
    [documentID: string]:
      | {
          [token: string]: number;
        }
      | undefined;
  };
};

type BooleanIndex = {
  true: string[];
  false: string[];
};

export interface Index extends OpaqueIndex {
  indexes: Record<string, RadixNode | AVLNode<number, string[]> | BooleanIndex>;
  searchableProperties: string[];
  searchablePropertiesWithTypes: Record<string, SearchableType>;
  frequencies: FrequencyMap;
  tokenOccurrencies: Record<string, Record<string, number>>;
  avgFieldLength: Record<string, number>;
  fieldLengths: Record<string, Record<string, number | undefined>>;
}

type DefaultIndex<S extends Schema, D extends OpaqueDocumentStore> = IIndex<S, Index, D>;

function create<S extends Schema, D extends OpaqueDocumentStore>(
  lyra: Lyra<S, Index, D>,
  schema: Schema,
  index?: Index,
  prefix = "",
): Index {
  if (!index) {
    index = {
      indexes: {},
      searchableProperties: [],
      searchablePropertiesWithTypes: {},
      frequencies: {},
      tokenOccurrencies: {},
      avgFieldLength: {},
      fieldLengths: {},
    };
  }

  for (const [prop, type] of Object.entries(schema)) {
    const typeActualType = typeof type;
    const path = `${prefix}${prefix ? "." : ""}${prop}`;

    if (typeActualType === "object" && !Array.isArray(type)) {
      // Nested
      create(lyra, type as Schema, index, path);
      continue;
    }

    switch (type) {
      case "boolean":
        index.indexes[path] = { true: [], false: [] };
        break;
      case "number":
        index.indexes[path] = avlCreate<number, string[]>(0, []);
        break;
      case "string":
        index.indexes[path] = radixCreate();
        index.avgFieldLength[path] = 0;
        index.frequencies[path] = {};
        index.tokenOccurrencies[path] = {};
        index.fieldLengths[path] = {};

        break;
      default:
        throw createError("INVALID_SCHEMA_TYPE", Array.isArray(type) ? "array" : typeActualType);
    }

    index.searchableProperties.push(path);
    index.searchablePropertiesWithTypes[path] = type;
  }

  return index;
}

function insert(
  index: Index,
  prop: string,
  id: string,
  value: SearchableValue,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
): void {
  if (typeof value === "number") {
    avlInsert(index.indexes[prop] as AVLNode<number, string[]>, value as number, [id]);
    return;
  } else if (typeof value === "boolean") {
    (index.indexes[prop] as BooleanIndex)[value ? "true" : "false"].push(id);
    return;
  }

  const tokens = tokenizer.tokenize(value as string, language);

  if (!(id in index.frequencies[prop])) {
    index.frequencies[prop][id] = {};
  }

  index.fieldLengths[prop][id] = tokens.length;
  index.avgFieldLength[prop] = ((index.avgFieldLength[prop] ?? 0) * (docsCount - 1) + tokens.length) / docsCount;

  for (const token of tokens) {
    let tokenFrequency = 0;

    for (const t of tokens) {
      if (t === token) {
        tokenFrequency++;
      }
    }

    const tf = tokenFrequency / tokens.length;

    index.frequencies[prop][id]![token] = tf;

    if (!(token in index.tokenOccurrencies[prop])) {
      index.tokenOccurrencies[prop][token] = 0;
    }

    // increase a token counter that may not yet exist
    index.tokenOccurrencies[prop][token] = (index.tokenOccurrencies[prop][token] ?? 0) + 1;

    radixInsert(index.indexes[prop] as RadixNode, token, id);
  }
}

function remove(
  index: Index,
  prop: string,
  id: string,
  value: SearchableValue,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
): void {
  if (typeof value === "number") {
    avlRemoveDocument(index.indexes[prop] as AVLNode<number, string[]>, id, value);
    return;
  } else if (typeof value === "boolean") {
    const booleanKey = value ? "true" : "false";
    const position = (index.indexes[prop] as BooleanIndex)[booleanKey].indexOf(id);

    (index.indexes[prop] as BooleanIndex)[value ? "true" : "false"].splice(position, 1);
    return;
  }

  const tokens = tokenizer.tokenize(value as string, language);

  index.avgFieldLength[prop] =
    (index.avgFieldLength[prop] * docsCount - index.fieldLengths[prop][id]!) / (docsCount - 1);
  index.fieldLengths[prop][id] = undefined;
  index.frequencies[prop][id] = undefined;

  for (const token of tokens) {
    index.tokenOccurrencies[prop][token]--;
    radixRemoveDocument(index.indexes[prop] as RadixNode, token, id);
  }
}

function search(index: Index, prop: string, term: string, context: SearchContext): TokenScore[] {
  if (!(prop in index.tokenOccurrencies)) {
    return [];
  }

  // Exact fields for TF-IDF
  const avgFieldLength = index.avgFieldLength[prop];
  const fieldLengths = index.fieldLengths[prop];
  const lyraOccurrencies = index.tokenOccurrencies[prop];
  const lyraFrequencies = index.frequencies[prop];

  // Performa the search
  const rootNode = index.indexes[prop] as RadixNode;
  const { exact, tolerance } = context.params;
  const searchResult = radixFind(rootNode, { term, exact, tolerance });

  const ids = new Set<string>();

  for (const key in searchResult) {
    for (const id of searchResult[key]) {
      ids.add(id);
    }
  }

  const documentIDs = Array.from(ids);

  // lyraOccurrencies[term] can be undefined, 0, string, or { [k: string]: number }
  const termOccurrencies = typeof lyraOccurrencies[term] === "number" ? lyraOccurrencies[term] ?? 0 : 0;

  const scoreList: TokenScore[] = [];

  // Calculate TF-IDF value for each term, in each document, for each index.
  const documentIDsLength = documentIDs.length;
  for (let k = 0; k < documentIDsLength; k++) {
    const id = documentIDs[k];
    const tf = lyraFrequencies?.[id]?.[term] ?? 0;

    const bm25 = BM25(
      tf,
      termOccurrencies,
      context.docsCount,
      fieldLengths[id]!,
      avgFieldLength,
      context.params.relevance! as Required<BM25Params>,
    );

    scoreList.push([id, bm25]);
  }

  return scoreList;
}

function searchByWhereClause(index: Index, filters: Record<string, boolean | ComparisonOperator>): string[] {
  const filterKeys = Object.keys(filters);

  const filtersMap: Record<string, string[]> = filterKeys.reduce(
    (acc, key) => ({
      [key]: [],
      ...acc,
    }),
    {},
  );

  for (const param of filterKeys) {
    const operation = filters[param];

    if (typeof operation === "boolean") {
      const idx = index.indexes[param] as BooleanIndex;
      const filteredIDs = idx[operation.toString() as keyof BooleanIndex];
      filtersMap[param].push(...filteredIDs);
      continue;
    }

    const operationKeys = Object.keys(operation);

    if (operationKeys.length > 1) {
      throw createError("INVALID_FILTER_OPERATION", operationKeys.length);
    }

    const operationOpt = operationKeys[0] as ComparisonOperator;
    const operationValue = operation[operationOpt as unknown as keyof ComparisonOperator];

    const AVLNode = index.indexes[param] as AVLNode<number, string[]>;

    switch (operationOpt) {
      case "gt": {
        const filteredIDs = avlGreaterThan(AVLNode, operationValue, false);
        filtersMap[param].push(...filteredIDs);
        break;
      }
      case "gte": {
        const filteredIDs = avlGreaterThan(AVLNode, operationValue, true);
        filtersMap[param].push(...filteredIDs);
        break;
      }
      case "lt": {
        const filteredIDs = avlLessThan(AVLNode, operationValue, false);
        filtersMap[param].push(...filteredIDs);
        break;
      }
      case "lte": {
        const filteredIDs = avlLessThan(AVLNode, operationValue, true);
        filtersMap[param].push(...filteredIDs);
        break;
      }
      case "eq": {
        const filteredIDs = avlFind(AVLNode, operationValue) ?? [];
        filtersMap[param].push(...filteredIDs);
        break;
      }
      case "between": {
        const [min, max] = operationValue as number[];
        const filteredIDs = avlRangeSearch(AVLNode, min, max);
        filtersMap[param].push(...filteredIDs);
      }
    }
  }

  // AND operation: calculate the intersection between all the IDs in filterMap
  const result = intersect(Object.values(filtersMap)) as unknown as string[];

  return result;
}

function getSearchableProperties(index: Index): string[] {
  return index.searchableProperties;
}

function getSearchablePropertiesWithTypes(index: Index): Record<string, "string" | "number" | "boolean"> {
  return index.searchablePropertiesWithTypes;
}

function load(raw: unknown): Index {
  const {
    indexes,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrencies,
    avgFieldLength,
    fieldLengths,
  } = raw as Index;

  return {
    indexes,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrencies,
    avgFieldLength,
    fieldLengths,
  };
}

function save(index: Index): unknown {
  const {
    indexes,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrencies,
    avgFieldLength,
    fieldLengths,
  } = index;

  return {
    indexes,
    searchableProperties,
    searchablePropertiesWithTypes,
    frequencies,
    tokenOccurrencies,
    avgFieldLength,
    fieldLengths,
  } as unknown;
}

export function createIndex<S extends Schema, D extends OpaqueDocumentStore>(): DefaultIndex<S, D> {
  return {
    create,
    insert,
    remove,
    search,
    searchByWhereClause,
    getSearchableProperties,
    getSearchablePropertiesWithTypes,
    load,
    save,
  };
}
