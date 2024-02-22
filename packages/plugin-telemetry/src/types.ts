import type { SearchParams, AnyOrama } from '@orama/orama'

export type Optional<T = unknown> = T | undefined

export interface SearchEvent {
  rawSearchString?: string
  query: SearchParams<AnyOrama>
  resultsCount: number
  roundTripTime: number
  searchedAt: Date
  results: { id: string, score: number }[]
  cached?: boolean
}

export interface TelemetryConfig {
  flushInterval: number
  flushSize: number
}
