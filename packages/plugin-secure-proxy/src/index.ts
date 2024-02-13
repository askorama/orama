import type { AnyOrama, SearchParams, TypedDocument, OramaPluginAsync } from '@orama/orama'
import { OramaProxy, EmbeddingModel } from '@oramacloud/client'

export type SecureProxyPluginOptions = {
  apiKey: string
  defaultProperty: string
  model: EmbeddingModel
}

export async function pluginSecureProxy(pluginParams: SecureProxyPluginOptions): Promise<OramaPluginAsync> {
  if (!pluginParams.apiKey) throw new Error('Missing "apiKey" parameter for plugin-telemetry')
  if (!pluginParams.defaultProperty) throw new Error('Missing "defaultProperty" parameter for plugin-telemetry')
  if (!pluginParams.model) throw new Error('Missing "model" parameter for plugin-telemetry')

  const proxy = new OramaProxy({
    api_key: pluginParams.apiKey
  })

  return {
    name: 'secure-proxy',

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
      const embeddings = await proxy.generateEmbeddings(term, pluginParams.model)

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
