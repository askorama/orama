<p align="center">
  <img src="/misc/readme/orama-readme_logo-dark.png#gh-dark-mode-only" />
  <img src="/misc/readme/orama-readme_logo-light.png#gh-light-mode-only" />
</p>
<br />
<h4 align="center">
  <a href="https://oramasearch.com?utm_source=github">Website</a> •
  <a href="https://oramasearch.com/blog?utm_source=github">Blog</a> •
  <a href="https://docs.oramasearch.com?utm_source=github">Documentation</a> •
  <a href="https://join.slack.com/t/orama-community/shared_invite/zt-1gzvj0mmt-yJhJ6pnrSGuwqPmPx9uO5Q">Slack</a>
</h4>
<br />
<p align="center">
  A resilient, innovative and open-source search experience to achieve <br />
  seamless integration with your infrastructure and data
</p>
<br />
<p align="center">
  <img src="/misc/readme/orama-readme_runs-dark.png#gh-dark-mode-only" />
  <img src="/misc/readme/orama-readme_runs-light.png#gh-light-mode-only" />
</p>

[![Tests](https://github.com/oramasearch/orama/actions/workflows/turbo.yml/badge.svg)](https://github.com/oramasearch/orama/actions/workflows/turbo.yml)

# Join Orama's Slack channel

If you need more info, help, or want to provide general feedback on Orama, join
the
[Orama Slack channel](https://join.slack.com/t/orama-community/shared_invite/zt-1gzvj0mmt-yJhJ6pnrSGuwqPmPx9uO5Q)

# Highlighted features
- [Search filters](https://docs.oramasearch.com/usage/search/filters)
- [Facets](https://docs.oramasearch.com/usage/search/facets)
- [Fields Boosting](https://docs.oramasearch.com/usage/search/fields-boosting)
- [Typo tolerance](https://docs.oramasearch.com/usage/search/introduction#typo-tolerance)
- [Exact match](https://docs.oramasearch.com/usage/search/introduction#exact-match)
- [Stemming and tokenizing in 26 languages](https://docs.oramasearch.com/text-analysis/stemming)

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
      rating: 'number'
    }
  },
})
```

If you are using Node.js without ESM, please see [build](#builds) section below on how to properly require Orama.

Orama will only index string properties, but will allow you to set and store
additional data if needed.

Once the db instance is created, you can start adding some documents:

```js
await insert(db, {
  name: 'Wireless Headphones',
  description: 'Experience immersive sound quality with these noise-cancelling wireless headphones.',
  price: 99.99,
  meta: {
    rating: 4.5
  }
})

await insert(db, {
  name: 'Smart LED Bulb',
  description: 'Control the lighting in your home with this energy-efficient smart LED bulb, compatible with most smart home systems.',
  price: 24.99,
  meta: {
    rating: 4.3
  }
})

await insert(db, {
  name: 'Portable Charger',
  description: 'Never run out of power on-the-go with this compact and fast-charging portable charger for your devices.',
  price: 29.99,
  meta: {
    rating: 3.6
  }
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

# Using with CommonJS

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

# Highlighted features

### Filters

<details>
  <summary>
    Using filters with Orama
  </summary>

You can use the `filters` interface to filter the search results. <br />
Filters are available for numeric, boolean and string properties.

On string properties, it performs an exact matching on tokens so it is advised to disable stemming for the properties you want to use filters on (when using the default tokenizer you can provide the `stemmerSkipProperties` configuration property).

If we consider the following schema:

```js
const db = await create({
  schema: {
    id: 'string',
    title: 'string',
    year: 'number',
    meta: {
      rating: 'number',
      length: 'number',
      favorite: 'boolean',
      tags: 'string'
    },
  },
  components: {
    tokenizer: {
      stemming: true,
      stemmerSkipProperties: ['meta.tags']
    }
  }
})
```

We will be able to filter the search results by using the `where` property on numeric properties only:

```js
const results = await search(db, {
  term: 'prestige',
  where: {
    year: {
      gte: 2000,
    },
    'meta.rating': {
      between: [5, 10],
    },
    'meta.favorite': true,
    length: {
      gt: 60,
    }
  },
})
```

Learn more about filters in the [official filters docs](https://docs.oramasearch.com/usage/search/filters).

</details>

### Facets

<details>
  <summary>
  Using facets with Orama
  </summary>

Facets are a powerful tool for filtering and narrowing down search results on the Orama search engine.

With the Orama Faceted Search API, users can filter their search results by various criteria, such as category, price range, or other attributes, making it easier to find the information they need. Whether you're building a website, mobile app, or any other application, the Orama Faceted Search API is the perfect solution for adding faceted search functionality to your project.

Given the following Orama schema:

```js
import { create } from '@orama/orama'
 
const db = await create({
  schema: {
    title: 'string',
    description: 'string',
    categories: {
      primary: 'string',
      secondary: 'string',
    },
    rating: 'number',
    isFavorite: 'boolean',
  },
})
```

Orama will be able to generate facets at search-time based on the schema. To do so, we need to specify the `facets` property in the `search` configuration:

```js
const results = await search(db, {
  term: 'Movie about cars and racing',
  properties: ['description'],
  facets: {
    'categories.first': {
      size: 3,
      order: 'DESC',
    },
    'categories.second': {
      size: 2,
      order: 'DESC',
    },
    rating: {
      ranges: [
        { from: 0, to: 3 },
        { from: 3, to: 7 },
        { from: 7, to: 10 },
      ],
    },
    isFavorite: {
      true: true,
      false: true,
    },
  },
})
```

This will generate the following results:

```js
{
  elapsed: ...,
  count: ...,
  hits: { ... },
  facets: {
    'categories.first': {
      count: 14,
      values: {
        'Action': 4,
        'Adventure': 3,
        'Comedy': 2,
      }
    },
    'categories.second': {
      count: 14,
      values: {
        'Cars': 4,
        'Racing': 3,
      }
    },
    rating: {
      count: 3,
      values: {
        '0-3': 5,
        '3-7': 15,
        '7-10': 80,
      }
    },
    isFavorite: {
      count: 2,
      values: {
        'true': 5,
        'false': 95,
      }
    },
  }
}
```

Learn more about facets in the [official facets docs](https://docs.oramasearch.com/usage/search/facets)

</details>

### Fields boosting

<details>
  <summary>
    Using fields boosting with Orama
  </summary>

You can use the boost interface to boost the importance of a field in the search results.

```js
const searchResult = await search(movieDB, {
  term: 'Harry',
  properties: '*',
  boost: {
    title: 2,
  },
})
```

In this example, we are boosting the `title` field by `2` and the `director` field by `1.5`.

That means that any match of `'Harry'` in the `title` field will be considered twice as important as a match in any other field field.

Read more about fields boosting in the [official fields boosting docs](https://docs.oramasearch.com/usage/search/fields-boosting)

</details>

## Language

<details>
  <summary>
    Orama supports stemming and tokenization in 26 languages
  </summary>
Orama supports multiple languages. By default, it will use the `english`
language.

You can specify a different language by using the `language` property
during Orama initialization.

By default, Orama will analyze your input using an English
[Porter Stemmer](https://tartarus.org/martin/PorterStemmer/) function. <br />
You can replace the default stemmer with a custom one, or a pre-built one
shipped with the default Orama installation.

Example:

```js
import { create } from '@orama/orama'
import { stemmer } from '@orama/orama/stemmers/it'

const db = await create({
  schema: {
    author: 'string',
    quote: 'string',
  },
  language: 'italian',
  components: {
    tokenizer: {
      stemmingFn: stemmer,
    },
  },
})
```

Example using CJS (see [using with commonJS](#using-with-commonjs) above):

```js
async function main() {
  const { create } = await import('@orama/orama')
  const { stemmer } = await import('@orama/orama/stemmers/it')

  const db = await create({
    schema: {
      author: 'string',
      quote: 'string',
    },
    language: 'italian',
    components: {
      tokenizer: {
        stemmingFn: stemmer,
      },
    },
  })
}

main()
```

Right now, Orama supports 26 languages and stemmers out of the box:

- Arabic
- Armenian
- Bulgarian
- Danish
- Dutch
- English
- Finnish
- French
- German
- Greek
- Hindi
- Hungarian
- Indonesian
- Irish
- Italian
- Nepali
- Norwegian
- Portuguese
- Romanian
- Russian
- Serbian
- Slovenian
- Spanish
- Swedish
- Turkish
- Ukrainian
</details>

# Official Docs

Read the complete documentation at [https://docs.oramasearch.com/](https://docs.oramasearch.com/).

# License

Orama is licensed under the [Apache 2.0](/LICENSE.md) license.
