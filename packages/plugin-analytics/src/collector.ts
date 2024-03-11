import type { SearchEvent, AnalyticsConfig } from './types.js'
import { sendBeacon } from './polyfills.js'
import { ANALYTICS_OSS_SOURCE } from './const.js'

type Data = object[]

export interface CollectorConstructor extends AnalyticsConfig {
  endpoint: string
  apiKey: string
  deploymentId: string
  oramaId: string
  oramaVersion: string
  indexId: string
}

export class Collector {
  private data: Data
  private readonly config: CollectorConstructor

  private constructor(config: CollectorConstructor) {
    this.data = []
    this.config = config
  }

  public static create(config: CollectorConstructor): Collector {
    const collector = new Collector(config)
    collector.start()
    return collector
  }

  public add(data: SearchEvent): void {
    this.data.push({
      rawSearchString: data.rawSearchString,
      query: data.query,
      resultsCount: data.resultsCount,
      roundTripTime: data.roundTripTime,
      searchedAt: data.searchedAt,
      results: data.results,
      // The referer is different for every event:
      // the user can search in different pages of the website
      // and the referer will be different for each page
      referer: typeof location !== 'undefined' ? location.toString() : undefined
    })

    if (this.data.length >= this.config.flushSize) {
      this.flush()
    }
  }

  public flush(): void {
    if (this.data.length === 0) {
      return
    }

    // Swap out the data array *sync*
    // so that we can continue to collect events
    const data = this.data
    this.data = []

    const body = {
      source: ANALYTICS_OSS_SOURCE,
      deploymentID: this.config.deploymentId,
      index: this.config.indexId,
      oramaId: this.config.oramaId,
      oramaVersion: this.config.oramaVersion,
      // The user agent is the same for every event
      // Because we use "application/x-www-form-urlencoded",
      // the browser doens't send the user agent automatically
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      events: data
    }

    sendBeacon(this.config.endpoint + `?api-key=${this.config.apiKey}`, JSON.stringify(body))
  }

  private start(): void {
    const interval = setInterval(this.flush.bind(this), this.config.flushInterval)
    if (interval.unref != null) {
      interval.unref()
    }
  }
}
