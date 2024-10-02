import { formatElapsedTime, getDocumentIndexId, getDocumentProperties, validateSchema } from '../components/defaults.js'
import { createDocumentsStore } from '../components/documents-store.js'
import { AVAILABLE_PLUGIN_HOOKS, getAllPluginsByHook } from '../components/plugins.js'
import { FUNCTION_COMPONENTS, OBJECT_COMPONENTS, runAfterCreate } from '../components/hooks.js'
import { createIndex } from '../components/index.js'
import { createInternalDocumentIDStore } from '../components/internal-document-id-store.js'
import { createSorter } from '../components/sorter.js'
import { createTokenizer } from '../components/tokenizer/index.js'
import { createError } from '../errors.js'
import { uniqueId } from '../utils.js'
function validateComponents(components) {
  const defaultComponents = {
    formatElapsedTime,
    getDocumentIndexId,
    getDocumentProperties,
    validateSchema
  }
  for (const rawKey of FUNCTION_COMPONENTS) {
    const key = rawKey
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
export function create({ schema, sort, language, components, id, plugins }) {
  if (!components) {
    components = {}
  }
  if (!id) {
    id = uniqueId()
  }
  let tokenizer = components.tokenizer
  let index = components.index
  let documentsStore = components.documentsStore
  let sorter = components.sorter
  if (!tokenizer) {
    // Use the default tokenizer
    tokenizer = createTokenizer({ language: language ?? 'english' })
  } else if (!tokenizer.tokenize) {
    // If there is no tokenizer function, we assume this is a TokenizerConfig
    tokenizer = createTokenizer(tokenizer)
  } else {
    const customTokenizer = tokenizer
    tokenizer = customTokenizer
  }
  if (components.tokenizer && language) {
    // Accept language only if a tokenizer is not provided
    throw createError('NO_LANGUAGE_WITH_CUSTOM_TOKENIZER')
  }
  const internalDocumentStore = createInternalDocumentIDStore()
  index ||= createIndex()
  sorter ||= createSorter()
  documentsStore ||= createDocumentsStore()
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
  }
  orama.data = {
    index: orama.index.create(orama, internalDocumentStore, schema),
    docs: orama.documentsStore.create(orama, internalDocumentStore),
    sorting: orama.sorter.create(orama, internalDocumentStore, schema, sort)
  }
  for (const hook of AVAILABLE_PLUGIN_HOOKS) {
    orama[hook] = (orama[hook] ?? []).concat(getAllPluginsByHook(orama, hook))
  }
  const afterCreate = orama['afterCreate']
  if (afterCreate) {
    runAfterCreate(afterCreate, orama)
  }
  return orama
}
function getVersion() {
  return '{{VERSION}}'
}
//# sourceMappingURL=create.js.map
