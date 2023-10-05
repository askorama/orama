/* eslint-disable @typescript-eslint/no-unused-vars */
import { expectAssignable, expectNotAssignable } from 'tsd'
import type { SearchParams, Orama } from '../../src/types.d.ts'

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

// Test search properties type
{
  type MovieSearchParamsProperties = SearchParams<Orama<typeof movieSchema>>['properties']

  expectAssignable<MovieSearchParamsProperties>('*')
  expectAssignable<MovieSearchParamsProperties>(['title'])
  expectAssignable<MovieSearchParamsProperties>(['meta.foo'])
  expectNotAssignable<MovieSearchParamsProperties>(['meta.unknown'])
  expectNotAssignable<MovieSearchParamsProperties>(['unknown'])

  // Test search properties type with unknown schema
  {
    type MovieSearchParamsProperties = SearchParams<Orama<any>>['properties']
    expectAssignable<MovieSearchParamsProperties>('*')
    expectAssignable<MovieSearchParamsProperties>(['title'])
  }
}
