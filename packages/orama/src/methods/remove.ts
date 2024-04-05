import { runMultipleHook, runSingleHook } from '../components/hooks.js'
import {
  DocumentID,
  getDocumentIdFromInternalId,
  getInternalDocumentId
} from '../components/internal-document-id-store.js'
import { trackRemoval } from '../components/sync-blocking-checker.js'
import { AnyOrama } from '../types.js'

export async function remove<T extends AnyOrama>(
  orama: T,
  id: DocumentID,
  language?: string,
  skipHooks?: boolean
): Promise<boolean> {
  let result = true
  const { index, docs } = orama.data

  const doc = await orama.documentsStore.get(docs, id)
  if (!doc) {
    return false
  }

  const docId = getDocumentIdFromInternalId(
    orama.internalDocumentIDStore,
    getInternalDocumentId(orama.internalDocumentIDStore, id)
  )
  const docsCount = await orama.documentsStore.count(docs)

  if (!skipHooks) {
    await runSingleHook(orama.beforeRemove, orama, docId)
  }

  const indexableProperties = await orama.index.getSearchableProperties(index)
  const indexablePropertiesWithTypes = await orama.index.getSearchablePropertiesWithTypes(index)
  const values = await orama.getDocumentProperties(doc, indexableProperties)

  for (const prop of indexableProperties) {
    const value = values[prop]
    // The document doesn't contain the key
    if (typeof value === 'undefined') {
      continue
    }

    const schemaType = indexablePropertiesWithTypes[prop]

    await orama.index.beforeRemove?.(
      orama.data.index,
      prop,
      docId,
      value,
      schemaType,
      language,
      orama.tokenizer,
      docsCount
    )
    if (
      !(await orama.index.remove(
        orama.index,
        orama.data.index,
        prop,
        id,
        value,
        schemaType,
        language,
        orama.tokenizer,
        docsCount
      ))
    ) {
      result = false
    }
    await orama.index.afterRemove?.(
      orama.data.index,
      prop,
      docId,
      value,
      schemaType,
      language,
      orama.tokenizer,
      docsCount
    )
  }

  const sortableProperties = await orama.sorter.getSortableProperties(orama.data.sorting)
  const sortableValues = await orama.getDocumentProperties(doc, sortableProperties)
  for (const prop of sortableProperties) {
    // The document doesn't contain the key
    if (typeof sortableValues[prop] === 'undefined') {
      continue
    }

    await orama.sorter.remove(orama.data.sorting, prop, id)
  }

  if (!skipHooks) {
    await runSingleHook(orama.afterRemove, orama, docId)
  }

  await orama.documentsStore.remove(orama.data.docs, id)

  trackRemoval(orama)
  return result
}

export async function removeMultiple<T extends AnyOrama>(
  orama: T,
  ids: DocumentID[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean
): Promise<number> {
  let result = 0

  if (!batchSize) {
    batchSize = 1000
  }

  const docIdsForHooks = skipHooks
    ? []
    : ids.map((id) =>
        getDocumentIdFromInternalId(
          orama.internalDocumentIDStore,
          getInternalDocumentId(orama.internalDocumentIDStore, id)
        )
      )

  if (!skipHooks) {
    await runMultipleHook(orama.beforeRemoveMultiple, orama, docIdsForHooks)
  }

  await new Promise<void>((resolve, reject) => {
    let i = 0
    async function _insertMultiple() {
      const batch = ids.slice(i * batchSize!, ++i * batchSize!)

      if (!batch.length) {
        return resolve()
      }

      for (const doc of batch) {
        try {
          if (await remove(orama, doc, language, skipHooks)) {
            result++
          }
        } catch (err) {
          reject(err)
        }
      }

      setTimeout(_insertMultiple, 0)
    }

    setTimeout(_insertMultiple, 0)
  })

  if (!skipHooks) {
    await runMultipleHook(orama.afterRemoveMultiple, orama, docIdsForHooks)
  }

  return result
}
