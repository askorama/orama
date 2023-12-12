import type { AnyOrama, Results, SearchParams, Language } from '@orama/orama'
import type { Optional } from './types.js'
import { Collector } from './collector.js'
import { DEFAULT_TELEMETRY_FLUSH_INTERVAL, DEFAULT_TELEMETRY_FLUSH_SIZE } from './const.js'

export interface PluginTelemetryParams {
  apiKey: string
  endpoint: string
  flushInterval?: number
  flushSize?: number
}

export function pluginTelemetry(params: PluginTelemetryParams) {
  const flushInterval = params.flushInterval || DEFAULT_TELEMETRY_FLUSH_INTERVAL
  const flushSize = params.flushSize || DEFAULT_TELEMETRY_FLUSH_SIZE

  if (!params.apiKey) throw new Error('Missing apiKey for plugin-telemetry')
  if (!params.endpoint) throw new Error('Missing endpoint for plugin-telemetry')

  const collector = Collector.create({
    id: params.endpoint,
    endpoint: params.endpoint,
    api_key: params.apiKey,
    flushSize,
    flushInterval
  })

  return {
    name: 'plugin-telemetry',
    afterSearch: (
      orama: AnyOrama,
      query: SearchParams<AnyOrama, unknown>,
      language: Optional<Language>,
      results: Results<unknown>
    ) => {
      collector.add({
        query,
        resultsCount: results.count,
        roundTripTime: results.elapsed.raw,
        searchedAt: new Date(),
        rawSearchString: query.term
      })
    }
  }
}
