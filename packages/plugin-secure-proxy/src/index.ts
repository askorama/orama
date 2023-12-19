import type { AnyOrama, SearchParamsHybrid, SearchParamsVector, Language } from '@orama/orama'

type SearchParams<T extends AnyOrama, ResultDocument> = SearchParamsHybrid<T, ResultDocument>
// | SearchParamsVector<T, ResultDocument>

type InitResponse = {
  clientID: string
  ttl: number
  csrfToken: string
}

type EmbeddingsResponse = number[]

export type SecureProxyPluginOptions = {
  apiKey: string
}

const SECURE_PROXY_ENDPOINT = 'https://secure-proxy.orama.run'
const INIT_URL = `${SECURE_PROXY_ENDPOINT}/init`
const SEARCH_URL = `${SECURE_PROXY_ENDPOINT}/query`

async function getCSRFToken(apiKey: string): Promise<InitResponse> {
  const response = await fetch(`${INIT_URL}?apiKey=${apiKey}`)
  return response.json()
}

async function getEmbeddings(apiKey: string, query: string, csrfToken: string): Promise<EmbeddingsResponse> {
  const body = new URLSearchParams({ query, csrf: csrfToken }).toString()

  const response = await fetch(`${SEARCH_URL}?apiKey=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body
  })

  return response.json()
}

export async function pluginSecureProxy(pluginParams: SecureProxyPluginOptions) {
  if (!pluginParams.apiKey) throw new Error('Missing apiKey for plugin-telemetry')

  let { csrfToken } = await getCSRFToken(pluginParams.apiKey)

  return {
    name: 'secure-proxy',
    async beforeSearch(_db: AnyOrama, params: SearchParams<any, any>) {
      const term = params.term
      const embeddings = await getEmbeddings(pluginParams.apiKey, term, csrfToken)

      if (!params.vector) {
        params.vector = {
          property: 'vector', // @todo: remove this
          value: embeddings
        }
      }

      params.vector.value = embeddings
    }
  }
}
