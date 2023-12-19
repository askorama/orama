---
outline: deep
---

# Parsedoc plugin

The plugin-parsedoc plugin allows Orama to parse and create indexes from HTML and Markdown documents automatically.

## Installation

You can install the plugin using any major Node.js package manager:

```bash copy 
npm install @orama/plugin-parsedoc 
```

## Usage

Plugin usage depends on the runtime that you are using, even though the goal is to expose the exact same APIs for browsers, Deno, and all the other JavaScript engines.

The plugin exports `defaultHtmlSchema` which will be the schema used in the index. Providing a glob pattern to the files containing the documents will index them.

```javascript copy
import { create, insert } from '@orama/orama'
import { populateFromGlob, defaultHtmlSchema } from '@orama/plugin-parsedoc'

const db = await create({
  schema: defaultHtmlSchema,
})

await populateFromGlob(db, 'docs/**/*.html')
```

## API Reference

#### `populateFromGlob`

An asynchronous function that takes three arguments:

- `db`: the database to populate.
- `globPath`: a string representing a glob path to reading the files from.
- `options`: an object containing the following properties:
  - `transformFn` (optional): a function that passes an object as its only argument. It contains the raw HTML/Markdown chunk, tag name, parsed content and html attributes.
    If the function adds a `additionalProperties` object to the trasformed node, it will be merged with the original node's properties.
  - `mergeStrategy` (optional): a value that defines how to handle consecutive chunks of the same tag. The default value is `merge`. Accepted values are:
    - `merge`: consecutive chunks with the same tag will be merged into one document for the index.
    - `split`: consecutive chunks with the same tag will be split into separate documents for the index.
    - `both`: consecutive chunks with the same tag will be split into separate documents for the index, and also merged into one document for the index.

#### `populate`

An asynchronous function that takes three arguments. Should be used internally by `populateFromGlob`:

- `db`: the database to populate. Should use Orama's native `insert` or `insertBatch` methods internally.
- `data`: raw HTML/Markdown string or Buffer.
- `fileType`: a string representing the file type. Accepted values are `html` and `md`.
- `options`: an object containing the following properties:
  - `transformFn` (optional): a function that passes an object as its only argument. It contains the raw HTML/Markdown chunk, tag name, parsed content and html attributes.
    If the function adds a `additionalProperties` object to the trasformed node, it will be merged with the original node's properties.
  - `mergeStrategy` (optional): a value that defines how to handle consecutive chunks of the same tag. The default value is `merge`. Accepted values are:
    - `merge`: consecutive chunks with the same tag will be merged into one document for the index.
    - `split`: consecutive chunks with the same tag will be split into separate documents for the index.
    - `both`: consecutive chunks with the same tag will be split into separate documents for the index, and also merged into one document for the index.
  - `basePath` (optional): a string representing the base path of the file. This is used to generate the `id` field in the index

# CommonJS Imports

Orama plugins ship **ESM** modules by default. This allows us to move faster when providing new features and bug fixes, as well as using the `"exports"` field in `package.json` to provide a better developer experience.

CommonJS imports are still supported, but we suggest you to migrate to ESM.

## TypeScript

Set `moduleResolution` in the `compilerOptions` in your `tsconfig.json` to be either `Node16` or `NodeNext`.

When importing types, always refer to the standard import:

```ts copy
import type { populateFromGlob } from '@orama/plugin-data-parsedoc'
```