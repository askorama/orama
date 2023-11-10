import { Result } from '@orama/orama'
import type { Position } from '@orama/highlight'

import type { AnyDocument, AnySchema, RawData } from '@orama/orama'

interface DocsVersion {
  name: string
  path: string
}

export interface SectionSchema extends AnyDocument {
  type: string
  sectionContent: string
  pageRoute: string
  sectionTitle: string
  version: string
  hash: string
}

export type RawDataWithPositions = RawData & { positions: Record<string, Record<string, Record<string, Position[]>>> }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PluginOptions {}

export interface PluginData {
  searchData: Record<string, { data: ArrayBuffer }>
  versions: DocsVersion[]
}

export type Hit = Result<SectionSchema> & { position: Position }

export const PLUGIN_NAME = '@orama/plugin-docusaurus'
export const INDEX_FILE = 'orama-search-index-@VERSION@.json.gz'

export const schema = {
  pageRoute: 'string',
  sectionTitle: 'string',
  sectionContent: 'string',
  type: 'string',
  version: 'string'
} satisfies AnySchema
