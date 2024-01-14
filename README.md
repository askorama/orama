<p align="center">
  <img src="/misc/readme/orama-readme_logo-dark.png#gh-dark-mode-only" />
  <img src="/misc/readme/orama-readme_logo-light.png#gh-light-mode-only" />
</p>
<br />
<h4 align="center">
  <a href="https://oramasearch.com?utm_source=github">Website</a> •
  <a href="https://oramasearch.com/blog?utm_source=github">Blog</a> •
  <a href="https://docs.oramasearch.com?utm_source=github">Documentation</a> •
  <a href="https://orama.to/slack">Slack</a>
</h4>
<br />
<p align="center">
  A resilient, innovative and open-source full-text and vector search experience to achieve <br />
  seamless integration with your infrastructure and data
</p>
<br />
<p align="center">
  <img src="/misc/readme/orama-readme_runs-dark.png#gh-dark-mode-only" />
  <img src="/misc/readme/orama-readme_runs-light.png#gh-light-mode-only" />
</p>

[![Tests](https://github.com/oramasearch/orama/actions/workflows/turbo.yml/badge.svg)](https://github.com/oramasearch/orama/actions/workflows/turbo.yml)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40orama%2Forama?label=Bundle%20Size&link=https%3A%2F%2Fbundlephobia.com%2Fpackage%2F%40orama%2Forama%40latest)

# Join Orama's Slack channel

If you need more info, help, or want to provide general feedback on Orama, join
the
[Orama Slack channel](https://orama.to/slack)

# Highlighted features

- [Vector Search](https://docs.oramasearch.com/open-source/usage/search/vector-search)
- [Hybrid Search](https://docs.oramasearch.com/open-source/usage/search/hybrid-search)
- [Search filters](https://docs.oramasearch.com/open-source/usage/search/filters)
- [Geosearch](https://docs.oramasearch.com/open-source/usage/search/geosearch)
- [Facets](https://docs.oramasearch.com/open-source/usage/search/facets)
- [Fields Boosting](https://docs.oramasearch.com/open-source/usage/search/fields-boosting)
- [Typo tolerance](https://docs.oramasearch.com/open-source/usage/search/introduction#typo-tolerance)
- [Exact match](https://docs.oramasearch.com/open-source/usage/search/introduction#exact-match)
- [Stemming and tokenization in 28 languages](https://docs.oramasearch.com/open-source/text-analysis/stemming)

# Installation

You can install Orama using `npm`, `yarn`, `pnpm`, `bun`:

```sh
npm i @orama/orama
```

Or import it directly in a browser module:

```html
<html>
  <body>
    <script type="module">
      import { create, search, insert } from 'https://unpkg.com/@orama/orama@latest/dist/index.js'

      // ...
    </script>
  </body>
</html>
```

With Deno, you can just use the same CDN URL or use npm specifiers:

```js
import { create, search, insert } from 'npm:@orama/orama'
```

Read the complete documentation at [https://docs.oramasearch.com](https://docs.oramasearch.com).

# Usage

Orama is quite simple to use. The first thing to do is to create a new database
instance and set an indexing schema:

```js
import { create, insert, remove, search, searchVector } from '@orama/orama'

const db = await create({
  schema: {
    name: 'string',
    description: 'string',
    price: 'number',
    embedding: 'vector[1536]', // Vector size must be expressed during schema initialization
    meta: {
      rating: 'number',
    },
  },
})
```

Orama will only index properties specified in the schema but will allow you to set and store additional data if needed.

Once the db instance is created, you can start adding some documents:

```js
await insert(db, {
  name: 'Wireless Headphones',
  description: 'Experience immersive sound quality with these noise-cancelling wireless headphones.',
  price: 99.99,
  embedding: [...],
  meta: {
    rating: 4.5,
  },
})

await insert(db, {
  name: 'Smart LED Bulb',
  description: 'Control the lighting in your home with this energy-efficient smart LED bulb, compatible with most smart home systems.',
  price: 24.99,
  embedding: [...],
  meta: {
    rating: 4.3,
  },
})

await insert(db, {
  name: 'Portable Charger',
  description: 'Never run out of power on-the-go with this compact and fast-charging portable charger for your devices.',
  price: 29.99,
  embedding: [...],
  meta: {
    rating: 3.6,
  },
})
```

After the data has been inserted, you can finally start to query the database.

```js
const searchResult = await search(db, {
  term: 'headphones',
})
```

In the case above, you will be searching for all the documents containing the
word `headphones`, looking up in every schema property (AKA index):

```js
{
  elapsed: {
    raw: 99512,
    formatted: '99μs',
  },
  hits: [
    {
      id: '41013877-56',
      score: 0.925085832971998432,
      document: {
        name: 'Wireless Headphones',
        description: 'Experience immersive sound quality with these noise-cancelling wireless headphones.',
        price: 99.99,
        meta: {
          rating: 4.5
        }
      }
    }
  ],
  count: 1
}
```

You can also restrict the lookup to a specific property:

```js
const searchResult = await search(db, {
  term: 'immersive sound quality',
  properties: ['description'],
})
```

Result:

```js
{
  elapsed: {
    raw: 21492,
    formatted: '21μs',
  },
  hits: [
    {
      id: '41013877-56',
      score: 0.925085832971998432,
      document: {
        name: 'Wireless Headphones',
        description: 'Experience immersive sound quality with these noise-cancelling wireless headphones.',
        price: 99.99,
        meta: {
          rating: 4.5
        }
      }
    }
  ],
  count: 1
}
```

# Performing hybrid and vector search

Orama is a full-text and vector search engine. This allows you to adopt different kinds of search paradigms depending on your specific use case.

To perform vector or hybrid search, you can use the same `search` method used for full-text search.

You'll just have to specify which property you want to perform vector search on, and a vector to be used to perform vector similarity:

```js
const searchResult = await searchVector(db, {
  mode: 'vector', // or 'hybrid'
  vector: {
    value: [...], // OpenAI embedding or similar vector to be used as an input
    property: 'embedding' // Property to search through. Mandatory for vector search
  }
})
```

If you're using the [Orama Secure AI Proxy](https://oramasearch.com/secure-ai-proxy) (highly recommended), you can skip the vector configuration at search time, since the official [Orama Secure AI Proxy plugin](https://www.npmjs.com/package/@orama/plugin-secure-proxy) will take care of it automatically for you:

```js
import { create } from '@orama/orama'
import { pluginSecureProxy } from '@orama/plugin-secure-proxy'

const secureProxy = secureProxyPlugin({
  apiKey: '<YOUR-PUBLIC-API-KEY>',
  defaultProperty: 'embedding' // the default property to perform vector and hybrid search on
})

const db = await create({
  schema: {
    name: 'string',
    description: 'string',
    price: 'number',
    embedding: 'vector[1536]',
    meta: {
      rating: 'number',
    },
  },
  plugins: [secureProxy]
})

const resultsHybrid = await search(db, {
  mode: 'vector', // or 'hybrid'
  term: 'Videogame for little kids with a passion about ice cream',
  where: {
    price: {
      lte: 19.99
    },
    'meta.rating': {
      gte: 4.5
    }
  }
})
```

# Official Docs

Read the complete documentation at [https://docs.oramasearch.com](https://docs.oramasearch.com).

# License

Orama is licensed under the [Apache 2.0](/LICENSE.md) license.
