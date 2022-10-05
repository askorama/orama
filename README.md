![Lyra, the edge search experience](https://raw.githubusercontent.com/LyraSearch/lyra/main/misc/lyra-edge-logo.png)

[![Tests](https://github.com/nearform/lyra/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/nearform/lyra/actions/workflows/tests.yml)

Try the [live demo](https://docs.lyrajs.io/demo)

# Installation

You can install Lyra using `npm`, `yarn`, `pnpm`:

```sh
npm i @lyrasearch/lyra
```

```sh
yarn add @lyrasearch/lyra
```

```sh
pnpm add @lyrasearch/lyra
```

Or import it directly in a browser module:
```html
<html>
  <body>
    <script type="module">
      import { create, search, insert } from "https://unpkg.com/@lyrasearch/lyra@latest/dist/esm/src/lyra.js";

      // ...
    </script>
  </body>
</html>
```

See [builds](#builds) for details about the various builds packaged with Lyra.

# Usage

Lyra is quite simple to use. The first thing to do is to create a new database
instance and set an indexing schema:

```js
import { create, insert, remove, search } from "@lyrasearch/lyra";

const db = create({
  schema: {
    author: "string",
    quote: "string",
  },
});
```

Lyra will only index string properties, but will allow you to set and store
additional data if needed.

Once the db instance is created, you can start adding some documents:

```js
insert(db, {
  quote:
    "It is during our darkest moments that we must focus to see the light.",
  author: "Aristotle",
});

insert(db, {
  quote:
    "If you really look closely, most overnight successes took a long time.",
  author: "Steve Jobs",
});

insert(db, {
  quote:
    "If you are not willing to risk the usual, you will have to settle for the ordinary.",
  author: "Jim Rohn",
});

insert(db, {
  quote: "You miss 100% of the shots you don't take",
  author: "Wayne Gretzky - Michael Scott",
});
```

Please note that the `insert` function is synchronous. If you have a large
number of documents, we highly recommend using the `insertBatch` function
instead, which prevents the event loop from blocking. This operation is
asynchronous and returns a promise:

```js
await insertBatch(db, [
  {
    quote:
      "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    quote:
      "If you really look closely, most overnight successes took a long time.",
    author: "Steve Jobs",
  },
  {
    quote:
      "If you are not willing to risk the usual, you will have to settle for the ordinary.",
    author: "Jim Rohn",
  },
  {
    quote: "You miss 100% of the shots you don't take",
    author: "Wayne Gretzky - Michael Scott",
  },
]);
```

After the data has been inserted, you can finally start to query the database.

```js
const searchResult = search(db, {
  term: "if",
  properties: "*",
});
```

In the case above, you will be searching for all the documents containing the
word `if`, looking up in every schema property (AKA index):

```js
{
  elapsed: 99, // elapsed time is in microseconds
  hits: [
    {
      id: 'ckAOPGTA5qLXx0MgNr1Zy',
      quote: 'If you really look closely, most overnight successes took a long time.',
      author: 'Steve Jobs'
    },
    {
      id: 'fyl-_1veP78IO-wszP86Z',
      quote: 'If you are not willing to risk the usual, you will have to settle for the ordinary.',
      author: 'Jim Rohn'
    }
  ],
  count: 2
}
```

You can also restrict the lookup to a specific property:

```js
const searchResult = search(db, {
  term: "Michael",
  properties: ["author"],
});
```

Result:

```js
{
  elapsed: 111,
  hits: [
    {
      id: 'L1tpqQxc0c2djrSN2a6TJ',
      quote: "You miss 100% of the shots you don't take",
      author: 'Wayne Gretzky - Michael Scott'
    }
  ],
  count: 1
}
```

If needed, you can also delete a given document by using the `remove` method:

```js
remove(db, "L1tpqQxc0c2djrSN2a6TJ");
```

## Language

Lyra supports multiple languages. By default, it will use the `english`
language,

You can specify a different language by using the `defaultLanguage` property
during Lyra initialization.

By default, Lyra will analyze your input using an English
[Porter Stemmer](https://tartarus.org/martin/PorterStemmer/) function. <br />
You can replace the default stemmer with the a custom one, or a pre-built one
shipped with the default Lyra installation.

Example using ESM (see [builds](#builds) below):

```js
import { create } from "@lyrasearch/lyra";
import { stemmer } from "@lyrasearch/lyra/dist/esm/stemmer/lib/it";

const db = create({
  schema: {
    author: "string",
    quote: "string",
  },
  defaultLanguage: "italian",
  tokenizer: {
    stemmingFn: stemmer,
  },
});
```

Example using CJS (see [builds](#builds) below):

```js
const { create } = require("@lyrasearch/lyra");
const { stemmer } = require("@lyrasearch/lyra/dist/cjs/stemmer/lib/it");

const db = create({
  schema: {
    author: "string",
    quote: "string",
  },
  defaultLanguage: "italian",
  tokenizer: {
    stemmingFn: stemmer,
  },
});
```

Right now, Lyra supports 22 languages and stemmers out of the box:

- Armenian
- Arabic
- Danish
- Spanish
- English
- Finnish
- French
- German
- Greek
- Hindi
- Hungarian
- Indonesian
- Italian
- Irish
- Dutch
- Nepali
- Norwegian
- Portuguese
- Romanian
- Russian
- Serbian
- Swedish
- Turkish

## Builds

Lyra is packaged with ES modules, CommonJS, and generic browser builds.

**In most cases, simply `import` or `require` `@lyrasearch/lyra` and your environment will choose the most appropriate build ✨.**
In some circumstances, you may need to `import` or `require` certain files (such as stemmers).
The following builds are included in the Lyra package:

| path | build |
|--|--|
| `dist/esm` | ESNext build using ES modules. _Use this for most modern applications (node.js, vite.js, browser modules, etc.)_ |
| `dist/cjs` | ESNext build using CommonJS (`require`). Use this for environments that don't support ES modules. |
| `dist/browser` | ES2019 build using CommonJS (`require`). Use this for environment that don't support modern ESNext language constructs, such as webpack 4 (used by Expo). Note, this build will be chosen by default in webpack environments such as Next.js. |

## Hooks

When dealing with asynchronous operations, hooks are an excelent mechanism to
intercept and perform operations during the workflow. Lyra supports hooks
natively. The `create` function allows you to specific a sequence of hooks.

```js
import { create } from "@lyrasearch/lyra";

const db = create({
  schema: {},
  hooks: {
    // HERE
  },
});
```

**Important**: The hooks run in the same context as the main function execution.
It means, that if your hook takes X milliseconds to resolve, the Lyra function
will take X + Y (where Y = Lyra operation).

### afterInsert hook

The `afterInsert` hook is called after the insertion of a document into the
database. The `hook` will be called with the `id` of the inserted document.

Example:

```js
import { create, insertWithHooks } from "@lyrasearch/lyra";

async function hook1 (id: string): Promise<void> {
  // called before hook2
}

function hook2 (id: string): void {
  // ...
}

const db = create({
  schema: {
    author: "string",
    quote: "string",
  },
  hooks: {
    afterInsert: [hook1, hook2],
  },
});

await insertWithHooks(db, { author: "test", quote: "test" })
```

# License

Lyra is licensed under the [Apache 2.0](/LICENSE.md) license.
