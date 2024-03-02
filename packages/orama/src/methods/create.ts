import { formatElapsedTime, getDocumentIndexId, getDocumentProperties, validateSchema } from '../components/defaults.ts'
import { DocumentsStore, createDocumentsStore } from '../components/documents-store.ts'
import { AVAILABLE_PLUGIN_HOOKS, getAllPluginsByHook } from '../components/plugins.ts'
import { FUNCTION_COMPONENTS, OBJECT_COMPONENTS, runAfterCreate } from '../components/hooks.ts'
import { Index, createIndex } from '../components/index.ts'
import { createInternalDocumentIDStore } from '../components/internal-document-id-store.ts'
import { Sorter, createSorter } from '../components/sorter.ts'
import { createTokenizer } from '../components/tokenizer/index.ts'
import { createError } from '../errors.ts'
import {
  Components,
  FunctionComponents,
  IDocumentsStore,
  IIndex,
  ISorter,
  Orama,
  OramaPlugin,
  SorterConfig,
  Tokenizer
} from '../types.ts'
import { uniqueId } from '../utils.ts'

interface CreateArguments<OramaSchema, TIndex, TDocumentStore, TSorter> {
  schema: OramaSchema
  sort?: SorterConfig
  language?: string
  components?: Components<
    Orama<OramaSchema, TIndex, TDocumentStore, TSorter>,
    OramaSchema,
    TIndex,
    TDocumentStore,
    TSorter
  >
  plugins?: OramaPlugin[]
  id?: string
}

function validateComponents<
  OramaSchema,
  TIndex,
  TDocumentStore,
  TSorter,
  TOrama extends Orama<OramaSchema, TIndex, TDocumentStore, TSorter>
>(components: Components<TOrama, OramaSchema, TIndex, TDocumentStore, TSorter>) {
  const defaultComponents = {
    formatElapsedTime,
    getDocumentIndexId,
    getDocumentProperties,
    validateSchema
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

  for (const rawKey of Object.keys(components)) {
    if (!OBJECT_COMPONENTS.includes(rawKey) && !FUNCTION_COMPONENTS.includes(rawKey)) {
      throw createError('UNSUPPORTED_COMPONENT', rawKey)
    }
  }
}

export async function create<
  OramaSchema,
  TIndex = IIndex<Index>,
  TDocumentStore = IDocumentsStore<DocumentsStore>,
  TSorter = ISorter<Sorter>
>({
  schema,
  sort,
  language,
  components,
  id,
  plugins
}: CreateArguments<OramaSchema, TIndex, TDocumentStore, TSorter>): Promise<
  Orama<OramaSchema, TIndex, TDocumentStore, TSorter>
> {
  if (!components) {
    components = {}
  }

  if (!id) {
    id = await uniqueId()
  }

  let tokenizer = components.tokenizer
  let index: TIndex | undefined = components.index
  let documentsStore: TDocumentStore | undefined = components.documentsStore
  let sorter: TSorter | undefined = components.sorter

  if (!tokenizer) {
    // Use the default tokenizer
    tokenizer = await createTokenizer({ language: language ?? 'english' })
  } else if (!(tokenizer as Tokenizer).tokenize) {
    // If there is no tokenizer function, we assume this is a TokenizerConfig
    tokenizer = await createTokenizer(tokenizer)
  } else {
    const customTokenizer = tokenizer as Tokenizer
    tokenizer = customTokenizer
  }

  if (components.tokenizer && language) {
    // Accept language only if a tokenizer is not provided
    throw createError('NO_LANGUAGE_WITH_CUSTOM_TOKENIZER')
  }

  const internalDocumentStore = createInternalDocumentIDStore()

  index ||= (await createIndex()) as TIndex
  sorter ||= (await createSorter()) as TSorter
  documentsStore ||= (await createDocumentsStore()) as TDocumentStore

  // Validate all other components
  validateComponents(components)

  // Assign only recognized components and hooks
  const { getDocumentProperties, getDocumentIndexId, validateSchema, formatElapsedTime } = components

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
    beforeInsert: [],
    afterInsert: [],
    beforeRemove: [],
    afterRemove: [],
    beforeUpdate: [],
    afterUpdate: [],
    beforeSearch: [],
    afterSearch: [],
    beforeInsertMultiple: [],
    afterInsertMultiple: [],
    beforeRemoveMultiple: [],
    afterRemoveMultiple: [],
    afterUpdateMultiple: [],
    beforeUpdateMultiple: [],
    afterCreate: [],
    formatElapsedTime,
    id,
    plugins,
    version: getVersion()
  } as unknown as Orama<OramaSchema, TIndex, TDocumentStore, TSorter>

  orama.data = {
    index: await orama.index.create(orama, internalDocumentStore, schema),
    docs: await orama.documentsStore.create(orama, internalDocumentStore),
    sorting: await orama.sorter.create(orama, internalDocumentStore, schema, sort)
  }

  for (const hook of AVAILABLE_PLUGIN_HOOKS) {
    orama[hook] = (orama[hook] ?? []).concat(await getAllPluginsByHook(orama, hook))
  }

  const afterCreate = orama['afterCreate']
  if (afterCreate) {
    await runAfterCreate(afterCreate, orama)
  }

  return orama
}

function getVersion() {
  return '{{VERSION}}'
}
