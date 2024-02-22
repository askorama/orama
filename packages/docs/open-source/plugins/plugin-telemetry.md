---
outline: deep
---

# Plugin Telemetry

This plugin relies on [Orama Cloud](https://cloud.oramasearch.com) (free plan) and it's not available yet. Join our [slack channel](https://orama.to/slack) to get notified when it's ready.


## Installation

First of all, install it via npm (or any other package manager of your choice):

```sh
npm i @orama/plugin-telemetry
```

Then, add it to your Orama configuration:

```js
import { Orama } from '@orama/core';
import { pluginTelemetry } from '@orama/plugin-telemetry';

const db = await create({
  schema: { name: 'string' } as const,
  plugins: [
    pluginTelemetry({
      apiKey: 'your-api-key',
      indexId: 'your-index-id',
    })
  ]
})

await insertMultiple(db, [
  { name: 'foo' },
  { name: 'bar' },
  { name: 'baz' },
])

// Collects telemetry data and sends it to Orama Cloud
await search(db, { term: 'foo' })
```
