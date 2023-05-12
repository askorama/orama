# Orama

Search, everywhere.

[![Tests](https://github.com/oramasearch/orama/actions/workflows/turbo.yml/badge.svg)](https://github.com/oramasearch/orama/actions/workflows/turbo.yml)

# Join Orama's Slack channel

If you need more info, help, or want to provide general feedback on Orama, join the [Orama Slack channel](https://join.slack.com/t/orama-community/shared_invite/zt-1gzvj0mmt-yJhJ6pnrSGuwqPmPx9uO5Q)

# Highlighted features

- [Search filters](https://docs.oramasearch.com/usage/search/filters)
- [Facets](https://docs.oramasearch.com/usage/search/facets)
- [Fields Boosting](https://docs.oramasearch.com/usage/search/fields-boosting)
- [Typo tolerance](https://docs.oramasearch.com/usage/search/introduction#typo-tolerance)
- [Exact match](https://docs.oramasearch.com/usage/search/introduction#exact-match)
- [Stemming and tokenization in 26 languages](https://docs.oramasearch.com/text-analysis/stemming)

# Installation

You can install Orama using `npm`, `yarn`, `pnpm`:

```sh
npm i @orama/orama
```

```sh
yarn add @orama/orama
```

```sh
pnpm add @orama/orama
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

Read the complete documentation at [https://docs.oramasearch.com](https://docs.oramasearch.com).

# Usage

Orama is quite simple to use. The first thing to do is to create a new database
instance and set an indexing schema:

```js
import { create, insert, remove, search } from '@orama/orama'

const db = await create({
  schema: {
    name: 'string',
    description: 'string',
    price: 'number',
    meta: {
      rating: 'number',
    },
  },
})
```

If you are using Node.js without ESM, please see the [usage with CommonJS](#usage-with-commonjs) section below on how to properly require Orama.

Orama will only index string properties, but will allow you to set and store
additional data if needed.

Once the db instance is created, you can start adding some documents:

```js
await insert(db, {
  name: 'Wireless Headphones',
  description: 'Experience immersive sound quality with these noise-cancelling wireless headphones.',
  price: 99.99,
  meta: {
    rating: 4.5,
  },
})

await insert(db, {
  name: 'Smart LED Bulb',
  description:
    'Control the lighting in your home with this energy-efficient smart LED bulb, compatible with most smart home systems.',
  price: 24.99,
  meta: {
    rating: 4.3,
  },
})

await insert(db, {
  name: 'Portable Charger',
  description:
    'Never run out of power on-the-go with this compact and fast-charging portable charger for your devices.',
  price: 29.99,
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

# Usage with CommonJS

Orama is packaged as ES modules, suitable for Node.js, Deno, Bun and modern browsers.

**In most cases, simply `import` or `@orama/orama` will suffice ✨.**

In Node.js, when not using ESM (with `"type": "module"` in the `package.json`), you have several ways to properly require Orama.
Starting with version 0.4.0 it becomes:

```js
async function main() {
  const { create, insert } = await import('@orama/orama')

  const db = create(/* ... */)
  insert(db, {
    /* ... */
  })
}

main().catch(console.error)
```

## Use CJS requires

Orama methods can be required as CommonJS modules by requiring from `@orama/orama`.

```js
const { create, insert } = require("@orama/orama")

create(/* ... */)
  .then(db => insert(db, { /* ... */ })
  .catch(console.error)
```

Note that only main methods are supported so for internals and other supported exports you still have to use `await import`.

# Community Rewards

![Orama Community Rewards](https://raw.githubusercontent.com/oramasearch/orama/main/misc/readme/community-rewards.png)

Are you using Orama in production? Have you written an article or made a YouTube video on Orama? [Contact us](mailto:info@oramasearch.com) to get some Orama swag in return!

# Official Docs

Read the complete documentation at [https://docs.oramasearch.com](https://docs.oramasearch.com).

# License

Orama is licensed under the [Apache 2.0](/LICENSE.md) license.
