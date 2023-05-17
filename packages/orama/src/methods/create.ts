import { formatElapsedTime, getDocumentIndexId, getDocumentProperties, validateSchema } from '../components/defaults.js'
import { createDocumentsStore } from '../components/documents-store.js'
import { OBJECT_COMPONENTS, FUNCTION_COMPONENTS, SINGLE_OR_ARRAY_COMPONENTS } from '../components/hooks.js'
import { createIndex } from '../components/index.js'
import { createTokenizer } from '../components/tokenizer/index.js'
import { createSynonyms } from '../components/synonyms.js'
import { createError } from '../errors.js'
import { uniqueId } from '../utils.js'
import {
  ArrayCallbackComponents,
  Components,
  IDocumentsStore,
  IIndex,
  Orama,
  Schema,
  FunctionComponents,
  SingleOrArrayCallbackComponents,
  Tokenizer,
} from '../types.js'

interface CreateArguments {
  schema: Schema
  language?: string
  components?: Components
  id?: string
}

function validateComponents(components: Components) {
  const defaultComponents = {
    formatElapsedTime,
    getDocumentIndexId,
    getDocumentProperties,
    validateSchema,
  }

  for (const rawKey of FUNCTION_COMPONENTS) {
    const key = rawKey as keyof FunctionComponents

    if (components[key]) {
      if (typeof components[key] !== 'function') {
        throw createError('COMPONENT_MUST_BE_FUNCTION', key)
      }
    } else {
      // @ts-expect-error TSC is unable to resolve this
      components[key] = defaultComponents[key]
    }
  }

  for (const rawKey of SINGLE_OR_ARRAY_COMPONENTS) {
    const key = rawKey as keyof ArrayCallbackComponents

    if (!components[key]) {
      components[key] = []
    } else if (!Array.isArray(components[key])) {
      // @ts-expect-error TSC is unable to resolve this
      components[key] = [components[key]]
    }

    for (const fn of components[key] as unknown as SingleOrArrayCallbackComponents[]) {
      if (typeof fn !== 'function') {
        throw createError('COMPONENT_MUST_BE_FUNCTION_OR_ARRAY_FUNCTIONS', key)
      }
    }
  }

  for (const rawKey of Object.keys(components)) {
    if (
      !OBJECT_COMPONENTS.includes(rawKey) &&
      !FUNCTION_COMPONENTS.includes(rawKey) &&
      !SINGLE_OR_ARRAY_COMPONENTS.includes(rawKey)
    ) {
      throw createError('UNSUPPORTED_COMPONENT', rawKey)
    }
  }
}

export async function create({ schema, language, components, id }: CreateArguments): Promise<Orama> {
  if (!components) {
    components = {}
  }

  if (!id) {
    id = await uniqueId()
  }

  let tokenizer = components.tokenizer as Tokenizer
  let index = components.index
  let documentsStore = components.documentsStore
  let synonyms = components.synonyms

  if (!tokenizer) {
    // Use the default tokenizer
    tokenizer = await createTokenizer({ language: language ?? 'english' })
  } else if (!tokenizer.tokenize) {
    // If there is no tokenizer function, we assume this is a TokenizerConfig
    tokenizer = await createTokenizer(tokenizer)
  }

  if (components.tokenizer && language) {
    // Accept language only if a tokenizer is not provided
    throw createError('NO_LANGUAGE_WITH_CUSTOM_TOKENIZER')
  }

  if (!index) {
    index = (await createIndex()) as unknown as IIndex
  }

  if (!documentsStore) {
    documentsStore = (await createDocumentsStore()) as unknown as IDocumentsStore
  }

  if (!synonyms) {
    synonyms = await createSynonyms()
  }

  // Validate all other components
  validateComponents(components)

  // Assign only recognized components and hooks
  const {
    getDocumentProperties,
    getDocumentIndexId,
    validateSchema,
    beforeInsert,
    afterInsert,
    beforeRemove,
    afterRemove,
    beforeMultipleInsert,
    afterMultipleInsert,
    beforeMultipleRemove,
    afterMultipleRemove,
    formatElapsedTime,
  } = components

  const orama = {
    data: {},
    caches: {},
    schema,
    tokenizer,
    index,
    documentsStore,
    synonyms,
    getDocumentProperties,
    getDocumentIndexId,
    validateSchema,
    beforeInsert,
    afterInsert,
    beforeRemove,
    afterRemove,
    beforeMultipleInsert,
    afterMultipleInsert,
    beforeMultipleRemove,
    afterMultipleRemove,
    formatElapsedTime,
    id,
  } as Orama

  orama.data = {
    index: await orama.index.create(orama, schema),
    docs: await orama.documentsStore.create(orama),
    synonyms: await orama.synonyms.create(orama),
  }

  return orama
}
