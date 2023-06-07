import type { Document, RawData, Schema } from '@orama/orama'
import { Position } from '@orama/plugin-match-highlight'

interface DocsVersion {
  name: string
  path: string
}

export interface SectionSchema extends Document {
  type: string
  sectionContent: string
  pageRoute: string
  sectionTitle: string
  version: string
}

export type RawDataWithPositions = RawData & { positions: Record<string, Record<string, Record<string, Position[]>>> }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PluginOptions {}

export interface PluginData {
  searchData: Record<string, RawDataWithPositions>
  versions: DocsVersion[]
}

export const schema: Schema = {
  pageRoute: 'string',
  sectionTitle: 'string',
  sectionContent: 'string',
  type: 'string',
  version: 'string'
}
