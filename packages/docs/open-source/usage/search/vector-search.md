---
outline: deep
---

# Vector Search

Since `v1.2.0`, Orama supports **vector search** natively 🎉.

To perform search through vectors, you need to correctly configure your Orama schema, as described in the [create page](/open-source/usage/create).

## Performing Vector Search

To perform vector search, you will need to use a new method called `searchVector`, which can be imported from `@orama/orama`:

```js copy
import { searchVector } from '@orama/orama'
```

The APIs are very similar to the ones you already know, but with a few differences:

1. Instead of searching for a `term`, you will need to provide a `vector` to search for.
2. You will need to specify the vector property you want to search on.
3. At the time of writing, you can only search through one vector property at a time. If you think that this is too limiting, please open a [feature request](https://github.com/oramasearch/orama/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=) to support multiple vector properties at search-time.

Let's see a full example of how to perform vector search:

```js copy
import { create, insertMultiple, searchVector } from '@orama/orama'

const db = await create({
  schema: {
    title: 'string',        // To make it simple, let's pretend that
    embedding: 'vector[5]', // we are using a 5-dimensional vector.
  }
})

await insertMultiple(db, [
  { title: 'The Prestige', embedding: [0.938293, 0.284951, 0.348264, 0.948276, 0.564720] },
  { title: 'Barbie',       embedding: [0.192839, 0.028471, 0.284738, 0.937463, 0.092827] },
  { title: 'Oppenheimer',  embedding: [0.827391, 0.927381, 0.001982, 0.983821, 0.294841] },
])

const results = await searchVector(db, {
  vector: [0.938292, 0.284961, 0.248264, 0.748276, 0.264720],
  property: 'embedding',
  similarity: 0.8,      // Minimum similarity. Defaults to `0.8`
  includeVectors: true, // Defaults to `false`
  limit: 10,            // Defaults to `10`
  offset: 0,            // Defaults to `0`
})
```

The returning object will be exactly the same as the one we would expect from the default `search` method:

```js
{
  count: 1,
  elapsed: {
    raw: 25000,
    formatted: '25ms',
  },
  hits: [
    {
      id: '1-19238',
      score: 0.812383129,
      document: {
        title: 'The Prestige',
        embedding: [0.938293, 0.284951, 0.348264, 0.948276, 0.564720],
      }
    }
  ]
}
```

Since vectors can be quite large, you can also choose to not include them in the response by setting `includeVectors` to `false` (default behavior).