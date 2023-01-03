![Lyra, the edge search experience](https://raw.githubusercontent.com/LyraSearch/lyra/main/misc/lyra-edge-logo.png)

[![Tests](https://github.com/nearform/lyra/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/nearform/lyra/actions/workflows/tests.yml)

# Join Lyra's Slack channel

If you need more info, help, or want to provide general feedback on Lyra, join
the
[Lyra Slack channel](https://join.slack.com/t/lyrasearch/shared_invite/zt-1gzvj0mmt-yJhJ6pnrSGuwqPmPx9uO5Q)

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
      import { create, search, insert } from "https://unpkg.com/@lyrasearch/lyra@latest/dist/index.js";

      // ...
    </script>
  </body>
</html>
```

See [builds](#builds) for details about the various builds packaged with Lyra.

Read the complete documentation at
[https://docs.lyrasearch.io/](https://docs.lyrasearch.io/).

# Usage

Lyra is quite simple to use. The first thing to do is to create a new database
instance and set an indexing schema:

```js
import { create, insert, remove, search } from "@lyrasearch/lyra";

const db = await create({
  schema: {
    author: "string",
    quote: "string",
  },
});
```

If you are using Node.js without ESM, please see [build](#builds) section below on how to properly require Lyra.

Lyra will only index string properties, but will allow you to set and store
additional data if needed.

Once the db instance is created, you can start adding some documents:

```js
await insert(db, {
  quote: "It is during our darkest moments that we must focus to see the light.",
  author: "Aristotle",
});

await insert(db, {
  quote: "If you really look closely, most overnight successes took a long time.",
  author: "Steve Jobs",
});

await insert(db, {
  quote: "If you are not willing to risk the usual, you will have to settle for the ordinary.",
  author: "Jim Rohn",
});

await insert(db, {
  quote: "You miss 100% of the shots you don't take",
  author: "Wayne Gretzky - Michael Scott",
});
```

If you have a large number of documents, we highly recommend using the
`insertBatch` function, which prevents the event loop from blocking. This
operation is asynchronous and returns a promise:

```js
await insertBatch(db, [
  {
    quote: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
  },
  {
    quote: "If you really look closely, most overnight successes took a long time.",
    author: "Steve Jobs",
  },
  {
    quote: "If you are not willing to risk the usual, you will have to settle for the ordinary.",
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
const searchResult = await search(db, {
  term: "if",
  properties: "*",
});
```

In the case above, you will be searching for all the documents containing the
word `if`, looking up in every schema property (AKA index):

```js
{
  elapsed: 184541n, // Elapsed time in nanoseconds
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
  term: "Michael",
  properties: ["author"],
});
```

Result:

```js
{
  elapsed: 172166n,
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
await remove(db, "41045799-144");
```

Lyra exposes a built-in `formatNanoseconds` function to format the elapsed time
in a human-readable format:

```js
import { formatNanoseconds } from "@lyrasearch/lyra";

const searchResult = await search(db, {
  term: "if",
  properties: "*",
});

console.log(`Search took ${formatNanoseconds(searchResult.elapsed)}`);
// Search took 164μs
```

### Using with CommonJS

From version 0.4.0, Lyra is packaged as ES modules, suitable for Node.js, Deno, Bun and modern browsers.

**In most cases, simply `import` or `@lyrasearch/lyra` will suffice ✨.**

In Node.js, when not using ESM (with `"type": "module"` in the `package.json`), you have several ways to properly require Lyra.

#### Use dynamic import (recommended)

As all Lyra methods return a promise anyway, you can simply wrap all your code in an async function and then replace all `require`s with `await import`.

If your Lyra 0.3.0 code was

```js
const { create, insert } = require("@lyrasearch/lyra");

const db = create(/* ... */);
insert(db, {
  /* ... */
});
```

then starting with version 0.4.0 it becomes:

```js
async function main() {
  const { create, insert } = await import("@lyrasearch/lyra");

  const db = create(/* ... */);
  insert(db, {
    /* ... */
  });
}

main().catch(console.error);
```

#### Use CJS requires

As of version 0.4.0, Lyra methods can be required as CommonJS modules by requiring from `@lyrasearch/lyra/cjs`.

If your Lyra 0.3.0 code was

```js
const { create, insert } = require("@lyrasearch/lyra");

const db = create(/* ... */);
insert(db, {
  /* ... */
});
```

then starting with version 0.4.0 it becomes:

```js
const { create, insert } = require("@lyrasearch/lyra/cjs")

create(/* ... */)
  .then(db => insert(db, { /* ... */ })
  .catch(console.error)
```

Note that only main methods are supported so for internals, stemmer and other supported exports you still have to use `await import`.

#### Use requireLyra with callbacks

As of version 0.4.0, a new function called `requireLyra` can be used to require Lyra without using promises.

If your Lyra 0.3.0 code was

```js
const { create, insert } = require("@lyrasearch/lyra");

const db = create(/* ... */);
insert(db, {
  /* ... */
});
```

then starting with version 0.4.0 it becomes:

```js
const { requireLyra } = require("@lyrasearch/lyra/cjs")

requireLyra((err, lyra) => {
  if(err) {
    throw new Error(err)
  }

  const {create, insert} = lyra
  create(/* ... */)
    .then(db => insert(db, { /* ... */ })
    .catch(console.error)
})
```

## Language

Lyra supports multiple languages. By default, it will use the `english`
language,

You can specify a different language by using the `defaultLanguage` property
during Lyra initialization.

By default, Lyra will analyze your input using an English
[Porter Stemmer](https://tartarus.org/martin/PorterStemmer/) function. <br />
You can replace the default stemmer with a custom one, or a pre-built one
shipped with the default Lyra installation.

Example:

```js
import { create } from "@lyrasearch/lyra";
import { stemmer } from "@lyrasearch/lyra/stemmer/it";

const db = await create({
  schema: {
    author: "string",
    quote: "string",
  },
  defaultLanguage: "italian",
  components: {
    tokenizer: {
      stemmingFn: stemmer,
    },
  },
});
```

Example using CJS (see [using with commonJS](#using-with-commonjs) above):

```js
async function main() {
  const { create } = await import("@lyrasearch/lyra");
  const { stemmer } = await import("@lyrasearch/lyra/stemmer/it");

  const db = await create({
    schema: {
      author: "string",
      quote: "string",
    },
    defaultLanguage: "italian",
    components: {
      tokenizer: {
        stemmingFn: stemmer,
      },
    },
  });
}

main();
```

Right now, Lyra supports 23 languages and stemmers out of the box:

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

## Hooks

When dealing with asynchronous operations, hooks are an excellent mechanism to
intercept and perform operations during the workflow. Lyra supports hooks
natively. The `create` function allows you to specify a sequence of hooks.

```js
import { create } from "@lyrasearch/lyra";

const db = await create({
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

async function hook1(id: string): Promise<void> {
  // called before hook2
}

function hook2(id: string): void {
  // ...
}

const db = await create({
  schema: {
    author: "string",
    quote: "string",
  },
  hooks: {
    afterInsert: [hook1, hook2],
  },
});

await insertWithHooks(db, { author: "test", quote: "test" });
```

# License

Lyra is licensed under the [Apache 2.0](/LICENSE.md) license.
