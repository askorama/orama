import type { AnyOrama, SearchParams, TypedDocument, OramaPluginSync, PartialSchemaDeep } from '@orama/orama'
import { OramaProxy, EmbeddingModel, ChatModel } from '@oramacloud/client'

export type SecureProxyExtra = {
  proxy: OramaProxy
  pluginParams: SecureProxyPluginOptions
}

export type LLMModel = ChatModel

export type SecureProxyPluginOptions = {
  apiKey: string
  defaultProperty: string
  models: {
    embeddings: EmbeddingModel
    chat?: LLMModel
  }
  embeddingsConfig?: {
    generate: boolean
    properties: string[]
    verbose?: boolean
  }
}

function getPropertyValue (obj: object, path: string) {
  return path.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : undefined, obj
  );
}


function getPropertiesValues(schema: object, properties: string[]) {
  return properties
    .map(prop => getPropertyValue(schema, prop))
    .filter(value => value !== undefined)
    .join(' ');
}

export function pluginSecureProxy(pluginParams: SecureProxyPluginOptions): OramaPluginSync<SecureProxyExtra> {
  if (!pluginParams.apiKey) throw new Error('Missing "apiKey" parameter for plugin-secure-proxy')
  if (!pluginParams.defaultProperty) throw new Error('Missing "defaultProperty" parameter for plugin-secure-proxy')
  if (!pluginParams.models.embeddings) throw new Error('Missing "model" parameter for plugin-secure-proxy')

  const proxy = new OramaProxy({
    api_key: pluginParams.apiKey
  })

  return {
    name: 'orama-secure-proxy',
    extra: {
      proxy,
      pluginParams
    },

    async beforeInsert<T extends TypedDocument<any>>(db: AnyOrama, params: PartialSchemaDeep<T>) {
      if (!pluginParams.embeddingsConfig?.generate) {
        return
      }

      if (!pluginParams.embeddingsConfig.properties) {
        throw new Error('Missing "embeddingsConfig.properties" parameter for plugin-secure-proxy')
      }

      const properties = pluginParams.embeddingsConfig.properties
      const values = getPropertiesValues(params, properties)

      if (pluginParams.embeddingsConfig?.verbose) {
        console.log(`Generating embeddings for properties: ${properties.join(', ')}: ${values}`)
      }

      const embeddings = await proxy.generateEmbeddings(values, pluginParams.models.embeddings)

      params[pluginParams.defaultProperty] = embeddings
    },
    
    async beforeSearch<T extends AnyOrama>(_db: AnyOrama, params: SearchParams<T, TypedDocument<any>>) {
      if (params.mode !== 'vector' && params.mode !== 'hybrid') {
        return
      }

      if (params?.vector?.value) {
        return
      }

      if (!params.term) {
        throw new Error('Neither "term" nor "vector" parameters were provided')
      }

      const term = params.term
      const embeddings = await proxy.generateEmbeddings(term, pluginParams.models.embeddings)

      if (!params.vector) {
        params.vector = {
          // eslint-disable-next-line
          // @ts-ignore
          property: params?.vector?.property ?? pluginParams.defaultProperty,
          value: embeddings
        }
      }

      params.vector.value = embeddings
    }
  }
}
