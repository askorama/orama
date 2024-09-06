import type { AnyOrama, SearchParams, TypedDocument, OramaPluginSync } from '@orama/orama'
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
