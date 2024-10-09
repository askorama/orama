import { isArrayType, isGeoPointType, isVectorType } from '../components.js'
import { runMultipleHook, runSingleHook } from '../components/hooks.js'
import { trackInsertion } from '../components/sync-blocking-checker.js'
import { createError } from '../errors.js'
import { Point } from '../trees/bkd.js'
import { AnyOrama, PartialSchemaDeep, SortValue, TypedDocument } from '../types.js'

export type InsertOptions = {
  avlRebalanceThreshold?: number
}

export async function insert<T extends AnyOrama>(
  orama: T,
  doc: PartialSchemaDeep<TypedDocument<T>>,
  language?: string,
  skipHooks?: boolean,
  options?: InsertOptions
): Promise<string> {
  const errorProperty = await orama.validateSchema(doc, orama.schema)
  if (errorProperty) {
    throw createError('SCHEMA_VALIDATION_FAILURE', errorProperty)
  }

  return innerInsert(orama, doc, language, skipHooks, options)
}

const ENUM_TYPE = new Set(['enum', 'enum[]'])
const STRING_NUMBER_TYPE = new Set(['string', 'number'])

async function innerInsert<T extends AnyOrama>(
  orama: T,
  doc: PartialSchemaDeep<TypedDocument<T>>,
  language?: string,
  skipHooks?: boolean,
  options?: InsertOptions
): Promise<string> {
  const { index, docs } = orama.data

  const id = await orama.getDocumentIndexId(doc)

  if (typeof id !== 'string') {
    throw createError('DOCUMENT_ID_MUST_BE_STRING', typeof id)
  }

  if (!(await orama.documentsStore.store(docs, id, doc))) {
    throw createError('DOCUMENT_ALREADY_EXISTS', id)
  }

  const docsCount = await orama.documentsStore.count(docs)

  if (!skipHooks) {
    await runSingleHook(orama.beforeInsert, orama, id, doc as TypedDocument<T>)
  }

  const indexableProperties = await orama.index.getSearchableProperties(index)
  const indexablePropertiesWithTypes = await orama.index.getSearchablePropertiesWithTypes(index)
  const indexableValues = await orama.getDocumentProperties(doc, indexableProperties)

  for (const [key, value] of Object.entries(indexableValues)) {
    if (typeof value === 'undefined') {
      continue
    }

    const actualType = typeof value
    const expectedType = indexablePropertiesWithTypes[key]

    if (
      isGeoPointType(expectedType) &&
      typeof value === 'object' &&
      typeof (value as Point).lon === 'number' &&
      typeof (value as Point).lat === 'number'
    ) {
      continue
    }

    if (isVectorType(expectedType) && Array.isArray(value)) {
      // @todo: Validate vector type. It should be of a given length and contain only floats.
      continue
    }

    if (isArrayType(expectedType) && Array.isArray(value)) {
      continue
    }

    if (ENUM_TYPE.has(expectedType) && STRING_NUMBER_TYPE.has(actualType)) {
      continue
    }

    if (actualType !== expectedType) {
      throw createError('INVALID_DOCUMENT_PROPERTY', key, expectedType, actualType)
    }
  }

  for (const prop of indexableProperties) {
    const value = indexableValues[prop]

    if (typeof value === 'undefined') {
      continue
    }

    if (typeof value === 'string' && value.length === 0) {
      continue
    }

    const expectedType = indexablePropertiesWithTypes[prop]
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

  const sortableProperties = await orama.sorter.getSortableProperties(orama.data.sorting)
  const sortablePropertiesWithTypes = await orama.sorter.getSortablePropertiesWithTypes(orama.data.sorting)
  const sortableValues = await orama.getDocumentProperties(doc, sortableProperties)
  for (const prop of sortableProperties) {
    const value = sortableValues[prop] as SortValue
    if (typeof value === 'undefined') {
      continue
    }

    const expectedType = sortablePropertiesWithTypes[prop]

    await orama.sorter.insert(orama.data.sorting, prop, id, value, expectedType, language)
  }

  if (!skipHooks) {
    await runSingleHook(orama.afterInsert, orama, id, doc as TypedDocument<T>)
  }

  trackInsertion(orama)

  return id
}

export async function insertMultiple<T extends AnyOrama>(
  orama: T,
  docs: PartialSchemaDeep<TypedDocument<T>>[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
  timeout?: number
): Promise<string[]> {
  if (!skipHooks) {
    await runMultipleHook(orama.beforeInsertMultiple, orama, docs as TypedDocument<T>[])
  }

  // Validate all documents before the insertion
  const docsLength = docs.length
  const oramaSchema = orama.schema
  for (let i = 0; i < docsLength; i++) {
    const errorProperty = await orama.validateSchema(docs[i], oramaSchema)
    if (errorProperty) {
      throw createError('SCHEMA_VALIDATION_FAILURE', errorProperty)
    }
  }

  return innerInsertMultiple(orama, docs, batchSize, language, skipHooks, timeout)
}

export async function innerInsertMultiple<T extends AnyOrama>(
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
