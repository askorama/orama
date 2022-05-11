import type { queueAsPromised } from "fastq";
import { nanoid } from "nanoid";
import * as fastq from "fastq";
import { Trie } from "./prefix-tree/trie";
import * as ERRORS from "./errors";

export type PropertyType = "string" | "number" | "boolean";

export type PropertiesSchema = {
  [key: string]: PropertyType | PropertiesSchema;
};

export type LyraProperties = {
  schema: PropertiesSchema;
};

export type LyraDocs = Map<string, object>;

type LyraIndex = Map<string, Trie>;

type QueueDocParams = {
  id: string;
  doc: object;
};

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
        this.buildIndex(prop as unknown as PropertiesSchema);
      } else {
        throw ERRORS.INVALID_SCHEMA_TYPE(propType);
      }
    }
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private async _insert(doc: QueueDocParams): Promise<void> {}

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
