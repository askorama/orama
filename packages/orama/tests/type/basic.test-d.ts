/* eslint-disable @typescript-eslint/no-unused-vars */
import { expectType } from 'tsd'
import type { InternalTypedDocument, Orama, Results, Schema } from '../../src/types.d.ts'
import { create, insert, search } from '../../src/index.js'

const movieSchema = {
  title: 'string',
  year: 'number',
  actors: 'string[]',
  isFavorite: 'boolean',
  stars: 'enum'
} as const
type MovieSchema = Schema<typeof movieSchema>
type MovieDocument = InternalTypedDocument<MovieSchema>

const movieDBP = create({
  schema: movieSchema,
})
expectType<Promise<Orama<typeof movieSchema>>>(movieDBP)
const movieDB = await movieDBP

const idP = insert(movieDB, {
  title: 'The Godfather',
  year: 1972,
  actors: ['Marlon Brando', 'Al Pacino'],
  isFavorite: true,
})
expectType<Promise<string>>(idP)

const resultP = search(movieDB, {
  term: 'godfather',
})
expectType<Promise<Results<MovieDocument>>>(resultP)
const result = await resultP
expectType<string>(result.hits[0].document.title)


