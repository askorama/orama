import type { AnyOrama, SearchParams, TypedDocument, OramaPluginAsync } from '@orama/orama'

type InitResponse = {
  clientID: string
  ttl: number
  csrfToken: string
}

type EmbeddingsResponse = number[]

export type SecureProxyPluginOptions = {
  apiKey: string
  defaultProperty: string
}

const SECURE_PROXY_ENDPOINT = 'https://secure-proxy.orama.run'
const INIT_URL = `${SECURE_PROXY_ENDPOINT}/init`
const SEARCH_URL = `${SECURE_PROXY_ENDPOINT}/query`

function isServer() {
  return typeof window === 'undefined'
}

function getReferer() {
  return isServer() ? 'http://localhost' : window.location.href
}

async function getCSRFToken(apiKey: string): Promise<InitResponse> {
  const response = await fetch(`${INIT_URL}?apiKey=${apiKey}`, {
    headers: {
      Referer: getReferer()
    }
  })

  return response.json()
}

async function getEmbeddings(apiKey: string, query: string, csrfToken: string): Promise<EmbeddingsResponse> {
  const body = new URLSearchParams({ query, csrf: csrfToken }).toString()

  const response = await fetch(`${SEARCH_URL}?apiKey=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Referer: getReferer()
    },
    body
  })

  return response.json()
}

export async function pluginSecureProxy(pluginParams: SecureProxyPluginOptions): OramaPluginAsync {
  if (!pluginParams.apiKey) throw new Error('Missing "apiKey" parameter for plugin-telemetry')
  if (!pluginParams.defaultProperty) throw new Error('Missing "defaultProperty" parameter for plugin-telemetry')

  const { csrfToken } = await getCSRFToken(pluginParams.apiKey)

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
      const embeddings = await getEmbeddings(pluginParams.apiKey, term, csrfToken)

      if (!params.vector) {
        params.vector = {
          // @ts-expect-error - vector param is not present in full-text search
          property: params?.vector?.property ?? pluginParams.defaultProperty,
          value: embeddings
        }
      }

      params.vector.value = embeddings
    }
  }
}
