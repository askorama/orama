import fastq from "fastq";
import * as ERRORS from "./errors";
import toFastProperties, { insertWithFastProperties } from "./fast-properties";
import { tokenize } from "./tokenizer";
import { formatNanoseconds, getNanosecondsTime, uniqueId } from "./utils";
import { Language, SUPPORTED_LANGUAGES } from "./stemmer";
import type { ResolveSchema, SearchProperties } from "./types";
import { create as createNode, Node } from "./prefix-tree/node";
import { find as trieFind, insert as trieInsert, removeDocumentByWord, Nodes } from "./prefix-tree/trie";

export type PropertyType = "string" | "number" | "boolean";

export type PropertiesSchema = {
  [key: string]: PropertyType | PropertiesSchema;
};

export type LyraProperties<T extends PropertiesSchema> = {
  schema: T;
  defaultLanguage?: Language;
  stemming?: boolean;
  edge?: boolean;
};

export type LyraDocs<TDoc extends PropertiesSchema> = Record<string, ResolveSchema<TDoc>>;

export type SearchParams<T extends PropertiesSchema> = {
  term: string;
  properties?: "*" | SearchProperties<T>[];
  limit?: number;
  offset?: number;
  exact?: boolean;
  tolerance?: number;
};

export type InsertConfig = {
  language: Language;
  stemming: boolean;
};

export type LyraData<T extends PropertiesSchema> = {
  docs: LyraDocs<T>;
  index: LyraIndex;
  nodes: Nodes;
};

type LyraIndex = Record<string, Node>;

type QueueDocParams<T extends PropertiesSchema> = {
  id: string;
  doc: ResolveSchema<T>;
  config: InsertConfig;
};

type SearchResult<T extends PropertiesSchema> = {
  count: number;
  hits: RetrievedDoc<T>[];
  elapsed: string;
};

type RetrievedDoc<TDoc extends PropertiesSchema> = ResolveSchema<TDoc> & {
  id: string;
};

export interface Lyra<T extends PropertiesSchema> {
  defaultLanguage: Language;
  schema: T;
  docs: LyraDocs<T>;
  nodes: Nodes;
  index: LyraIndex;
  enableStemming: boolean;
  edge: boolean;
  queue?: fastq.queue<QueueDocParams<T>, void>;
}

function getIndices<T extends PropertiesSchema>(lyra: Lyra<T>, indices: SearchParams<T>["properties"]): string[] {
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

function getDocumentIDsFromSearch<T extends PropertiesSchema>(
  lyra: Lyra<T>,
  params: SearchParams<T> & { index: string },
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

function buildIndex<T extends PropertiesSchema>(lyra: Lyra<T>, schema: T, prefix = "") {
  for (const prop of Object.keys(schema)) {
    const propType = typeof prop;
    const isNested = typeof schema[prop] === "object";

    if (propType !== "string") throw new Error(ERRORS.INVALID_SCHEMA_TYPE(propType));

    const propName = `${prefix}${prop}`;

    if (isNested) {
      buildIndex(lyra, schema[prop] as T, `${propName}.`);
    } else {
      lyra.index = insertWithFastProperties(lyra.index, propName, createNode());
    }
  }
}

function _insert<T extends PropertiesSchema>(
  this: Lyra<T>,
  { doc, id, config }: QueueDocParams<T>,
  cb: (error: Error | null) => void,
): void {
  const index = this.index;
  const nodes = this.nodes;
  this.docs = insertWithFastProperties(this.docs, id, doc);

  function recursiveTrieInsertion(doc: ResolveSchema<T>, prefix = "") {
    for (const key of Object.keys(doc)) {
      const isNested = typeof doc[key] === "object";
      const propName = `${prefix}${key}`;
      if (isNested) {
        recursiveTrieInsertion(doc[key] as ResolveSchema<T>, `${propName}.`);

        return;
      }

      if (typeof doc[key] === "string") {
        // Use propName here because if doc is a nested object
        // We will get the wrong index
        const requestedTrie = index[propName];
        const tokens = tokenize(doc[key] as string, config.language, config.stemming);

        for (const token of tokens) {
          trieInsert(nodes, requestedTrie, token, id);
        }
      }

      cb(null);
    }
  }

  recursiveTrieInsertion(doc);
  this.nodes = toFastProperties(this.nodes);
}

function checkInsertDocSchema<T extends PropertiesSchema>(lyra: Lyra<T>, doc: QueueDocParams<T>["doc"]): boolean {
  function recursiveCheck(newDoc: QueueDocParams<T>["doc"], schema: PropertiesSchema): boolean {
    for (const key in newDoc) {
      if (!(key in schema)) {
        return false;
      }

      const propType = typeof newDoc[key];

      if (propType === "object") {
        recursiveCheck(newDoc[key] as QueueDocParams<T>["doc"], schema);
      } else {
        if (typeof newDoc[key] !== schema[key]) {
          return false;
        }
      }
    }

    return true;
  }

  return recursiveCheck(doc, lyra.schema);
}

export function create<T extends PropertiesSchema>(properties: LyraProperties<T>): Lyra<T> {
  const defaultLanguage = (properties?.defaultLanguage?.toLowerCase() as Language) ?? "english";

  if (!SUPPORTED_LANGUAGES.includes(defaultLanguage)) {
    throw new Error(ERRORS.LANGUAGE_NOT_SUPPORTED(defaultLanguage));
  }

  const instance: Lyra<T> = {
    defaultLanguage,
    schema: properties.schema,
    docs: {},
    nodes: {},
    index: {},
    enableStemming: properties.stemming ?? true,
    edge: properties.edge ?? false,
  };

  instance.queue = fastq(instance, _insert.bind(instance), 1) as fastq.queue<QueueDocParams<T>>;

  buildIndex(instance, properties.schema);
  return instance;
}

export function insert<T extends PropertiesSchema>(
  lyra: Lyra<T>,
  doc: ResolveSchema<T>,
  config?: InsertConfig,
): { id: string } {
  config = { language: lyra.defaultLanguage, stemming: lyra.enableStemming, ...config };
  const id = uniqueId();

  if (!SUPPORTED_LANGUAGES.includes(config.language)) {
    throw new Error(ERRORS.LANGUAGE_NOT_SUPPORTED(config.language));
  }

  if (!checkInsertDocSchema(lyra, doc)) {
    throw new Error(ERRORS.INVALID_DOC_SCHEMA(lyra.schema, doc));
  }

  lyra.queue!.push({
    id,
    doc,
    config,
  });

  return { id };
}

export function remove<T extends PropertiesSchema>(lyra: Lyra<T>, docID: string): boolean {
  if (!(docID in lyra.docs)) {
    throw new Error(ERRORS.DOC_ID_DOES_NOT_EXISTS(docID));
  }

  const document = lyra.docs[docID];

  for (const key in document) {
    const idx = lyra.index[key];
    const tokens = tokenize(document[key] as string);

    for (const token of tokens) {
      if (token && removeDocumentByWord(lyra.nodes, idx, token, docID)) {
        throw new Error(ERRORS.CANT_DELETE_DOCUMENT(docID, key, token));
      }
    }
  }

  delete lyra.docs[docID];
  lyra.docs = toFastProperties(lyra.docs);

  return true;
}

export function search<T extends PropertiesSchema>(
  lyra: Lyra<T>,
  params: SearchParams<T>,
  language?: Language,
): SearchResult<T> {
  if (!language) {
    language = lyra.defaultLanguage;
  }

  const tokens = tokenize(params.term, language);
  const indices = getIndices(lyra, params.properties);
  const { limit = 10, offset = 0, exact = false } = params;
  const results: RetrievedDoc<T>[] = Array.from({
    length: limit,
  });
  let count = 0;

  const timeStart = getNanosecondsTime();

  let i = 0;
  let j = 0;

  for (const term of tokens) {
    for (const index of indices) {
      const documentIDs = getDocumentIDsFromSearch(lyra, { ...params, index, term, exact });

      count += documentIDs.length;

      if (i >= limit) {
        break;
      }

      for (const id of documentIDs) {
        if (j < offset) {
          j++;
          continue;
        }

        if (i >= limit) {
          break;
        }

        const fullDoc = lyra.docs[id]!;
        results[i] = { id, ...fullDoc };
        i++;
      }
    }
  }

  const hits = results.filter(Boolean);

  return {
    elapsed: formatNanoseconds(getNanosecondsTime() - timeStart),
    hits,
    count,
  };
}

export function save<T extends PropertiesSchema>(lyra: Lyra<T>): LyraData<T> {
  return { index: lyra.index, docs: lyra.docs, nodes: lyra.nodes };
}

export function load<T extends PropertiesSchema>(lyra: Lyra<T>, { index, docs, nodes }: LyraData<T>) {
  if (!lyra.edge) {
    throw new Error(ERRORS.GETTER_SETTER_WORKS_ON_EDGE_ONLY("load"));
  }

  lyra.index = index;
  lyra.docs = docs;
  lyra.nodes = nodes;
}
