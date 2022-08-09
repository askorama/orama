import * as ERRORS from "./errors";
import { tokenize } from "./tokenizer";
import { getNanosecondsTime, uniqueId } from "./utils";
import { Language, SUPPORTED_LANGUAGES } from "./tokenizer/languages";
import type { ResolveSchema, SearchProperties } from "./types";
import { create as createNode, Node } from "./prefix-tree/node";
import { find as trieFind, insert as trieInsert, removeDocumentByWord, Nodes } from "./prefix-tree/trie";
import { trackInsertion } from "./insertion-checker";

type Index = Record<string, Node>;

export { formatNanoseconds } from "./utils";

export type PropertyType = "string" | "number" | "boolean";

export type PropertiesSchema = {
  [key: string]: PropertyType | PropertiesSchema;
};

export type Configuration<S extends PropertiesSchema> = {
  schema: S;
  defaultLanguage?: Language;
  edge?: boolean;
};

export type Data<S extends PropertiesSchema> = {
  docs: Record<string, ResolveSchema<S> | undefined>;
  index: Index;
  nodes: Nodes;
  schema: S;
};

export interface Lyra<S extends PropertiesSchema> extends Data<S> {
  defaultLanguage: Language;
  schema: S;
  edge: boolean;
}

export type InsertConfig = {
  language: Language;
};

export type SearchParams<S extends PropertiesSchema> = {
  term: string;
  properties?: "*" | SearchProperties<S>[];
  limit?: number;
  offset?: number;
  exact?: boolean;
  tolerance?: number;
};

export type SearchResult<S extends PropertiesSchema> = {
  count: number;
  hits: RetrievedDoc<S>[];
  elapsed: bigint;
};

export type RetrievedDoc<S extends PropertiesSchema> = ResolveSchema<S> & {
  id: string;
};

function buildIndex<S extends PropertiesSchema>(lyra: Lyra<S>, schema: S, prefix = "") {
  for (const prop of Object.keys(schema)) {
    const propType = typeof prop;
    const isNested = typeof schema[prop] === "object";

    if (propType !== "string") throw new Error(ERRORS.INVALID_SCHEMA_TYPE(propType));

    const propName = `${prefix}${prop}`;

    if (isNested) {
      buildIndex(lyra, schema[prop] as S, `${propName}.`);
    } else {
      lyra.index[propName] = createNode();
    }
  }
}

function recursiveCheckDocSchema<S extends PropertiesSchema>(
  newDoc: ResolveSchema<S>,
  schema: PropertiesSchema,
): boolean {
  for (const key in newDoc) {
    if (!(key in schema)) {
      return false;
    }

    const propType = typeof newDoc[key];

    if (propType === "object") {
      recursiveCheckDocSchema(newDoc[key] as ResolveSchema<S>, schema);
    } else {
      if (typeof newDoc[key] !== schema[key]) {
        return false;
      }
    }
  }

  return true;
}

function recursiveTrieInsertion<S extends PropertiesSchema>(
  index: Index,
  nodes: Nodes,
  doc: ResolveSchema<S>,
  id: string,
  config: InsertConfig,
  prefix = "",
) {
  for (const key of Object.keys(doc)) {
    const isNested = typeof doc[key] === "object";
    const propName = `${prefix}${key}`;
    if (isNested) {
      recursiveTrieInsertion(index, nodes, doc[key] as ResolveSchema<S>, id, config, propName + ".");

      return;
    }

    if (typeof doc[key] === "string") {
      // Use propName here because if doc is a nested object
      // We will get the wrong index
      const requestedTrie = index[propName];
      const tokens = tokenize(doc[key] as string, config.language);

      for (const token of tokens) {
        trieInsert(nodes, requestedTrie, token, id);
      }
    }
  }
}

function getIndices<S extends PropertiesSchema>(lyra: Lyra<S>, indices: SearchParams<S>["properties"]): string[] {
  const knownIndices = Object.keys(lyra.index);

  if (!indices) {
    return knownIndices;
  }

  if (typeof indices === "string") {
    if (indices === "*") {
      return knownIndices;
    } else {
      throw new Error(ERRORS.INVALID_PROPERTY(indices, knownIndices));
    }
  }

  for (const index of indices as string[]) {
    if (!knownIndices.includes(index)) {
      throw new Error(ERRORS.INVALID_PROPERTY(index, knownIndices));
    }
  }

  return indices as string[];
}

function getDocumentIDsFromSearch<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  params: SearchParams<S> & { index: string },
): string[] {
  const idx = lyra.index[params.index];

  const searchResult = trieFind(lyra.nodes, idx, {
    term: params.term,
    exact: params.exact,
    tolerance: params.tolerance,
  });
  const ids = new Set<string>();

  for (const key in searchResult) {
    for (const id of searchResult[key]) {
      ids.add(id);
    }
  }

  return Array.from(ids);
}

export function create<S extends PropertiesSchema>(properties: Configuration<S>): Lyra<S> {
  const defaultLanguage = (properties?.defaultLanguage?.toLowerCase() as Language) ?? "english";

  if (!SUPPORTED_LANGUAGES.includes(defaultLanguage)) {
    throw new Error(ERRORS.LANGUAGE_NOT_SUPPORTED(defaultLanguage));
  }

  const instance: Lyra<S> = {
    defaultLanguage,
    schema: properties.schema,
    docs: {},
    nodes: {},
    index: {},
    edge: properties.edge ?? false,
  };

  buildIndex(instance, properties.schema);
  return instance;
}

export function insert<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  doc: ResolveSchema<S>,
  config?: InsertConfig,
): { id: string } {
  config = { language: lyra.defaultLanguage, ...config };
  const id = uniqueId();

  if (!SUPPORTED_LANGUAGES.includes(config.language)) {
    throw new Error(ERRORS.LANGUAGE_NOT_SUPPORTED(config.language));
  }

  if (!recursiveCheckDocSchema(doc, lyra.schema)) {
    throw new Error(ERRORS.INVALID_DOC_SCHEMA(lyra.schema, doc));
  }

  lyra.docs[id] = doc;
  recursiveTrieInsertion(lyra.index, lyra.nodes, doc, id, config);
  trackInsertion(lyra);

  return { id };
}

export function remove<S extends PropertiesSchema>(lyra: Lyra<S>, docID: string): boolean {
  if (!(docID in lyra.docs)) {
    throw new Error(ERRORS.DOC_ID_DOES_NOT_EXISTS(docID));
  }

  const document = lyra.docs[docID];

  for (const key in document) {
    const propertyType = lyra.schema[key];

    if (propertyType === "string") {
      const idx = lyra.index[key];
      const tokens = tokenize(document[key] as string);

      for (const token of tokens) {
        if (token && removeDocumentByWord(lyra.nodes, idx, token, docID)) {
          throw new Error(ERRORS.CANT_DELETE_DOCUMENT(docID, key, token));
        }
      }
    }
  }

  lyra.docs[docID] = undefined;

  return true;
}

export function search<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  params: SearchParams<S>,
  language?: Language,
): SearchResult<S> {
  if (!language) {
    language = lyra.defaultLanguage;
  }

  const tokens = tokenize(params.term, language);
  const indices = getIndices(lyra, params.properties);
  const uniqueDocIds = new Set<string>();
  const { limit = 10, offset = 0, exact = false } = params;
  const results: RetrievedDoc<S>[] = Array.from({
    length: limit,
  });

  const timeStart = getNanosecondsTime();

  let i = 0;
  let j = 0;

  for (const term of tokens) {
    for (const index of indices) {
      const documentIDs = getDocumentIDsFromSearch(lyra, { ...params, index, term, exact });

      for (const id of documentIDs) {
        uniqueDocIds.add(id);
      }

      if (i >= limit) {
        break;
      }

      for (const id of uniqueDocIds) {
        if (j < offset) {
          j++;
          continue;
        }

        if (i >= limit) {
          break;
        }

        if (results.findIndex(x => x?.id === id) === -1) {
          const fullDoc = lyra.docs[id]!;
          results[i] = { id, ...fullDoc };
        }
        i++;
      }
    }
  }

  const hits = results.filter(Boolean);

  return {
    elapsed: getNanosecondsTime() - timeStart,
    hits,
    count: uniqueDocIds.size,
  };
}

export function save<S extends PropertiesSchema>(lyra: Lyra<S>): Data<S> {
  return {
    index: lyra.index,
    docs: lyra.docs,
    nodes: lyra.nodes,
    schema: lyra.schema,
  };
}

export function load<S extends PropertiesSchema>(lyra: Lyra<S>, { index, docs, nodes, schema }: Data<S>) {
  if (!lyra.edge) {
    throw new Error(ERRORS.GETTER_SETTER_WORKS_ON_EDGE_ONLY("load"));
  }

  lyra.index = index;
  lyra.docs = docs;
  lyra.nodes = nodes;
  lyra.schema = schema;
}
