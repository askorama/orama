/* eslint-disable @typescript-eslint/no-unused-vars */
import { expectType, expectAssignable, expectNotAssignable } from 'tsd'
import type { SearchParams, Orama, Schema } from '../../src/types.d.ts'
import { create, search } from '../../src/index.js'

const movieSchema = {
  title: 'string',
  year: 'number',
  actors: 'string[]',
  isFavorite: 'boolean',
  stars: 'enum',
  meta: {
    foo: 'string'
  }
} as const
type MovieSchema = Schema<typeof movieSchema>

const movieDBP = create({
  schema: movieSchema,
})
expectType<Promise<Orama<typeof movieSchema>>>(movieDBP)
const movieDB: Orama<typeof movieSchema> = await movieDBP

// Test search properties type
{
  type MovieSearchParamsProperties = SearchParams<Orama<typeof movieSchema>>['properties']

  expectAssignable<MovieSearchParamsProperties>('*')
  expectAssignable<MovieSearchParamsProperties>(['title'])
  expectAssignable<MovieSearchParamsProperties>(['meta.foo'])
  expectNotAssignable<MovieSearchParamsProperties>(['meta.unknown'])
  expectNotAssignable<MovieSearchParamsProperties>(['unknown'])

  search(movieDB, {
    properties: ['unknown'] as unknown as MovieSearchParamsProperties,
  })
}
