import type { create, AnyOrama, SearchableType, IIndex, AnyIndexStore, VectorIndex, AnySchema, SearchableValue, Tokenizer } from '@orama/orama'
import {
  getVectorSize, index as Index, internalDocumentIDStore, isVectorType } from '@orama/orama/components'
import { avl, bkd, flat, radix, bool } from '@orama/orama/trees'

type InternalDocumentID = internalDocumentIDStore.InternalDocumentID;

type CreateParams = Parameters<typeof create<AnyOrama, IIndex<QPSIndex>>>[0]
type Component = NonNullable<CreateParams['components']>
type IndexParameter = NonNullable<Component['index']>


export type Tree =
  | Index.TTree<'Radix', radix.RadixNode>
  | Index.TTree<'AVL', avl.AVLTree<number, InternalDocumentID[]>>
  | Index.TTree<'Bool', bool.BoolNode>
  | Index.TTree<'Flat', flat.FlatTree>
  | Index.TTree<'BKD', bkd.BKDTree>

export interface QPSIndex extends AnyIndexStore {
  indexes: Record<string, Tree>
  vectorIndexes: Record<string, VectorIndex>
  searchableProperties: string[]
  searchablePropertiesWithTypes: Record<string, SearchableType>
}

function recursiveCreate<T extends AnyOrama>(indexDatastore: QPSIndex, schema: T['schema'], prefix: string) {
  for (const [prop, type] of Object.entries<SearchableType>(schema)) {
    const path = `${prefix}${prefix ? '.' : ''}${prop}`

    if (typeof type === 'object' && !Array.isArray(type)) {
      // Nested
      recursiveCreate(indexDatastore, type, path)
      continue
    }

    if (isVectorType(type)) {
      indexDatastore.searchableProperties.push(path)
      indexDatastore.searchablePropertiesWithTypes[path] = type
      indexDatastore.vectorIndexes[path] = {
        size: getVectorSize(type),
        vectors: {}
      }
    } else {
      const isArray = /\[/.test(type as string)
      switch (type) {
        case 'boolean':
        case 'boolean[]':
          indexDatastore.indexes[path] = { type: 'Bool', node: new bool.BoolNode(), isArray }
          break
        case 'number':
        case 'number[]':
          indexDatastore.indexes[path] = { type: 'AVL', node: new avl.AVLTree<number, InternalDocumentID[]>(0, []), isArray }
          break
        case 'string':
        case 'string[]':
          indexDatastore.indexes[path] = { type: 'Radix', node: new radix.RadixTree(), isArray }
          // indexDatastore.avgFieldLength[path] = 0
          // indexDatastore.frequencies[path] = {}
          // indexDatastore.tokenOccurrences[path] = {}
          // indexDatastore.fieldLengths[path] = {}
          break
        case 'enum':
        case 'enum[]':
          indexDatastore.indexes[path] = { type: 'Flat', node: new flat.FlatTree(), isArray }
          break
        case 'geopoint':
          indexDatastore.indexes[path] = { type: 'BKD', node: new bkd.BKDTree(), isArray }
          break
        default:
          throw new Error('INVALID_SCHEMA_TYPE: ' + path)
      }

      indexDatastore.searchableProperties.push(path)
      indexDatastore.searchablePropertiesWithTypes[path] = type
    }
  }
}

export function qpsComponents(): {
  index: IndexParameter,
} {

  return {
    index: {
      create: function create<T extends AnyOrama>(orama: T, sharedInternalDocumentStore: T['internalDocumentIDStore'], schema: T['schema']) {
        const indexDatastore: QPSIndex = {
          indexes: {},
          vectorIndexes: {},
          searchableProperties: [],
          searchablePropertiesWithTypes: {},
        }

        recursiveCreate(indexDatastore, schema, '')

        return indexDatastore
      },
      insert: function insert(
        implementation: IIndex<QPSIndex>,
        indexDatastorage: QPSIndex,
        prop: string,
        id: DocumentID,
        internalId: InternalDocumentID,
        value: SearchableValue,
        schemaType: SearchableType,
        language: string | undefined,
        tokenizer: Tokenizer,
        docsCount: number
      ) {
        if (isVectorType(schemaType)) {
          return Index.insertVector(indexDatastorage, prop, value as number[] | Float32Array, id)
        }
      
        const insertScalar = insertScalarBuilder(implementation, index, prop, internalId, language, tokenizer, docsCount, options)
      
        if (!isArrayType(schemaType)) {
          return insertScalar(value)
        }
      
        const elements = value as Array<string | number | boolean>
        const elementsLength = elements.length
        for (let i = 0; i < elementsLength; i++) {
          insertScalar(elements[i])
        }
      },
      remove: Index.remove,
      insertDocumentScoreParameters: Index.insertDocumentScoreParameters,
      insertTokenScoreParameters: Index.insertTokenScoreParameters,
      removeDocumentScoreParameters: Index.removeDocumentScoreParameters,
      removeTokenScoreParameters: Index.removeTokenScoreParameters,
      calculateResultScores: Index.calculateResultScores,
      search: Index.search,
      searchByWhereClause: Index.searchByWhereClause,
      getSearchableProperties: Index.getSearchableProperties,
      getSearchablePropertiesWithTypes: Index.getSearchablePropertiesWithTypes,
      load: Index.load,
      save: Index.save
    }
  }
}
