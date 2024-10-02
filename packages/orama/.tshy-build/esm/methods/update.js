import { runMultipleHook, runSingleHook } from '../components/hooks.js'
import { createError } from '../errors.js'
import { innerInsertMultiple, insert } from './insert.js'
import { remove, removeMultiple } from './remove.js'
import { isAsyncFunction } from '../utils.js'
export function update(orama, id, doc, language, skipHooks) {
  const asyncNeeded =
    isAsyncFunction(orama.afterInsert) ||
    isAsyncFunction(orama.beforeInsert) ||
    isAsyncFunction(orama.afterRemove) ||
    isAsyncFunction(orama.beforeRemove) ||
    isAsyncFunction(orama.beforeUpdate) ||
    isAsyncFunction(orama.afterUpdate)
  if (asyncNeeded) {
    return updateAsync(orama, id, doc, language, skipHooks)
  }
  return updateSync(orama, id, doc, language, skipHooks)
}
async function updateAsync(orama, id, doc, language, skipHooks) {
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
function updateSync(orama, id, doc, language, skipHooks) {
  if (!skipHooks && orama.beforeUpdate) {
    runSingleHook(orama.beforeUpdate, orama, id)
  }
  remove(orama, id, language, skipHooks)
  const newId = insert(orama, doc, language, skipHooks)
  if (!skipHooks && orama.afterUpdate) {
    runSingleHook(orama.afterUpdate, orama, newId)
  }
  return newId
}
export function updateMultiple(orama, ids, docs, batchSize, language, skipHooks) {
  const asyncNeeded =
    isAsyncFunction(orama.afterInsert) ||
    isAsyncFunction(orama.beforeInsert) ||
    isAsyncFunction(orama.afterRemove) ||
    isAsyncFunction(orama.beforeRemove) ||
    isAsyncFunction(orama.beforeUpdate) ||
    isAsyncFunction(orama.afterUpdate) ||
    isAsyncFunction(orama.beforeUpdateMultiple) ||
    isAsyncFunction(orama.afterUpdateMultiple)
  isAsyncFunction(orama.beforeRemoveMultiple) ||
    isAsyncFunction(orama.afterRemoveMultiple) ||
    isAsyncFunction(orama.beforeInsertMultiple) ||
    isAsyncFunction(orama.afterInsertMultiple)
  if (asyncNeeded) {
    return updateMultipleAsync(orama, ids, docs, batchSize, language, skipHooks)
  }
  return updateMultipleSync(orama, ids, docs, batchSize, language, skipHooks)
}
async function updateMultipleAsync(orama, ids, docs, batchSize, language, skipHooks) {
  if (!skipHooks) {
    await runMultipleHook(orama.beforeUpdateMultiple, orama, ids)
  }
  const docsLength = docs.length
  for (let i = 0; i < docsLength; i++) {
    const errorProperty = orama.validateSchema(docs[i], orama.schema)
    if (errorProperty) {
      throw createError('SCHEMA_VALIDATION_FAILURE', errorProperty)
    }
  }
  await removeMultiple(orama, ids, batchSize, language, skipHooks)
  const newIds = await innerInsertMultiple(orama, docs, batchSize, language, skipHooks)
  if (!skipHooks) {
    await runMultipleHook(orama.afterUpdateMultiple, orama, newIds)
  }
  return newIds
}
function updateMultipleSync(orama, ids, docs, batchSize, language, skipHooks) {
  if (!skipHooks) {
    runMultipleHook(orama.beforeUpdateMultiple, orama, ids)
  }
  const docsLength = docs.length
  for (let i = 0; i < docsLength; i++) {
    const errorProperty = orama.validateSchema(docs[i], orama.schema)
    if (errorProperty) {
      throw createError('SCHEMA_VALIDATION_FAILURE', errorProperty)
    }
  }
  removeMultiple(orama, ids, batchSize, language, skipHooks)
  const newIds = innerInsertMultiple(orama, docs, batchSize, language, skipHooks)
  if (!skipHooks) {
    runMultipleHook(orama.afterUpdateMultiple, orama, newIds)
  }
  return newIds
}
//# sourceMappingURL=update.js.map
