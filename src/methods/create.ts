import type { PropertiesSchema, Configuration, Lyra } from "../types";
import type { Language } from "../tokenizer/languages";
import type { Node } from "../radix-tree/node";
import { defaultTokenizerConfig } from "../tokenizer";
import { intersectTokenScores } from "../utils";
import { assertSupportedLanguage } from "./common";
import { validateHooks } from "./hooks";
import { create as createNode } from "../radix-tree/node";
import * as ERRORS from "../errors";

/**
 * Creates a new database.
 * @param properties Options to initialize the database with.
 * @example
 * // Create a database that stores documents containing 'author' and 'quote' fields.
 * const db = await create({
 *   schema: {
 *     author: 'string',
 *     quote: 'string'
 *   },
 *   hooks: {
 *     afterInsert: [afterInsertHook],
 *   }
 * });
 */
export async function create<S extends PropertiesSchema>(properties: Configuration<S>): Promise<Lyra<S>> {
  const defaultLanguage = (properties?.defaultLanguage?.toLowerCase() as Language) ?? "english";

  assertSupportedLanguage(defaultLanguage);

  validateHooks(properties.hooks);

  const instance: Lyra<S> = {
    defaultLanguage,
    schema: properties.schema,
    docs: {},
    index: {},
    hooks: properties.hooks || {},
    edge: properties.edge ?? false,
    frequencies: {},
    tokenOccurrencies: {},
    components: {
      tokenizer: defaultTokenizerConfig(defaultLanguage, properties.components?.tokenizer ?? {}),
      algorithms: {
        intersectTokenScores: properties.components?.algorithms?.intersectTokenScores ?? intersectTokenScores,
      },
    },
  };

  buildIndex(instance, properties.schema);
  return instance;
}

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
