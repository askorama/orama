import { Document } from '@orama/orama'

export interface SectionSchema extends Document {
  type: string
  sectionContent: string
  pageRoute: string
  sectionTitle: string
}
