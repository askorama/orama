import { formatElapsedTime, getDocumentIndexId, getDocumentProperties, validateSchema } from '../components/defaults.js'
import { DocumentsStore, createDocumentsStore } from '../components/documents-store.js'
import { FUNCTION_COMPONENTS, OBJECT_COMPONENTS, SINGLE_OR_ARRAY_COMPONENTS } from '../components/hooks.js'
import { Index, createIndex } from '../components/index.js'
import { createInternalDocumentIDStore } from '../components/internal-document-id-store.js'
import { Sorter, createSorter } from '../components/sorter.js'
import { createTokenizer } from '../components/tokenizer/index.js'
import { createError } from '../errors.js'
import {
  AfterSearch,
  ArrayCallbackComponents,
  Components,
  FunctionComponents,
  IDocumentsStore,
  IIndex,
  ISorter,
  MultipleCallbackComponent,
  Orama,
  SingleCallbackComponent,
  SingleOrArray,
  SingleOrArrayCallbackComponents,
  SorterConfig,
  Tokenizer
} from '../types.js'
import { uniqueId } from '../utils.js'

interface CreateArguments<OramaSchema, TIndex, TDocumentStore, TSorter> {
  schema: OramaSchema,
  sort?: SorterConfig
  language?: string
  components?: Components<Orama<OramaSchema, TIndex, TDocumentStore, TSorter>, OramaSchema, TIndex, TDocumentStore, TSorter>
  id?: string
}

function validateComponents<OramaSchema, TIndex, TDocumentStore, TSorter, TOrama extends Orama<OramaSchema, TIndex, TDocumentStore, TSorter>>(components: Components<TOrama, OramaSchema, TIndex, TDocumentStore, TSorter>) {
  const defaultComponents = {
    formatElapsedTime,
    getDocumentIndexId,
    getDocumentProperties,
    validateSchema,
  }

  for (const rawKey of FUNCTION_COMPONENTS) {
    const key = rawKey as keyof FunctionComponents<OramaSchema>

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
    const key = rawKey as keyof ArrayCallbackComponents<TOrama>

    const component:
      | SingleOrArray<AfterSearch<TOrama>>
      | SingleOrArray<SingleCallbackComponent<TOrama>>
      | SingleOrArray<MultipleCallbackComponent<TOrama>>
      | undefined = components[key]
    if (!component) {
      components[key] = []
    } else if (!Array.isArray(components[key])) {
      // @ts-expect-error TSC is unable to resolve this
      components[key] = [components[key]]
    }

    for (const fn of components[key] as unknown as SingleOrArrayCallbackComponents<TOrama>[]) {
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

export async function create<
  OramaSchema,
  TIndex = IIndex<Index>, 
  TDocumentStore = IDocumentsStore<DocumentsStore>, 
  TSorter = ISorter<Sorter>> ({
  schema,
  sort,
  language,
  components,
  id,
}: CreateArguments<OramaSchema, TIndex, TDocumentStore, TSorter>): Promise<Orama<OramaSchema, TIndex, TDocumentStore, TSorter>> {
  if (!components) {
    components = {}
  }

  if (!id) {
    id = await uniqueId()
  }

  let tokenizer = components.tokenizer as Tokenizer
  let index: TIndex | undefined = components.index
  let documentsStore: TDocumentStore | undefined = components.documentsStore
  let sorter: TSorter | undefined = components.sorter

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

  const internalDocumentStore = createInternalDocumentIDStore()

  index ||= await createIndex() as TIndex
  sorter ||= await createSorter() as TSorter
  documentsStore ||= await createDocumentsStore() as TDocumentStore

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
    beforeUpdate,
    afterUpdate,
    afterSearch,
    beforeMultipleInsert,
    afterMultipleInsert,
    beforeMultipleRemove,
    afterMultipleRemove,
    beforeMultipleUpdate,
    afterMultipleUpdate,
    formatElapsedTime,
  } = components

  const orama = {
    data: {},
    caches: {},
    schema,
    tokenizer,
    index,
    sorter,
    documentsStore,
    internalDocumentIDStore: internalDocumentStore,
    getDocumentProperties,
    getDocumentIndexId,
    validateSchema,
    beforeInsert,
    afterInsert,
    beforeRemove,
    afterRemove,
    beforeUpdate,
    afterUpdate,
    afterSearch,
    beforeMultipleInsert,
    afterMultipleInsert,
    beforeMultipleRemove,
    afterMultipleRemove,
    beforeMultipleUpdate,
    afterMultipleUpdate,
    formatElapsedTime,
    id,
  } as unknown as Orama<OramaSchema, TIndex, TDocumentStore, TSorter>

  orama.data = {
    index: await orama.index.create(orama, internalDocumentStore, schema),
    docs: await orama.documentsStore.create(orama, internalDocumentStore),
    sorting: await orama.sorter.create(orama, internalDocumentStore, schema, sort),
  }

  return orama
}
