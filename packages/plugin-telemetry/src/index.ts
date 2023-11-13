import type { AnyOrama, Results, SearchParams, Language } from '@orama/orama'
import type { Optional } from './types.js'
import { Collector } from './collector.js'
import { DEFAULT_TELEMETRY_FLUSH_INTERVAL, DEFAULT_TELEMETRY_FLUSH_SIZE } from './const.js'

export interface PluginTelemetryParams {
  apiKey: string
  flushInterval?: number
  flushSize?: number
}

export function pluginTelemetry (params: PluginTelemetryParams) {
  const flushInterval = params.flushInterval || DEFAULT_TELEMETRY_FLUSH_INTERVAL
  const flushSize = params.flushSize || DEFAULT_TELEMETRY_FLUSH_SIZE

  const collector = Collector.create({
    id: '',
    api_key: params.apiKey,
    flushSize,
    flushInterval
  })

  return {
    name: 'plugin-telemetry',
    afterSearch: (orama: AnyOrama, query: SearchParams<AnyOrama, unknown>, language: Optional<Language>, results: Results<unknown>) => {
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
