import type { PropertiesSchema, Configuration, Lyra, InsertConfig, SearchParams, SearchResult, Data } from "../lyra";
import type { Language } from "../tokenizer/languages";
import type { ResolveSchema } from "../types";
import {
  create as createSync,
  insert as insertSync,
  remove as removeSync,
  search as searchSync,
  save as saveSync,
  load as loadSync,
  insertWithHooks as insertWithHooksAsync,
  insertBatch as insertBatchAsync,
} from "../lyra";

/**
 * Creates a new database, returning a promise.
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
  return createSync(properties);
}

/**
 * Inserts a document into a database, returning a promise containing the new document id.
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
  config?: InsertConfig,
): Promise<{ id: string }> {
  return insertSync(lyra, doc, config);
}

/**
 * Removes a document from a database, returning a promise.
 * @param lyra The database to remove the document from.
 * @param docID The id of the document to remove.
 * @example
 * const isDeleted = await remove(db, 'L1tpqQxc0c2djrSN2a6TJ');
 */

export async function remove<S extends PropertiesSchema>(lyra: Lyra<S>, docID: string): Promise<boolean> {
  return removeSync(lyra, docID);
}

/**
 * Searches for documents in a database, returning a promise.
 * @param lyra The database to search.
 * @param params The search query.
 * @param language Optional parameter to override the default language analyzer.
 * @example
 * // Search for documents that contain 'Michael' in the 'author' field.
 * const result = await search(db, {
 *   term: 'Michael',
 *   properties: ['author']
 * });
 */
export async function search<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  params: SearchParams<S>,
  language?: Language,
): Promise<SearchResult<S>> {
  return searchSync(lyra, params, language);
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
export const insertWithHooks = insertWithHooksAsync;

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
export const insertBatch = insertBatchAsync;

export async function save<S extends PropertiesSchema>(lyra: Lyra<S>): Promise<Data<S>> {
  return saveSync(lyra);
}

export function load<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  { index, docs, schema, frequencies, tokenOccurrencies }: Data<S>,
) {
  return loadSync(lyra, { index, docs, schema, frequencies, tokenOccurrencies });
}
