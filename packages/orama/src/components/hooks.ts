import { Document, MultipleCallbackComponent, Orama, SingleCallbackComponent } from '../types.js'

export const OBJECT_COMPONENTS = ['tokenizer', 'index', 'documentsStore']

export const FUNCTION_COMPONENTS = [
  'validateSchema',
  'getDocumentIndexId',
  'getDocumentProperties',
  'formatElapsedTime',
]

export const SINGLE_OR_ARRAY_COMPONENTS = [
  'beforeInsert',
  'afterInsert',
  'beforeRemove',
  'afterRemove',
  'beforeUpdate',
  'afterUpdate',
  'beforeMultipleInsert',
  'afterMultipleInsert',
  'beforeMultipleRemove',
  'afterMultipleRemove',
  'beforeMultipleUpdate',
  'afterMultipleUpdate',
]

export async function runSingleHook(
  hooks: SingleCallbackComponent[],
  orama: Orama,
  id: string,
  doc?: Document,
): Promise<void> {
  for (let i = 0; i < hooks.length; i++) {
    await hooks[i](orama, id, doc)
  }
}

export async function runMultipleHook(
  hooks: MultipleCallbackComponent[],
  orama: Orama,
  docsOrIds: Document[] | string[],
): Promise<void> {
  for (let i = 0; i < hooks.length; i++) {
    await hooks[i](orama, docsOrIds)
  }
}
