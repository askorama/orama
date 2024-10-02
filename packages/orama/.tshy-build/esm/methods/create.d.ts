import { DocumentsStore } from '../components/documents-store.js'
import { Index } from '../components/index.js'
import { Sorter } from '../components/sorter.js'
import { Components, IDocumentsStore, IIndex, ISorter, Orama, OramaPlugin, SorterConfig } from '../types.js'
interface CreateArguments<OramaSchema, TIndex, TDocumentStore, TSorter> {
  schema: OramaSchema
  sort?: SorterConfig
  language?: string
  components?: Components<
    Orama<OramaSchema, TIndex, TDocumentStore, TSorter>,
    OramaSchema,
    TIndex,
    TDocumentStore,
    TSorter
  >
  plugins?: OramaPlugin[]
  id?: string
}
export declare function create<
  OramaSchema,
  TIndex = IIndex<Index>,
  TDocumentStore = IDocumentsStore<DocumentsStore>,
  TSorter = ISorter<Sorter>
>({
  schema,
  sort,
  language,
  components,
  id,
  plugins
}: CreateArguments<OramaSchema, TIndex, TDocumentStore, TSorter>): Orama<OramaSchema, TIndex, TDocumentStore, TSorter>
export {}
