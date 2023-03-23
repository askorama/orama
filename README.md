![Orama. Search, everywhere.](https://github.com/oramasearch/orama/blob/main/misc/oramasearch.gif?raw=true)

[![Tests](https://github.com/oramasearch/orama/actions/workflows/turbo.yml/badge.svg)](https://github.com/oramasearch/orama/actions/workflows/turbo.yml)

# Join Orama's Slack channel

If you need more info, help, or want to provide general feedback on Orama, join
the
[Orama Slack channel](https://join.slack.com/t/oramasearch/shared_invite/zt-1gzvj0mmt-yJhJ6pnrSGuwqPmPx9uO5Q)

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

Read the complete documentation at [https://docs.oramasearch.com/](https://docs.oramasearch.com/).

# Usage

Orama is quite simple to use. The first thing to do is to create a new database
instance and set an indexing schema:

```js
import { create, insert, remove, search } from '@orama/orama'

const db = await create({
  schema: {
    author: 'string',
    quote: 'string',
  },
})
```

If you are using Node.js without ESM, please see [build](#builds) section below on how to properly require Orama.

Orama will only index string properties, but will allow you to set and store
additional data if needed.

Once the db instance is created, you can start adding some documents:

```js
await insert(db, {
  quote: 'It is during our darkest moments that we must focus to see the light.',
  author: 'Aristotle',
})

await insert(db, {
  quote: 'If you really look closely, most overnight successes took a long time.',
  author: 'Steve Jobs',
})

await insert(db, {
  quote: 'If you are not willing to risk the usual, you will have to settle for the ordinary.',
  author: 'Jim Rohn',
})

await insert(db, {
  quote: "You miss 100% of the shots you don't take",
  author: 'Wayne Gretzky - Michael Scott',
})
```

After the data has been inserted, you can finally start to query the database.

```js
const searchResult = await search(db, {
  term: 'if',
  properties: '*',
  boost: {
    author: 1.5, // optional: boost author field by x1.5
  },
})
```

In the case above, you will be searching for all the documents containing the
word `if`, looking up in every schema property (AKA index):

```js
{
  elapsed: {
    raw: 184541,
    formatted: '184μs',
  },
  hits: [
    {
      id: '41013877-56',
      score: 0.025085832971998432,
      document: {
        quote: 'If you really look closely, most overnight successes took a long time.',
        author: 'Steve Jobs'
      }
    },
    {
      id: '41013877-107',
      score: 0.02315615351261394,
      document: {
        quote: 'If you are not willing to risk the usual, you will have to settle for the ordinary.',
        author: 'Jim Rohn'
      }
    }
  ],
  count: 2
}
```

You can also restrict the lookup to a specific property:

```js
const searchResult = await search(db, {
  term: 'Michael',
  properties: ['author'],
})
```

Result:

```js
{
  elapsed: {
    raw: 172166,
    formatted: '172μs',
  },
  hits: [
    {
      id: '41045799-144',
      score: 0.12041199826559248,
      document: {
        quote: "You miss 100% of the shots you don't take",
        author: 'Wayne Gretzky - Michael Scott'
      }
    }
  ],
  count: 1
}
```

If needed, you can also delete a given document by using the `remove` method:

```js
await remove(db, '41045799-144')
```

### Using with CommonJS

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

#### Use CJS requires

Orama methods can be required as CommonJS modules by requiring from `@orama/orama`.

```js
const { create, insert } = require("@orama/orama")

create(/* ... */)
  .then(db => insert(db, { /* ... */ })
  .catch(console.error)
```

Note that only main methods are supported so for internals and other supported exports you still have to use `await import`.

## Language

Orama supports multiple languages. By default, it will use the `english`
language,

You can specify a different language by using the `defaultLanguage` property
during Orama initialization.

By default, Orama will analyze your input using an English
[Porter Stemmer](https://tartarus.org/martin/PorterStemmer/) function. <br />
You can replace the default stemmer with a custom one, or a pre-built one
shipped with the default Orama installation.

Example:

```js
import { create } from '@orama/orama'
import { stemmer } from '@orama/orama/components/stemmer/it'

const db = await create({
  schema: {
    author: 'string',
    quote: 'string',
  },
  defaultLanguage: 'italian',
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
  const { stemmer } = await import('@orama/orama/components/stemmer/it')

  const db = await create({
    schema: {
      author: 'string',
      quote: 'string',
    },
    defaultLanguage: 'italian',
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

# Official Docs

Read the complete documentation at [https://docs.oramasearch.com/](https://docs.oramasearch.com/).

# License

Orama is licensed under the [Apache 2.0](/LICENSE.md) license.
