import type { AnyOrama, Results, SearchParams, Language } from '@orama/orama'
import * as CONST from './const.js'

type Maybe<T = unknown> = T | undefined

export type PluginTelemetryParams = {
  apiKey: string
  endpoint: string
  flushInterval?: number
  flushSize?: number
}

export function pluginTelemetry(params: PluginTelemetryParams) {
  const flushInterval = params.flushInterval || CONST.DEFAULT_TELEMETRY_FLUSH_INTERVAL
  const flushSize = params.flushSize || CONST.DEFAULT_TELEMETRY_FLUSH_SIZE

  return {
    name: 'plugin-telemetry',
    afterSearch: (orama: AnyOrama, query: SearchParams<AnyOrama>, language: Maybe<Language>, results: Results<unknown>) => {}
  }
}
