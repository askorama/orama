import type { queueAsPromised } from "fastq";
import { nanoid } from "nanoid";
import * as fastq from "fastq";
import { Trie } from "./prefix-tree/trie";
import * as ERRORS from "./errors";
import { tokenize } from "./tokenizer";
import { formatNanoseconds, getNanosecondsTime } from "./utils";

export type PropertyType = "string" | "number" | "boolean";

export type PropertiesSchema = {
  [key: string]: PropertyType | PropertiesSchema;
};

export type LyraProperties = {
  schema: PropertiesSchema;
};

export type LyraDocs = Map<string, object>;

export type SearchParams = {
  term: string;
  properties?: "*" | string[];
  limit?: number;
  offset?: number;
};

type LyraIndex = Map<string, Trie>;

type QueueDocParams = {
  id: string;
  doc: object;
};

type SearchResult = Promise<{
  count: number;
  hits: object[];
  elapsed: string;
}>;

export class Lyra {
  private schema: PropertiesSchema;
  private docs: LyraDocs = new Map();
  private index: LyraIndex = new Map();
  private queue: queueAsPromised<QueueDocParams> = fastq.promise(
    this,
    this._insert,
    1
  );

  constructor(properties: LyraProperties) {
    this.schema = properties.schema;
    this.buildIndex(properties.schema);
  }

  private buildIndex(schema: PropertiesSchema) {
    for (const prop in schema) {
      const propType = typeof prop;

      if (propType === "string") {
        this.index.set(prop, new Trie());
      } else if (propType === "object") {
        // @todo nested properties will be supported with the nexrt versions
        //this.buildIndex(prop as unknown as PropertiesSchema);
        throw ERRORS.UNSUPPORTED_NESTED_PROPERTIES();
      } else {
        throw ERRORS.INVALID_SCHEMA_TYPE(propType);
      }
    }
  }

  async search(params: SearchParams): SearchResult {
    const tokens = tokenize(params.term).values();
    const indices = this.getIndices(params.properties);
    const results: object[] = [];

    const timeStart = getNanosecondsTime();

    for (const token of tokens) {
      for (const index of indices) {
        const searchResult = await this._search({
          ...params,
          index: index,
          term: token,
        });

        if (searchResult.length) {
          for (const res of searchResult) {
            results.push(res);
          }
        }
      }
    }

    const { limit = 10, offset = 0 } = params;

    return {
      elapsed: formatNanoseconds(getNanosecondsTime() - timeStart),
      // @todo avoid getting all results and slicing them.
      hits: results.slice(offset, limit + offset),
      count: results.length,
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

  private async _search(
    params: SearchParams & { index: string }
  ): Promise<object[]> {
    const idx = this.index.get(params.index);
    const searchResult = idx?.find(params.term);
    const results: object[] = [];

    for (const key in searchResult) {
      const docs: string[] = [];

      for (const id of (searchResult as any)[key]) {
        const fullDoc = this.docs.get(id);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        docs.push({ id, ...fullDoc });
      }

      results.push(docs);
    }

    return results.flat();
  }

  public async insert(doc: object): Promise<{ id: string }> {
    const id = nanoid();

    if (!(await this.checkInsertDocSchema(doc))) {
      throw ERRORS.INVALID_DOC_SCHEMA(this.schema, doc);
    }

    await this.queue.push({
      id,
      doc,
    });

    return { id };
  }

  private async _insert({ doc, id }: QueueDocParams): Promise<void> {
    const index = this.index;
    this.docs.set(id, doc);

    function recursiveTrieInsertion(doc: object) {
      for (const key in doc) {
        if (typeof (doc as any)[key] === "object") {
          throw ERRORS.UNSUPPORTED_NESTED_PROPERTIES();
          // @todo nested properties will be supported with the nexrt versions
          // recursiveTrieInsertion((doc as any)[key]);
        } else {
          const requestedTrie = index.get(key);
          const tokens = tokenize((doc as any)[key]);

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
