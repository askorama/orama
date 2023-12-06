---
outline: deep
---

# Getting Started with Orama

Orama is a fast, batteries-included, full-text and vector search engine entirely written in TypeScript, with zero dependencies. <br /><br />

<iframe
  width="100%"
  height="420"
  src="https://www.youtube.com/embed/szcaz6JMYQ4"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen>
</iframe>
<br />

Get started with just a few lines of code:

```js
import { create, insert, search } from '@orama/orama'

const db = await create({
  schema: {
    title: 'string',
    director: 'string',
    isFavorite: 'boolean',
    year: 'number'
  }
})

await insert(db, {
  title: 'The Prestige',
  director: 'Christopher Nolan',
  isFavorite: true,
  year: 2006
})

const searchResults = await search(db, {
  term: 'prestige',
  where: {
    isFavorite: true,
    year: {
      between: [2000, 2008]
    }
  }
})
```

## Requirements

A JavaScript runtime is the **only** requirement. Orama has been designed to work on any runtime and has no dependencies.

## Installation

You can install Orama using npm, yarn, pnpm:

```sh
npm i @orama/orama
```

Or import it directly in a browser module:

```html copy
<html>
  <body>
    <script type="module">
      import { create, search, insert } from 'https://unpkg.com/@orama/orama@latest/dist/index.js'

      // ...
    </script>
  </body>
</html>
```

## Basic usage

```ts copy
import { create, search, insert } from '@orama/orama'

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

await insert(db, {
  name: 'Wireless Headphones',
  description: 'Experience immersive sound quality with these noise-cancelling wireless headphones.',
  price: 99.99,
  meta: {
    rating: 4.5,
  },
})

const searchResult = await search(db, {
  term: 'headphones',
})

console.log(searchResult.hits.map((hit) => hit.document))
```

For more information, check out the [Usage](/open-source/usage/create) section.

# CommonJS Imports

Orama ships **ESM** modules by default. This allows us to move faster when providing new features and bug fixes, as well as using the `"exports"` field in `package.json` to provide a better developer experience.

CommonJS imports are still supported, but we suggest you to migrate to ESM.

## TypeScript

Set `moduleResolution` in the `compilerOptions` in your `tsconfig.json` to be either `Node16` or `NodeNext`.

When importing types, always refer to the standard orama import:

```ts copy
import type { Language } from '@orama/orama'
```

# Community Rewards

![Orama Community Rewards](/misc/community-rewards.webp)

Are you using Orama in production? Have you written an article or made a YouTube video on Orama? [Contact us](mailto:info@oramasearch.com) to get some Orama swag in return!