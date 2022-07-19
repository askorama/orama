import type { queueAsPromised } from "fastq";
import { nanoid } from "nanoid";
import * as fastq from "fastq";
import { Trie } from "./prefix-tree/trie";
import * as ERRORS from "./errors";
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
};

export type LyraDocs<TDoc extends PropertiesSchema> = Map<
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

type LyraIndex = Map<string, Trie>;

type QueueDocParams<TTSchema extends PropertiesSchema> = {
  id: string;
  doc: ResolveSchema<TTSchema>;
  config: InsertConfig;
};

type SearchResult<TTSchema extends PropertiesSchema> = Promise<{
  count: number;
  hits: RetrievedDoc<TTSchema>[];
  elapsed: string;
}>;

type RetrievedDoc<TDoc extends PropertiesSchema> = ResolveSchema<TDoc> & {
  id: string;
};

export class Lyra<TSchema extends PropertiesSchema = PropertiesSchema> {
  private defaultLanguage: Language = "english";
  private schema: TSchema;
  private docs: LyraDocs<TSchema> = new Map();
  private index: LyraIndex = new Map();
  private enableStemming = true;

  private queue: queueAsPromised<QueueDocParams<TSchema>> = fastq.promise(
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
        this.index.set(propName, new Trie());
      }
    }
  }

  async search(
    params: SearchParams<TSchema>,
    language: Language = this.defaultLanguage
  ): SearchResult<TSchema> {
    const tokens = tokenize(params.term, language).values();
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
        const documentIDs = await this.getDocumentIDsFromSearch({
          ...params,
          index,
          term,
          exact,
        });

        count += documentIDs.size;

        if (i >= limit) {
          break;
        }

        if (documentIDs.size) {
          for (const id of documentIDs) {
            if (j < offset) {
              j++;
              continue;
            }

            if (i >= limit) {
              break;
            }

            const fullDoc = this.docs.get(id)!;
            results[i] = { id, ...fullDoc };
            i++;
          }
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
    const knownIndices = [...this.index.keys()];

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

  async delete(docID: string): Promise<boolean> {
    if (!this.docs.has(docID)) {
      throw ERRORS.DOC_ID_DOES_NOT_EXISTS(docID);
    }

    const document = this.docs.get(docID)!;

    for (const key in document) {
      const idx = this.index.get(key)!;
      const tokens = tokenize((document as any)[key]);

      for (const token of tokens) {
        if (idx.removeDocByWord(token, docID)) {
          throw `Unable to remove document "${docID}" from index "${key}" on word "${token}".`;
        }
      }
    }

    this.docs.delete(docID);

    return true;
  }

  private async getDocumentIDsFromSearch(
    params: SearchParams<TSchema> & { index: string }
  ): Promise<Set<string>> {
    const idx = this.index.get(params.index);
    const searchResult = idx?.find({
      term: params.term,
      exact: params.exact,
      tolerance: params.tolerance,
    });
    const ids = new Set<string>();

    for (const key in searchResult) {
      for (const id of (searchResult as any)[key]) {
        ids.add(id);
      }
    }
    return ids;
  }

  public async insert(
    doc: ResolveSchema<TSchema>,
    config: InsertConfig = {
      language: this.defaultLanguage,
      stemming: this.enableStemming,
    }
  ): Promise<{ id: string }> {
    const id = nanoid();
    const language = config.language ?? this.defaultLanguage;

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      throw ERRORS.LANGUAGE_NOT_SUPPORTED(language);
    }

    if (!(await this.checkInsertDocSchema(doc))) {
      throw ERRORS.INVALID_DOC_SCHEMA(this.schema, doc);
    }

    await this.queue.push({
      id,
      doc,
      config,
    });

    return { id };
  }

  private async _insert({
    doc,
    id,
    config,
  }: QueueDocParams<TSchema>): Promise<void> {
    const index = this.index;
    this.docs.set(id, doc);

    function recursiveTrieInsertion(doc: ResolveSchema<TSchema>, prefix = "") {
      for (const key of Object.keys(doc)) {
        const isNested = typeof doc[key] === "object";
        const propName = `${prefix}${key}`;
        if (isNested) {
          recursiveTrieInsertion(
            doc[key] as ResolveSchema<TSchema>,
            `${propName}.`
          );
        } else if (typeof doc[key] === "string") {
          // Use propName here because if doc is a nested object
          // We will get the wrong index
          const requestedTrie = index.get(propName);
          const tokens = tokenize(
            doc[key] as string,
            config.language,
            config.stemming
          );

          for (const token of tokens) {
            requestedTrie?.insert(token, id);
          }
        }
      }
    }

    recursiveTrieInsertion(doc);
  }

  private async checkInsertDocSchema(
    doc: QueueDocParams<TSchema>["doc"]
  ): Promise<boolean> {
    function recursiveCheck(
      newDoc: QueueDocParams<TSchema>["doc"],
      schema: PropertiesSchema
    ): boolean {
      for (const key in newDoc) {
        if (!(key in schema)) {
          return false;
        }

        const propType = typeof (newDoc as any)[key];

        if (propType === "object") {
          recursiveCheck((newDoc as any)[key], schema);
        } else {
          if (typeof (newDoc as any)[key] !== schema[key]) {
            return false;
          }
        }
      }

      return true;
    }

    return recursiveCheck(doc, this.schema);
  }
}
