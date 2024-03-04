import type { AnyOrama, Results, SearchParams, OramaPluginSync, AnyDocument } from '@orama/orama'
import { Collector } from './collector.js'
import { DEFAULT_TELEMETRY_FLUSH_INTERVAL, DEFAULT_TELEMETRY_FLUSH_SIZE, DEFAULT_TELEMETRY_ENDPOINT, DEFAULT_ORAMA_DEPLOYMENT_ID, DEFAULT_ORAMA_VERSION } from './const.js'

const PLUGIN_NAME = 'plugin-telemetry'

export interface PluginTelemetryParams {
  apiKey: string
  indexId: string
  enabled?: boolean
  deploymentId?: string
  oramaId?: string
  endpoint?: string
  flushInterval?: number
  flushSize?: number
}

export function pluginTelemetry(params: PluginTelemetryParams) {
  if (params.enabled === false) {
    // We register the plugin but we don't do anything
    return {
      name: PLUGIN_NAME
    }
  }

  if (!params.apiKey) throw new Error('Missing apiKey for plugin-telemetry')
  if (!params.indexId) throw new Error('Missing indexId for plugin-telemetry')

  const flushInterval = params.flushInterval || DEFAULT_TELEMETRY_FLUSH_INTERVAL
  const flushSize = params.flushSize || DEFAULT_TELEMETRY_FLUSH_SIZE
  const endpoint = params.endpoint || DEFAULT_TELEMETRY_ENDPOINT
  const deploymentId = params.deploymentId || DEFAULT_ORAMA_DEPLOYMENT_ID
  let collector: Collector | undefined

  const afterSearch: OramaPluginSync['afterSearch'] = <T extends AnyOrama>(orama: T, params: SearchParams<T>, language: string | undefined, results: Results<AnyDocument>) => {
    collector?.add({
      query: params as any,
      resultsCount: results.count,
      roundTripTime: Math.round(results.elapsed.raw / 1_000_000), // nanoseconds to milliseconds
      searchedAt: new Date(),
      cached: false,
      rawSearchString: params.term,
      results: results.hits?.map((hit) => ({ id: hit.id, score: hit.score }))
    })
  }

  const afterCreate: OramaPluginSync['afterCreate'] = <T extends AnyOrama>(orama: T) => {
    collector = Collector.create({
      endpoint,
      indexId: params.indexId,
      deploymentId,
      oramaId: orama.id,
      oramaVersion: orama.version || DEFAULT_ORAMA_VERSION,
      apiKey: params.apiKey,
      flushSize,
      flushInterval,
    })
  }

  return {
    name: PLUGIN_NAME,
    afterSearch,
    afterCreate,
  }
}
