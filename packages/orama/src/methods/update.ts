import { runMultipleHook, runSingleHook } from '../components/hooks.js'
import { createError } from '../errors.js'
import { Document, OpaqueDocumentStore, OpaqueIndex, OpaqueSorter, Orama, Schema } from '../types.js'
import { innerInsertMultiple, insert } from './insert.js'
import { remove, removeMultiple } from './remove.js'

export async function update<
  S extends Schema,
  I extends OpaqueIndex,
  D extends OpaqueDocumentStore,
  So extends OpaqueSorter,
>(orama: Orama<S, I, D, So>, id: string, doc: Document, language?: string, skipHooks?: boolean): Promise<string> {
  if (!skipHooks && orama.beforeUpdate) {
    await runSingleHook(orama.beforeUpdate, orama, id)
  }

  await remove(orama, id, language, skipHooks)
  const newId = await insert(orama, doc, language, skipHooks)

  if (!skipHooks && orama.afterUpdate) {
    await runSingleHook(orama.afterUpdate, orama, newId)
  }

  return newId
}

export async function updateMultiple<
  S extends Schema,
  I extends OpaqueIndex,
  D extends OpaqueDocumentStore,
  So extends OpaqueSorter,
>(
  orama: Orama<S, I, D, So>,
  ids: string[],
  docs: Document[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
): Promise<string[]> {
  if (!skipHooks) {
    await runMultipleHook(orama.beforeMultipleUpdate, orama, ids)
  }

  // Validate all documents before the insertion
  const docsLength = docs.length
  for (let i = 0; i < docsLength; i++) {
    const errorProperty = await orama.validateSchema(docs[i], orama.schema)
    if (errorProperty) {
      throw createError('SCHEMA_VALIDATION_FAILURE', errorProperty)
    }
  }

  await removeMultiple(orama, ids, batchSize, language, skipHooks)
  const newIds = await innerInsertMultiple(orama, docs, batchSize, language, skipHooks)

  if (!skipHooks) {
    await runMultipleHook(orama.afterMultipleUpdate, orama, newIds)
  }

  return newIds
}
