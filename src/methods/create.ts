import type { Configuration, Lyra, PropertiesSchema } from "../types.js";
import { defaultTokenizerConfig, Language } from "../tokenizer/index.js";
import * as ERRORS from "../errors.js";
import { create as createNode } from "../radix-tree/node.js";
import { validateHooks } from "./hooks.js";
import { intersectTokenScores } from "../algorithms.js";

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

  const tokenizer = defaultTokenizerConfig(defaultLanguage, properties.components?.tokenizer ?? {});
  tokenizer.assertSupportedLanguage(defaultLanguage);

  validateHooks(properties.hooks);

  const instance: Lyra<S> = {
    defaultLanguage,
    schema: properties.schema,
    docs: {},
    docsCount: 0,
    index: {},
    hooks: properties.hooks || {},
    edge: properties.edge ?? false,
    frequencies: {},
    tokenOccurrencies: {},
    avgFieldLength: {},
    fieldLengths: {},
    components: {
      elapsed: properties.components?.elapsed ?? {},
      tokenizer,
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
      lyra.avgFieldLength[propName] = 0;
    }
  }
}
