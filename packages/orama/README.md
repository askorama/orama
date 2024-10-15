<p align="center">
  <img src="https://raw.githubusercontent.com/askorama/orama/refs/heads/main/misc/readme/orama-readme-hero-dark.png#gh-dark-mode-only" />
  <img src="https://raw.githubusercontent.com/askorama/orama/refs/heads/main/misc/readme/orama-readme-hero-light.png#gh-light-mode-only" />
</p>

[![Tests](https://github.com/oramasearch/orama/actions/workflows/turbo.yml/badge.svg)](https://github.com/oramasearch/orama/actions/workflows/turbo.yml)

If you need more info, help, or want to provide general feedback on Orama, join the [Orama Slack channel](https://orama.to/slack)

# Highlighted features

- [Vector Search](https://docs.orama.com/open-source/usage/search/vector-search)
- [Hybrid Search](https://docs.orama.com/open-source/usage/search/hybrid-search)
- [Search Filters](https://docs.orama.com/open-source/usage/search/filters)
- [Geosearch](https://docs.orama.com/open-source/usage/search/geosearch)
- [Facets](https://docs.orama.com/open-source/usage/search/facets)
- [Fields Boosting](https://docs.orama.com/open-source/usage/search/fields-boosting)
- [Typo Tolerance](https://docs.orama.com/open-source/usage/search/introduction#typo-tolerance)
- [Exact Match](https://docs.orama.com/open-source/usage/search/introduction#exact-match)
- [BM25](https://docs.orama.com/open-source/usage/search/bm25-algorithm)
- [Stemming and tokenization in 30 languages](https://docs.orama.com/open-source/text-analysis/stemming)
- [Plugin System](https://docs.orama.com/open-source/plugins/introduction)

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
      import { create, insert, search } from 'https://cdn.jsdelivr.net/npm/@orama/orama@latest/+esm'
    </script>
  </body>
</html>
```

With Deno, you can just use the same CDN URL or use npm specifiers:

```js
import { create, search, insert } from 'npm:@orama/orama'
```

Read the complete documentation at [https://docs.orama.com](https://docs.orama.com).

# Orama Features

<p align="center">
  <img src="https://raw.githubusercontent.com/askorama/orama/refs/heads/main/misc/readme/features-dark.png#gh-dark-mode-only" />
  <img src="https://raw.githubusercontent.com/askorama/orama/refs/heads/main/misc/readme/features-light.png#gh-light-mode-only" />
</p>

# Usage

Orama is quite simple to use. The first thing to do is to create a new database
instance and set an indexing schema:

```js
import { create, insert, remove, search, searchVector } from '@orama/orama'

const db = create({
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

insert(db, {
  name: 'Noise cancelling headphones',
  description: 'Best noise cancelling headphones on the market',
  price: 99.99,
  embedding: [0.2432, 0.9431, 0.5322, 0.4234, ...],
  meta: {
    rating: 4.5
  }
})

const results = search(db, {
  term: 'Best headphones'
})

// {
//   elapsed: {
//     raw: 21492,
//     formatted: '21μs',
//   },
//   hits: [
//     {
//       id: '41013877-56',
//       score: 0.925085832971998432,
//       document: {
//         name: 'Noise cancelling headphones',
//         description: 'Best noise cancelling headphones on the market',
//         price: 99.99,
//         embedding: [0.2432, 0.9431, 0.5322, 0.4234, ...],
//         meta: {
//           rating: 4.5
//         }
//       }
//     }
//   ],
//   count: 1
// }
```

Orama currently supports 10 different data types:

| Type             | Description                                                                 | Example                                                                     |
| ---------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `string`         | A string of characters.                                                     | `'Hello world'`                                                             |
| `number`         | A numeric value, either float or integer.                                   | `42`                                                                        |
| `boolean`        | A boolean value.                                                            | `true`                                                                      |
| `enum`           | An enum value.                                                              | `'drama'`                                                                   |
| `geopoint`       | A geopoint value.                                                           | `{ lat: 40.7128, lon: 74.0060 }`                                            |
| `string[]`       | An array of strings.                                                        | `['red', 'green', 'blue']`                                                  |
| `number[]`       | An array of numbers.                                                        | `[42, 91, 28.5]`                                                            |
| `boolean[]`      | An array of booleans.                                                       | `[true, false, false]`                                                      |
| `enum[]`         | An array of enums.                                                          | `['comedy', 'action', 'romance']`                                           |
| `vector[<size>]` | A vector of numbers to perform vector search on.                            | `[0.403, 0.192, 0.830]`                                                     |

# Official Docs

Read the complete documentation at [https://docs.orama.com/open-source](https://docs.orama.com/open-source).

# Official Orama Plugins

- [Plugin Embeddings](https://docs.orama.com/open-source/plugins/plugin-embeddings)
- [Plugin Analytics](https://docs.orama.com/open-source/plugins/plugin-analytics)
- [Plugin Data Persistence](https://docs.orama.com/open-source/plugins/plugin-data-persistence)
- [Plugin QPS](https://docs.orama.com/open-source/plugins/plugin-qps)
- [Plugin PT15](https://docs.orama.com/open-source/plugins/plugin-pt15)
- [Plugin Vitepress](https://docs.orama.com/open-source/plugins/plugin-vitepress)
- [Plugin Docusaurus](https://docs.orama.com/open-source/plugins/plugin-docusaurus)
- [Plugin Secure Proxy](https://docs.orama.com/open-source/plugins/plugin-secure-proxy)
- [Plugin Astro](https://docs.orama.com/open-source/plugins/plugin-astro)
- [Plugin Nextra](https://docs.orama.com/open-source/plugins/plugin-nextra)

Write your own plugin: [https://docs.orama.com/open-source/plugins/writing-your-own-plugins](https://docs.orama.com/open-source/plugins/writing-your-own-plugins)

# License

Orama is licensed under the [Apache 2.0](/LICENSE.md) license.
