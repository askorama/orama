import { Language, TokenizerConfigExec } from "../tokenizer/index.js";
import * as ERRORS from "../errors.js";
import { trackInsertion } from "../insertion-checker.js";
import { insert as radixInsert } from "../radix-tree/radix.js";
import type { Lyra, PropertiesSchema, ResolveSchema } from "../types.js";
import { uniqueId } from "../utils.js";
import { assertDocSchema } from "./common.js";
import { hookRunner } from "./hooks.js";

export type InsertConfig<S extends PropertiesSchema> = {
  language?: Language;
  id?: (doc: ResolveSchema<S>) => string | Promise<string>;
};

export type InsertBatchConfig<S extends PropertiesSchema> = InsertConfig<S> & {
  batchSize?: number;
};

/**
 * Inserts a document into a database.
 * @param lyra The database to insert document into.
 * @param doc The document to insert.
 * @param config Optional parameter for overriding default configuration.
 * @returns An object containing id of the inserted document.
 * @example
 * const { id } = await insert(db, {
 *   quote: 'You miss 100% of the shots you don\'t take',
 *   author: 'Wayne Gretzky - Michael Scott'
 * });
 */
export async function insert<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  doc: ResolveSchema<S>,
  config?: InsertConfig<S>,
): Promise<{ id: string }> {
  config = { language: lyra.defaultLanguage, ...config };

  const id = await getDocumentID(doc, config);

  // If the ID already exists, we throw an error.
  if (lyra.docs[id]) throw new Error(ERRORS.ID_ALREADY_EXISTS(id));

  lyra.components?.tokenizer?.assertSupportedLanguage?.(config.language!);

  assertDocSchema(doc, lyra.schema);

  lyra.docs[id] = doc;
  lyra.docsCount++;
  recursiveradixInsertion(lyra, doc, id, config, undefined, lyra.components?.tokenizer as TokenizerConfigExec);
  trackInsertion(lyra);

  return { id };
}

/**
 * Inserts a document into a database.
 * @param lyra The database to insert document into.
 * @param doc The document to insert.
 * @param config Optional parameter for overriding default configuration.
 * @returns A Promise object containing id of the inserted document.
 * @example
 * const { id } = await insert(db, {
 *   quote: 'You miss 100% of the shots you don\'t take',
 *   author: 'Wayne Gretzky - Michael Scott'
 * });
 */
export async function insertWithHooks<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  doc: ResolveSchema<S>,
  config?: InsertConfig<S>,
): Promise<{ id: string }> {
  config = { language: lyra.defaultLanguage, ...config };
  const id = await getDocumentID(doc, config);

  lyra.components?.tokenizer?.assertSupportedLanguage?.(config.language!);

  assertDocSchema(doc, lyra.schema);

  lyra.docs[id] = doc;
  lyra.docsCount++;
  recursiveradixInsertion(lyra, doc, id, config, undefined, lyra.components?.tokenizer as TokenizerConfigExec);
  trackInsertion(lyra);
  if (lyra.hooks.afterInsert) {
    await hookRunner.call(lyra, lyra.hooks.afterInsert, id);
  }

  return { id };
}

/**
 * Inserts a large array of documents into a database without blocking the event loop.
 * @param lyra The database to insert document into.
 * @param docs Array of documents to insert.
 * @param config Optional parameter for overriding default configuration.
 * @returns Promise<void>.
 * @example
 * insertBatch(db, [
 *   {
 *     quote: 'You miss 100% of the shots you don\'t take',
 *     author: 'Wayne Gretzky - Michael Scott'
 *   },
 *   {
 *     quote: 'What I cannot createm I do not understand',
 *     author: 'Richard Feynman'
 *   }
 * ]);
 */
export async function insertBatch<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  docs: ResolveSchema<S>[],
  config?: InsertBatchConfig<S>,
): Promise<void> {
  const batchSize = config?.batchSize ?? 1000;

  return new Promise((resolve, reject) => {
    let i = 0;
    async function _insertBatch() {
      const batch = docs.slice(i * batchSize, (i + 1) * batchSize);
      i++;

      if (!batch.length) {
        return resolve();
      }

      for (const line of batch) {
        try {
          await insertWithHooks(lyra, line, config);
        } catch (err) {
          reject(err);
        }
      }

      setTimeout(_insertBatch, 0);
    }

    setTimeout(_insertBatch, 0);
  });
}

function recursiveradixInsertion<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  doc: ResolveSchema<S>,
  id: string,
  config: InsertConfig<S>,
  prefix = "",
  tokenizerConfig: TokenizerConfigExec,
  schema: PropertiesSchema = lyra.schema,
) {
  config = { language: lyra.defaultLanguage, ...config };
  const { index, frequencies, tokenOccurrencies } = lyra;

  for (const key of Object.keys(doc)) {
    const isNested = typeof doc[key] === "object";
    const isSchemaNested = typeof schema[key] == "object";
    const propName = `${prefix}${key}`;
    if (isNested && key in schema && isSchemaNested) {
      recursiveradixInsertion(
        lyra,
        doc[key] as ResolveSchema<S>,
        id,
        config,
        propName + ".",
        tokenizerConfig,
        schema[key] as PropertiesSchema,
      );
    }

    if (typeof doc[key] === "string" && key in schema && !isSchemaNested) {
      // Use propName here because if doc is a nested object
      // We will get the wrong index
      const requestedTrie = index[propName];
      const tokens = tokenizerConfig.tokenizerFn(doc[key] as string, config.language!, false, tokenizerConfig);

      if (!(propName in frequencies)) {
        frequencies[propName] = {};
      }

      if (!(propName in tokenOccurrencies)) {
        tokenOccurrencies[propName] = {};
      }

      if (!(id in frequencies[propName])) {
        frequencies[propName][id] = {};
      }

      for (const token of tokens) {
        let tokenFrequency = 0;

        for (const t of tokens) {
          if (t === token) {
            tokenFrequency++;
          }
        }

        const tf = tokenFrequency / tokens.length;

        frequencies[propName][id][token] = tf;

        if (!(token in tokenOccurrencies[propName])) {
          tokenOccurrencies[propName][token] = 0;
        }

        // increase a token counter that may not yet exist
        tokenOccurrencies[propName][token] = (tokenOccurrencies[propName][token] ?? 0) + 1;

        radixInsert(requestedTrie, token, id);
      }
    }
  }
}

async function getDocumentID<S extends PropertiesSchema>(
  doc: ResolveSchema<S>,
  config: InsertConfig<S>,
): Promise<string> {
  let id: string;

  // If the user passes a custom ID function, we use it to generate the ID.
  // This has the maximum priority.
  if (config?.id) {
    id = await config.id(doc);

    // If the user passes an ID in the document, we use it.
  } else if (doc.id && typeof doc.id === "string") {
    id = doc.id;

    // If the user passes an ID in the document, but it's not a string, we throw a type error.
  } else if (doc.id && typeof doc.id !== "string") {
    throw new TypeError(ERRORS.TYPE_ERROR_ID_MUST_BE_STRING(typeof doc.id));

    // If the user doesn't pass an ID, we generate one.
  } else {
    id = uniqueId();
  }

  return id;
}
