import type { PropertiesSchema, Lyra, ResolveSchema } from "../types/index.js";

/**
 * Gets a document from a Lyra database by its ID.
 * @template S - The schema type for the Lyra database.
 * @param {Lyra<S>} db - The Lyra database to get the document from.
 * @param {string} id - The ID of the document to get.
 * @returns {Promise<ResolveSchema<S> | undefined>} - The document with the given ID, or undefined if it doesn't exist.
 * @example
 * 
 * import { getByID } from '@lyrasearch/lyra';
 * 
 * const doc = await getByID(db, 'doc1'); // { id: 'doc1', title: 'Hello World' }
 * const doc = await getByID(db, 'doc4'); // undefined 
 */
export async function getByID<S extends PropertiesSchema>(db: Lyra<S>, id: string): Promise<ResolveSchema<S> | undefined> {
  return db.docs[id];
}

/**
 * Counts the number of documents in a Lyra database.
 * @template S - The schema type for the Lyra database.
 * @param {Lyra<S>} db - The Lyra database to count documents in.
 * @returns {Promise<number>} - The number of documents in the Lyra database.
 * @example
 * 
 * import { count } from '@lyrasearch/lyra';
 * 
 * const numDocs = await count(db); // 3
*/
export async function count<S extends PropertiesSchema>(db: Lyra<S>): Promise<number> {
  return Object.keys(db.docs).length;
}
