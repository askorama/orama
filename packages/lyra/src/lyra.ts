import type { queueAsPromised } from "fastq";
import { nanoid } from "nanoid";
import * as fastq from "fastq";
import { Trie } from "./prefix-tree/trie";
import * as ERRORS from "./errors";
import { tokenize } from "./tokenizer";
import { formatNanoseconds, getNanosecondsTime } from "./utils";
import { Language, SUPPORTED_LANGUAGES } from "./stemmer";

export type PropertyType = "string" | "number" | "boolean";

export type PropertiesSchema = {
  [key: string]: PropertyType | PropertiesSchema;
};

export type LyraProperties = {
  schema: PropertiesSchema;
  defaultLanguage?: Language;
};

export type LyraDocs = Map<string, object>;

export type SearchParams = {
  term: string;
  properties?: "*" | string[];
  limit?: number;
  offset?: number;
  exact?: boolean | undefined;
};

type LyraIndex = Map<string, Trie>;

type QueueDocParams = {
  id: string;
  doc: object;
  language: Language;
};

type SearchResult = Promise<{
  count: number;
  hits: object[];
  elapsed: string;
}>;

export class Lyra {
  private defaultLanguage: Language = "english";
  private schema: PropertiesSchema;
  private docs: LyraDocs = new Map();
  private index: LyraIndex = new Map();
  private queue: queueAsPromised<QueueDocParams> = fastq.promise(
    this,
    this._insert,
    1
  );

  constructor(properties: LyraProperties) {
    const defaultLanguage =
      (properties?.defaultLanguage?.toLowerCase() as Language) ?? "english";

    if (!SUPPORTED_LANGUAGES.includes(defaultLanguage)) {
      throw ERRORS.LANGUAGE_NOT_SUPPORTED(defaultLanguage);
    }

    this.defaultLanguage = defaultLanguage;
    this.schema = properties.schema;
    this.buildIndex(properties.schema);
  }

  private buildIndex(schema: PropertiesSchema) {
    for (const prop in schema) {
      const propType = typeof prop;

      if (propType === "string") {
        this.index.set(prop, new Trie());
      } else if (propType === "object") {
        // @todo nested properties will be supported with the next versions
        //this.buildIndex(prop as unknown as PropertiesSchema);
        throw ERRORS.UNSUPPORTED_NESTED_PROPERTIES();
      } else {
        throw ERRORS.INVALID_SCHEMA_TYPE(propType);
      }
    }
  }

  async search(
    params: SearchParams,
    language: Language = this.defaultLanguage
  ): SearchResult {
    const tokens = tokenize(params.term, language).values();
    const indices = this.getIndices(params.properties);
    const { limit = 10, offset = 0, exact = false } = params;
    const results: object[] = new Array({ length: limit });
    let totalResults = 0;

    const timeStart = getNanosecondsTime();

    let i = 0;
    let j = 0;

    for (const token of tokens) {
      for (const index of indices) {
        const documentIDs = await this.getDocumentIDsFromSearch({
          ...params,
          index: index,
          term: token,
          exact: exact,
        });

        totalResults += documentIDs.size;

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

            const fullDoc = this.docs.get(id);
            results[i] = { id, ...fullDoc };
            i++;
          }
        }
      }
    }

    return {
      elapsed: formatNanoseconds(getNanosecondsTime() - timeStart),
      hits: results,
      count: totalResults,
    };
  }

  private getIndices(indices: SearchParams["properties"]): string[] {
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
    params: SearchParams & { index: string }
  ): Promise<Set<string>> {
    const idx = this.index.get(params.index);
    const searchResult = idx?.find({
      term: params.term,
      exact: params.exact,
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
    doc: object,
    language: Language = this.defaultLanguage
  ): Promise<{ id: string }> {
    const id = nanoid();

    if (!SUPPORTED_LANGUAGES.includes(language)) {
      throw ERRORS.LANGUAGE_NOT_SUPPORTED(language);
    }

    if (!(await this.checkInsertDocSchema(doc))) {
      throw ERRORS.INVALID_DOC_SCHEMA(this.schema, doc);
    }

    await this.queue.push({
      id,
      doc,
      language,
    });

    return { id };
  }

  private async _insert({ doc, id, language }: QueueDocParams): Promise<void> {
    const index = this.index;
    this.docs.set(id, doc);

    function recursiveTrieInsertion(doc: object) {
      for (const key in doc) {
        if (typeof (doc as any)[key] === "object") {
          throw ERRORS.UNSUPPORTED_NESTED_PROPERTIES();
          // @todo nested properties will be supported with the nexrt versions
          // recursiveTrieInsertion((doc as any)[key]);
        } else if (typeof (doc as any)[key] === "string") {
          const requestedTrie = index.get(key);
          const tokens = tokenize((doc as any)[key], language);

          for (const token of tokens) {
            requestedTrie?.insert(token, id);
          }
        }
      }
    }

    recursiveTrieInsertion(doc);
  }

  private async checkInsertDocSchema(
    doc: QueueDocParams["doc"]
  ): Promise<boolean> {
    function recursiveCheck(
      newDoc: QueueDocParams["doc"],
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
