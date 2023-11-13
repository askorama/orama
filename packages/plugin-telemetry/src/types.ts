import type { SearchParams, AnyOrama } from '@orama/orama'

export type Optional<T = unknown> = T | undefined

export interface SearchEvent {
  rawSearchString?: string
  query: SearchParams<AnyOrama, unknown>
  resultsCount: number
  roundTripTime: number
  searchedAt: Date
  cached?: boolean
}

export interface ICollector {
  endpoint: string
  deploymentID: string
  index: string
}

export interface TelemetryConfig {
  flushInterval: number
  flushSize: number
}
