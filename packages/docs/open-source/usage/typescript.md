---
outline: deep
---

# Use with Typescript

Orama is written in TypeScript and supports strong typing as a first-class feature.

## Usage

You may want to types your variables. If needed, you can do it like this:

```ts copy
import type { TypedDocument, Orama, Results, SearchParams } from '@orama/orama'
import { create, insert, search } from '@orama/orama'

type MovieDocument = TypedDocument<Orama<typeof movieSchema>>

const movieSchema = {
  title: 'string',
  year: 'number',
  actors: 'string[]',
  isFavorite: 'boolean',
  stars: 'enum'
} as const // <-- this is important

const movieDB: Orama<typeof movieSchema> = await create({
  schema: movieSchema,
})

const idP: string = await insert(movieDB, {
  title: 'The Godfather',
  year: 1972,
  actors: ['Marlon Brando', 'Al Pacino'],
  isFavorite: true,
})

const searchParams: SearchParams<Orama<typeof movieSchema>> = {
  term: 'godfather',
}
const result: Results<MovieDocument> = await search(movieDB, searchParams)
const title = result.hits[0].document.title // well typed!
```

## Enrich type of documents

Orama schema considers only the properties that are indexed.
Anyway, the added documents can have other properties that are not indexed.
The following example shows how to enrich the type of the documents.

```ts copy
const movieSchema = {
  title: 'string',
} as const
const db = await create({ schema: movieSchema })

interface Movie {
  title: string,
  year: number,
}

//             this is important ---v
const r = await search<typeof db, Movie>(db, { term: '' })
const title = r.hits[0].document.title // well typed!
const year = r.hits[0].document.year // well typed!
```

## Configuration

Set `moduleResolution` in the `compilerOptions` in your `tsconfig.json` to be either `Node16` or `NodeNext`.

When importing types, always refer to the standard orama import:

```ts copy
import type { Language } from '@orama/orama'
```