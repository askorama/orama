import type { AnyOrama, PartialSchemaDeep, SortValue, TypedDocument } from '../types.js'
import { isArrayType, isGeoPointType, isVectorType } from '../components.js'
import { isAsyncFunction } from '../utils.js'
import { runMultipleHook, runSingleHook } from '../components/hooks.js'
import { trackInsertion } from '../components/sync-blocking-checker.js'
import { createError } from '../errors.js'
import { Point } from '../trees/bkd.js'

export type InsertOptions = {
  avlRebalanceThreshold?: number
}

export function insert<T extends AnyOrama>(
  orama: T,
  doc: PartialSchemaDeep<TypedDocument<T>>,
  language?: string,
  skipHooks?: boolean,
  options?: InsertOptions
): string | Promise<string> {
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

async function innerInsertAsync<T extends AnyOrama>(
  orama: T,
  doc: PartialSchemaDeep<TypedDocument<T>>,
  language?: string,
  skipHooks?: boolean,
  options?: InsertOptions
): Promise<string> {
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
    await runSingleHook(orama.beforeInsert, orama, id, doc as TypedDocument<T>)
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
    await runSingleHook(orama.afterInsert, orama, id, doc as TypedDocument<T>)
  }

  trackInsertion(orama)

  return id
}

function innerInsertSync<T extends AnyOrama>(
  orama: T,
  doc: PartialSchemaDeep<TypedDocument<T>>,
  language?: string,
  skipHooks?: boolean,
  options?: InsertOptions
): string {
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
    runSingleHook(orama.beforeInsert, orama, id, doc as TypedDocument<T>)
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
    runSingleHook(orama.afterInsert, orama, id, doc as TypedDocument<T>)
  }

  trackInsertion(orama)

  return id
}

function validateDocumentProperty(actualType: string, expectedType: string, key: string, value: any) {
  if (
    isGeoPointType(expectedType) &&
    typeof value === 'object' &&
    typeof (value as Point).lon === 'number' &&
    typeof (value as Point).lat === 'number'
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

async function indexAndSortDocument<T extends AnyOrama>(
  orama: T,
  id: string,
  indexableProperties: string[],
  indexableValues: any,
  docsCount: number,
  language: string | undefined,
  doc: PartialSchemaDeep<TypedDocument<T>>,
  options?: InsertOptions
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
    const value = sortableValues[prop] as SortValue
    if (typeof value === 'undefined') continue

    const expectedType = orama.sorter.getSortablePropertiesWithTypes(orama.data.sorting)[prop]

    orama.sorter.insert(orama.data.sorting, prop, id, value, expectedType, language)
  }
}

function indexAndSortDocumentSync<T extends AnyOrama>(
  orama: T,
  id: string,
  indexableProperties: string[],
  indexableValues: any,
  docsCount: number,
  language: string | undefined,
  doc: PartialSchemaDeep<TypedDocument<T>>,
  options?: InsertOptions
) {
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
    const value = sortableValues[prop] as SortValue
    if (typeof value === 'undefined') continue

    const expectedType = orama.sorter.getSortablePropertiesWithTypes(orama.data.sorting)[prop]

    orama.sorter.insert(orama.data.sorting, prop, id, value, expectedType, language)
  }
}

export function insertMultiple<T extends AnyOrama>(
  orama: T,
  docs: PartialSchemaDeep<TypedDocument<T>>[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
  timeout?: number
): Promise<string[]> | string[] {
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

async function innerInsertMultipleAsync<T extends AnyOrama>(
  orama: T,
  docs: PartialSchemaDeep<TypedDocument<T>>[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
  timeout?: number
): Promise<string[]> {
  if (!batchSize) {
    batchSize = 1000
  }

  timeout ??= 0

  const ids: string[] = []
  await new Promise<void>((resolve, reject) => {
    let i = 0
    async function _insertMultiple() {
      const batch = docs.slice(i * batchSize!, ++i * batchSize!)

      if (!batch.length) {
        return resolve()
      }

      for (const doc of batch) {
        try {
          const options = { avlRebalanceThreshold: batch.length }
          const id = await insert(orama, doc, language, skipHooks, options)
          ids.push(id)
        } catch (err) {
          reject(err)
        }
      }

      setTimeout(_insertMultiple, timeout)
    }

    setTimeout(_insertMultiple, timeout)
  })

  if (!skipHooks) {
    await runMultipleHook(orama.afterInsertMultiple, orama, docs as TypedDocument<T>[])
  }

  return ids
}

function innerInsertMultipleSync<T extends AnyOrama>(
  orama: T,
  docs: PartialSchemaDeep<TypedDocument<T>>[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
  timeout?: number
): string[] {
  if (!batchSize) {
    batchSize = 1000
  }

  timeout ??= 0

  const ids: string[] = []
  let i = 0

  function _insertMultipleSync() {
    const batch = docs.slice(i * batchSize!, ++i * batchSize!)

    if (!batch.length) return

    for (const doc of batch) {
      const options = { avlRebalanceThreshold: batch.length }
      const id = insert(orama, doc, language, skipHooks, options) as string
      ids.push(id)
    }

    setTimeout(_insertMultipleSync, timeout)
  }

  _insertMultipleSync()

  if (!skipHooks) {
    runMultipleHook(orama.afterInsertMultiple, orama, docs as TypedDocument<T>[])
  }

  return ids
}

export function innerInsertMultiple<T extends AnyOrama>(
  orama: T,
  docs: PartialSchemaDeep<TypedDocument<T>>[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
  timeout?: number
): Promise<string[]> | string[] {
  if (isAsyncFunction(runMultipleHook)) {
    return innerInsertMultipleAsync(orama, docs, batchSize, language, skipHooks, timeout)
  }

  return innerInsertMultipleSync(orama, docs, batchSize, language, skipHooks, timeout)
}
