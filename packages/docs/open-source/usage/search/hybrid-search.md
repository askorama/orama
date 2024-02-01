---
outline: deep
---

# Hybrid Search

Hybrid search is an Orama feature that allows you to perform full-text and vector search in one unique query, combining the results to get the best of both worlds.

::: info Using Orama Secure Proxy
Running hybrid search on the front-end requires a translation from text to vector.

If you're using systems such as OpenAI to generate text embeddings, this would put you at risk of exposing your API Keys.

We highly recommend using the [Orama Secure Proxy Plugin](/open-source/plugins/plugin-secure-proxy.html) to mask your API Keys securely and prevent abuse of any kind.
:::

## Performing Hybrid Search

To perform hybrid search, you will need to use the same `search` method you're already using for full-text and vector search, which can be imported from `@orama/orama`:

```js copy
import { search } from '@orama/orama'
```

The key differences between running hybrid search and full-text search are:

1. Instead of searching for a `term` exclusively, you will also need to provide a `vector` object to search.
2. You will need to set `mode` to `"hybrid"` when running search.
3. You will need to specify the vector property you want to search on.
4. At the time of writing, you can only search through one vector property at a time. If you think that this is too limiting, please open a [feature request](https://github.com/oramasearch/orama/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=) to support multiple vector properties at search-time.

Let's see a full example of how to perform vector search:

```js copy
import { create, insertMultiple, search } from '@orama/orama'

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

const results = await search(db, {
  mode: 'hybrid',
  term: 'The Prestige'
  vector: {
    value: [0.938292, 0.284961, 0.248264, 0.748276, 0.264720],
    property: 'embedding',
  },
  similarity: 0.85,      // Minimum vector search similarity. Defaults to `0.8`
  includeVectors: true,  // Defaults to `false`
  limit: 10,             // Defaults to `10`
  offset: 0,             // Defaults to `0`
})
```

::: info Tip!
When running hybrid search using the secure proxy, you won't need to explicitly pass the `vector` configuration. Just run a simple search query!

```js
const results = await search(db, {
  mode: 'hybrid',
  term: 'The Prestige'
})
```

The plugin will automatically convert this text to vector for you, and will also prevent you from exposing your OpenAI API key when using it on the front-end.

[Learn more](/open-source/plugins/plugin-secure-proxy.html).
:::

The returning object will be exactly the same as the one we would expect when performing full-text search:

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

## Custom hybrid weights

By default, Orama performs full-text and vector searches concurrently. Then, it aggregates the results and uses default weights to determine which result is more important (the full-text or the vector one) in the final list of results.

You can customize these weights by passing a `hybridWeights` property to the search function:

```js
const results = await search(db, {
  mode: 'hybrid',
  term: 'The Prestige',
  vector: {
    value: [0.912729, 0.49271, 0.291728, 0.93819, 0.53618],
    property: 'embedding'
  },
  hybridWeights: {
    text: 0.8,
    vector: 0.2
  }
})
```

By default, Orama assigns `0.5` to `text` and `0.5` to `vector`. This means that full-text results and vector results carry the same weight.

However, in the example above, we adjust these weights to `{ text: 0.8, vector: 0.2 }`. This implies that full-text search results will hold more relevance than vector search results in the final list.
