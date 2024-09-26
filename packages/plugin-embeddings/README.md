# Orama Plugin Embeddings

**Orama Plugin Embeddings** allows you to generate fast text embeddings at insert and search time offline, directly on your machine - no OpenAI needed!

## Installation

To get started with **Orama Plugin Embeddings**, just install it with npm:

```sh
npm i @orama/plugin-embeddings
```

**Important note**: to use this plugin, you'll also need to install one of the following TensorflowJS backend:

- `@tensorflow/tfjs`
- `@tensorflow/tfjs-node`
- `@tensorflow/tfjs-backend-webgl`
- `@tensorflow/tfjs-backend-cpu`
- `@tensorflow/tfjs-backend-wasm`

For example, if you're running Orama on the browser, we highly recommend using `@tensorflow/tfjs-backend-webgl`:

```sh
npm i @tensorflow/tfjs-backend-webgl
```

If you're using Orama in Node.js, we recommend using `@tensorflow/tfjs-node`:

```sh
npm i @tensorflow/tfjs-node
```

## Usage

```js
import { create } from '@orama/orama'
import { pluginEmbeddings } from '@orama/plugin-embeddings'
import '@tensorflow/tfjs-node' // Or any other appropriate TensorflowJS backend

const plugin = await pluginEmbeddings({
  embeddings: {
    defaultProperty: 'embeddings', // Property used to store generated embeddings
    onInsert: {
      generate: true, // Generate embeddings at insert-time
      properties: ['description'], // properties to use for generating embeddings at insert time
      verbose: true,
    }
  }
})

const db = await create({
  schema: {
    description: 'string',
    embeddings: 'vector[512]' // Orama generates 512-dimensions vectors
  },
  plugins: [plugin]
})
```

Example usage at insert time:

```js
await insert(db, {
  description: 'Classroom Headphones Bulk 5 Pack, Student On Ear Color Varieties'
})

await insert(db, {
  description: 'Kids Wired Headphones for School Students K-12'
})

await insert(db, {
  description: 'Kids Headphones Bulk 5-Pack for K-12 School'
})

await insert(db, {
  description: 'Bose QuietComfort Bluetooth Headphones'
})
```

Orama will automatically generate text embeddings and store them into the `embeddings` property.

Then, you can use the `vector` or `hybrid` setting to perform hybrid or vector search at runtime:

```js
await search(db, {
  term: 'Headphones for 12th grade students',
  mode: 'vector'
})
```

Orama will generate embeddings at search time and perform vector or hybrid search for you.

# License

[Apache 2.0](/LICENSE.md)