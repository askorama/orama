import { runMultipleHook, runSingleHook } from '../components/hooks.js'
import { trackRemoval } from '../components/sync-blocking-checker.js'
import { createError } from '../errors.js'
import { Orama } from '../types.js'

export async function remove(orama: Orama, id: string, language?: string, skipHooks?: boolean): Promise<boolean> {
  let result = true
  const { index, docs } = orama.data

  const doc = await orama.documentsStore.get(docs, id)
  if (!doc) {
    throw createError('DOCUMENT_DOES_NOT_EXIST', id)
  }

  const docsCount = await orama.documentsStore.count(docs)

  if (!skipHooks) {
    await runSingleHook(orama.beforeRemove, orama, id)
  }

  const indexableProperties = await orama.index.getSearchableProperties(index)
  const indexablePropertiesWithTypes = await orama.index.getSearchablePropertiesWithTypes(index)
  const values = await orama.getDocumentProperties(doc, indexableProperties)

  for (const prop of indexableProperties) {
    const value = values[prop]
    const schemaType = indexablePropertiesWithTypes[prop]

    await orama.index.beforeRemove?.(orama.data.index, prop, id, value, schemaType, language, orama.tokenizer, docsCount)
    if (
      !(await orama.index.remove(orama.index, orama.data.index, prop, id, value, schemaType, language, orama.tokenizer, docsCount))
    ) {
      result = false
    }
    await orama.index.afterRemove?.(orama.data.index, prop, id, value, schemaType, language, orama.tokenizer, docsCount)
  }

  if (!skipHooks) {
    await runSingleHook(orama.afterRemove, orama, id)
  }

  await orama.documentsStore.remove(orama.data.docs, id)

  trackRemoval(orama)
  return result
}

export async function removeMultiple(
  orama: Orama,
  ids: string[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
): Promise<boolean> {
  let result = true

  if (!batchSize) {
    batchSize = 1000
  }

  if (!skipHooks) {
    await runMultipleHook(orama.beforeMultipleRemove, orama, ids)
  }

  await new Promise<void>((resolve, reject) => {
    let i = 0
    async function _insertMultiple() {
      const batch = ids.slice(i * batchSize!, (i + 1) * batchSize!)
      i++

      if (!batch.length) {
        return resolve()
      }

      for (const doc of batch) {
        try {
          if (!(await remove(orama, doc, language, skipHooks))) {
            result = false
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
    await runMultipleHook(orama.afterMultipleRemove, orama, ids)
  }

  return result
}
