import { isArrayType, isGeoPointType, isVectorType } from '../components.js'
import { isAsyncFunction } from '../utils.js'
import { runMultipleHook, runSingleHook } from '../components/hooks.js'
import { trackInsertion } from '../components/sync-blocking-checker.js'
import { createError } from '../errors.js'
export function insert(orama, doc, language, skipHooks, options) {
  const errorProperty = orama.validateSchema(doc, orama.schema)
  if (errorProperty) {
    throw createError('SCHEMA_VALIDATION_FAILURE', errorProperty)
  }
  const asyncNeeded =
    isAsyncFunction(orama.index.beforeInsert) ||
    isAsyncFunction(orama.index.insert) ||
    isAsyncFunction(orama.index.afterInsert)
  if (asyncNeeded) {
    return innerInsertAsync(orama, doc, language, skipHooks, options)
  }
  return innerInsertSync(orama, doc, language, skipHooks, options)
}
const ENUM_TYPE = new Set(['enum', 'enum[]'])
const STRING_NUMBER_TYPE = new Set(['string', 'number'])
async function innerInsertAsync(orama, doc, language, skipHooks, options) {
  const { index, docs } = orama.data
  const id = orama.getDocumentIndexId(doc)
  if (typeof id !== 'string') {
    throw createError('DOCUMENT_ID_MUST_BE_STRING', typeof id)
  }
  if (!orama.documentsStore.store(docs, id, doc)) {
    throw createError('DOCUMENT_ALREADY_EXISTS', id)
  }
  const docsCount = orama.documentsStore.count(docs)
  if (!skipHooks) {
    await runSingleHook(orama.beforeInsert, orama, id, doc)
  }
  const indexableProperties = orama.index.getSearchableProperties(index)
  const indexablePropertiesWithTypes = orama.index.getSearchablePropertiesWithTypes(index)
  const indexableValues = orama.getDocumentProperties(doc, indexableProperties)
  for (const [key, value] of Object.entries(indexableValues)) {
    if (typeof value === 'undefined') continue
    const actualType = typeof value
    const expectedType = indexablePropertiesWithTypes[key]
    validateDocumentProperty(actualType, expectedType, key, value)
  }
  await indexAndSortDocument(orama, id, indexableProperties, indexableValues, docsCount, language, doc, options)
  if (!skipHooks) {
    await runSingleHook(orama.afterInsert, orama, id, doc)
  }
  trackInsertion(orama)
  return id
}
function innerInsertSync(orama, doc, language, skipHooks, options) {
  const { index, docs } = orama.data
  const id = orama.getDocumentIndexId(doc)
  if (typeof id !== 'string') {
    throw createError('DOCUMENT_ID_MUST_BE_STRING', typeof id)
  }
  if (!orama.documentsStore.store(docs, id, doc)) {
    throw createError('DOCUMENT_ALREADY_EXISTS', id)
  }
  const docsCount = orama.documentsStore.count(docs)
  if (!skipHooks) {
    runSingleHook(orama.beforeInsert, orama, id, doc)
  }
  const indexableProperties = orama.index.getSearchableProperties(index)
  const indexablePropertiesWithTypes = orama.index.getSearchablePropertiesWithTypes(index)
  const indexableValues = orama.getDocumentProperties(doc, indexableProperties)
  for (const [key, value] of Object.entries(indexableValues)) {
    if (typeof value === 'undefined') continue
    const actualType = typeof value
    const expectedType = indexablePropertiesWithTypes[key]
    validateDocumentProperty(actualType, expectedType, key, value)
  }
  indexAndSortDocumentSync(orama, id, indexableProperties, indexableValues, docsCount, language, doc, options)
  if (!skipHooks) {
    runSingleHook(orama.afterInsert, orama, id, doc)
  }
  trackInsertion(orama)
  return id
}
function validateDocumentProperty(actualType, expectedType, key, value) {
  if (
    isGeoPointType(expectedType) &&
    typeof value === 'object' &&
    typeof value.lon === 'number' &&
    typeof value.lat === 'number'
  ) {
    return
  }
  if (isVectorType(expectedType) && Array.isArray(value)) return
  if (isArrayType(expectedType) && Array.isArray(value)) return
  if (ENUM_TYPE.has(expectedType) && STRING_NUMBER_TYPE.has(actualType)) return
  if (actualType !== expectedType) {
    throw createError('INVALID_DOCUMENT_PROPERTY', key, expectedType, actualType)
  }
}
async function indexAndSortDocument(
  orama,
  id,
  indexableProperties,
  indexableValues,
  docsCount,
  language,
  doc,
  options
) {
  for (const prop of indexableProperties) {
    const value = indexableValues[prop]
    if (typeof value === 'undefined') continue
    const expectedType = orama.index.getSearchablePropertiesWithTypes(orama.data.index)[prop]
    await orama.index.beforeInsert?.(
      orama.data.index,
      prop,
      id,
      value,
      expectedType,
      language,
      orama.tokenizer,
      docsCount
    )
    await orama.index.insert(
      orama.index,
      orama.data.index,
      prop,
      id,
      value,
      expectedType,
      language,
      orama.tokenizer,
      docsCount,
      options
    )
    await orama.index.afterInsert?.(
      orama.data.index,
      prop,
      id,
      value,
      expectedType,
      language,
      orama.tokenizer,
      docsCount
    )
  }
  const sortableProperties = orama.sorter.getSortableProperties(orama.data.sorting)
  const sortableValues = orama.getDocumentProperties(doc, sortableProperties)
  for (const prop of sortableProperties) {
    const value = sortableValues[prop]
    if (typeof value === 'undefined') continue
    const expectedType = orama.sorter.getSortablePropertiesWithTypes(orama.data.sorting)[prop]
    orama.sorter.insert(orama.data.sorting, prop, id, value, expectedType, language)
  }
}
function indexAndSortDocumentSync(orama, id, indexableProperties, indexableValues, docsCount, language, doc, options) {
  for (const prop of indexableProperties) {
    const value = indexableValues[prop]
    if (typeof value === 'undefined') continue
    const expectedType = orama.index.getSearchablePropertiesWithTypes(orama.data.index)[prop]
    orama.index.beforeInsert?.(orama.data.index, prop, id, value, expectedType, language, orama.tokenizer, docsCount)
    orama.index.insert(
      orama.index,
      orama.data.index,
      prop,
      id,
      value,
      expectedType,
      language,
      orama.tokenizer,
      docsCount,
      options
    )
    orama.index.afterInsert?.(orama.data.index, prop, id, value, expectedType, language, orama.tokenizer, docsCount)
  }
  const sortableProperties = orama.sorter.getSortableProperties(orama.data.sorting)
  const sortableValues = orama.getDocumentProperties(doc, sortableProperties)
  for (const prop of sortableProperties) {
    const value = sortableValues[prop]
    if (typeof value === 'undefined') continue
    const expectedType = orama.sorter.getSortablePropertiesWithTypes(orama.data.sorting)[prop]
    orama.sorter.insert(orama.data.sorting, prop, id, value, expectedType, language)
  }
}
export function insertMultiple(orama, docs, batchSize, language, skipHooks, timeout) {
  const asyncNeeded =
    isAsyncFunction(orama.afterInsertMultiple) ||
    isAsyncFunction(orama.beforeInsertMultiple) ||
    isAsyncFunction(orama.index.beforeInsert) ||
    isAsyncFunction(orama.index.insert) ||
    isAsyncFunction(orama.index.afterInsert)
  if (asyncNeeded) {
    return innerInsertMultipleAsync(orama, docs, batchSize, language, skipHooks, timeout)
  }
  return innerInsertMultipleSync(orama, docs, batchSize, language, skipHooks, timeout)
}
async function innerInsertMultipleAsync(orama, docs, batchSize = 1000, language, skipHooks, timeout = 0) {
  const ids = []
  const processNextBatch = async (startIndex) => {
    const endIndex = Math.min(startIndex + batchSize, docs.length)
    const batch = docs.slice(startIndex, endIndex)
    for (const doc of batch) {
      const options = { avlRebalanceThreshold: batch.length }
      const id = await insert(orama, doc, language, skipHooks, options)
      ids.push(id)
    }
    return endIndex
  }
  const processAllBatches = async () => {
    let currentIndex = 0
    while (currentIndex < docs.length) {
      const startTime = Date.now()
      currentIndex = await processNextBatch(currentIndex)
      if (timeout > 0) {
        const elapsedTime = Date.now() - startTime
        if (elapsedTime < timeout) {
          await new Promise((resolve) => setTimeout(resolve, timeout - elapsedTime))
        }
      }
    }
  }
  await processAllBatches()
  if (!skipHooks) {
    await runMultipleHook(orama.afterInsertMultiple, orama, docs)
  }
  return ids
}
function innerInsertMultipleSync(orama, docs, batchSize = 1000, language, skipHooks, timeout = 0) {
  const ids = []
  let i = 0
  function processNextBatch() {
    const batch = docs.slice(i * batchSize, (i + 1) * batchSize)
    if (batch.length === 0) return false
    for (const doc of batch) {
      const options = { avlRebalanceThreshold: batch.length }
      const id = insert(orama, doc, language, skipHooks, options)
      ids.push(id)
    }
    i++
    return true
  }
  function processAllBatches() {
    const startTime = Date.now()
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const hasMoreBatches = processNextBatch()
      if (!hasMoreBatches) break
      if (timeout > 0) {
        const elapsedTime = Date.now() - startTime
        if (elapsedTime >= timeout) {
          // Synchronously wait for the remaining time
          const remainingTime = timeout - (elapsedTime % timeout)
          const endTime = Date.now() + remainingTime
          while (Date.now() < endTime) {
            // Do nothing, just wait
          }
        }
      }
    }
  }
  processAllBatches()
  if (!skipHooks) {
    runMultipleHook(orama.afterInsertMultiple, orama, docs)
  }
  return ids
}
export function innerInsertMultiple(orama, docs, batchSize, language, skipHooks, timeout) {
  if (isAsyncFunction(runMultipleHook)) {
    return innerInsertMultipleAsync(orama, docs, batchSize, language, skipHooks, timeout)
  }
  return innerInsertMultipleSync(orama, docs, batchSize, language, skipHooks, timeout)
}
//# sourceMappingURL=insert.js.map
