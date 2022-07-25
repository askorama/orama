import { nanoid } from "nanoid";
import fastq from "fastq";
import { Trie } from "./prefix-tree/trie";
import * as ERRORS from "./errors";
import toFastProperties, { insertWithFastProperties } from "./fast-properties";
import { tokenize } from "./tokenizer";
import { formatNanoseconds, getNanosecondsTime } from "./utils";
import { Language, SUPPORTED_LANGUAGES } from "./stemmer";
import type { ResolveSchema, SearchProperties } from "./types";

export type PropertyType = "string" | "number" | "boolean";

export type PropertiesSchema = {
  [key: string]: PropertyType | PropertiesSchema;
};

export type LyraProperties<
  TSchema extends PropertiesSchema = PropertiesSchema
> = {
  schema: TSchema;
  defaultLanguage?: Language;
  stemming?: boolean;
  edge?: boolean;
};

export type LyraDocs<TDoc extends PropertiesSchema> = Record<
  string,
  ResolveSchema<TDoc>
>;

export type SearchParams<TSchema extends PropertiesSchema> = {
  term: string;
  properties?: "*" | SearchProperties<TSchema>[];
  limit?: number;
  offset?: number;
  exact?: boolean;
  tolerance?: number;
};

export type InsertConfig = {
  language: Language;
  stemming: boolean;
};

export type LyraData<TSchema extends PropertiesSchema = PropertiesSchema> = {
  docs: LyraDocs<TSchema>
  index: LyraIndex, 
}

type LyraIndex = Record<string, Trie>;

type QueueDocParams<TTSchema extends PropertiesSchema> = {
  id: string;
  doc: ResolveSchema<TTSchema>;
  config: InsertConfig;
};

type SearchResult<TTSchema extends PropertiesSchema> = {
  count: number;
  hits: RetrievedDoc<TTSchema>[];
  elapsed: string;
};

type RetrievedDoc<TDoc extends PropertiesSchema> = ResolveSchema<TDoc> & {
  id: string;
};

export class Lyra<TSchema extends PropertiesSchema = PropertiesSchema> {
  private defaultLanguage: Language = "english";
  private schema: TSchema;
  private docs: LyraDocs<TSchema> = {};
  private index: LyraIndex = {};
  private enableStemming = true;
  private edge = false;

  private queue: fastq.queue<QueueDocParams<TSchema>> = fastq(
    this,
    this._insert,
    1
  );

  constructor(properties: LyraProperties<TSchema>) {
    const defaultLanguage =
      (properties?.defaultLanguage?.toLowerCase() as Language) ?? "english";

    if (!SUPPORTED_LANGUAGES.includes(defaultLanguage)) {
      throw ERRORS.LANGUAGE_NOT_SUPPORTED(defaultLanguage);
    }

    if (properties.edge) {
      this.edge = true;
    }

    this.enableStemming = properties?.stemming ?? true;
    this.defaultLanguage = defaultLanguage;
    this.schema = properties.schema;
    this.buildIndex(properties.schema);
  }

  private buildIndex(schema: TSchema, prefix = "") {
    for (const prop of Object.keys(schema)) {
      const propType = typeof prop;
      const isNested = typeof schema[prop] === "object";

      if (propType !== "string") throw ERRORS.INVALID_SCHEMA_TYPE(propType);

      const propName = `${prefix}${prop}`;

      if (isNested) {
        this.buildIndex(schema[prop] as TSchema, `${propName}.`);
      } else {
        this.index = insertWithFastProperties(this.index, propName, new Trie());
      }
    }
  }

  search(
    params: SearchParams<TSchema>,
    language: Language = this.defaultLanguage
  ): SearchResult<TSchema> {
    const tokens = tokenize(params.term, language);
    const indices = this.getIndices(params.properties);
    const { limit = 10, offset = 0, exact = false } = params;
    const results: RetrievedDoc<TSchema>[] = Array.from({
      length: limit,
    });
    let count = 0;

    const timeStart = getNanosecondsTime();

    let i = 0;
    let j = 0;

    for (const term of tokens) {
      for (const index of indices) {
        const documentIDs = this.getDocumentIDsFromSearch({
          ...params,
          index,
          term,
          exact,
        });

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

          const fullDoc = this.docs[id]!;
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

  private getIndices(indices: SearchParams<TSchema>["properties"]): string[] {
    const knownIndices = Object.keys(this.index);

    if (!indices) {
      return knownIndices;
    }

    if (typeof indices === "string") {
      if (indices === "*") {
        return knownIndices;
      } else {
        throw ERRORS.INVALID_PROPERTY(indices, knownIndices);
      }
    }

    for (const index of indices as string[]) {
      if (!knownIndices.includes(index)) {
        throw ERRORS.INVALID_PROPERTY(index, knownIndices);
      }
    }

    return indices as string[];
  }

  delete(docID: string): boolean {
    if (!(docID in this.docs)) {
      throw ERRORS.DOC_ID_DOES_NOT_EXISTS(docID);
    }

    const document = this.docs[docID];

    for (const key in document) {
      const idx = this.index[key];
      const tokens = tokenize(document[key] as string);

      for (const token of tokens) {
        if (idx.removeDocByWord(token, docID)) {
          throw `Unable to remove document "${docID}" from index "${key}" on word "${token}".`;
        }
      }
    }

    delete this.docs[docID];
    this.docs = toFastProperties(this.docs);

    return true;
  }

  private getDocumentIDsFromSearch(
    params: SearchParams<TSchema> & { index: string }
  ): string[] {
    const idx = this.index[params.index];

    const searchResult = idx?.find({
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

  public insert(
    doc: ResolveSchema<TSchema>,
    config: InsertConfig = {
      language: this.defaultLanguage,
      stemming: this.enableStemming,
    }    
  ): { id: string } {
    const id = nanoid();
    const language = config.language ?? this.defaultLanguage;

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      throw ERRORS.LANGUAGE_NOT_SUPPORTED(language);
    }

    if (!this.checkInsertDocSchema(doc)) {
      throw ERRORS.INVALID_DOC_SCHEMA(this.schema, doc);
    }

    this.queue.push({
      id,
      doc,
      config,
    });

    return { id };
  }

  private _insert({
    doc,
    id,
    config    
  }: QueueDocParams<TSchema>, cb: (error: Error | null) => void): void {
    const index = this.index;
    this.docs = insertWithFastProperties(this.docs, id, doc);

    function recursiveTrieInsertion(doc: ResolveSchema<TSchema>, prefix = "") {
      for (const key of Object.keys(doc)) {
        const isNested = typeof doc[key] === "object";
        const propName = `${prefix}${key}`;
        if (isNested) {
          recursiveTrieInsertion(
            doc[key] as ResolveSchema<TSchema>,
            `${propName}.`
          );

          return;
        } 
        
        if (typeof doc[key] === "string") {
          // Use propName here because if doc is a nested object
          // We will get the wrong index
          const requestedTrie = index[propName];
          const tokens = tokenize(
            doc[key] as string,
            config.language,
            config.stemming
          );

          for (const token of tokens) {
            requestedTrie?.insert(token, id);
          }
        }
      
        cb(null);
      }
    }

    recursiveTrieInsertion(doc);
  }

  private checkInsertDocSchema(
    doc: QueueDocParams<TSchema>["doc"]
  ): boolean {
    function recursiveCheck(
      newDoc: QueueDocParams<TSchema>["doc"],
      schema: PropertiesSchema
    ): boolean {
      for (const key in newDoc) {
        if (!(key in schema)) {
          return false;
        }

        const propType = typeof newDoc[key];

        if (propType === "object") {
          recursiveCheck(newDoc[key] as QueueDocParams<TSchema>["doc"], schema);
        } else {
          if (typeof newDoc[key] !== schema[key]) {
            return false;
          }
        }
      }

      return true;
    }

    return recursiveCheck(doc, this.schema);
  }

  save(): LyraData<TSchema> {
    return {index: this.index, docs: this.docs};
  }

  load({index, docs}: LyraData<TSchema>) {
    if(!this.edge) {
      throw ERRORS.GETTER_SETTER_WORKS_ON_EDGE_ONLY("setDocs");
    }

    this.index = index;
    this.docs = docs;
  }
}
