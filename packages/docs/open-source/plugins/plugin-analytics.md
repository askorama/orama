---
outline: deep
---

# Plugin Analytics

This plugin relies on [Orama Cloud](https://cloud.oramasearch.com) (free plan) and it's not available yet. Join our [slack channel](https://orama.to/slack) to get notified when it's ready.


## Installation

First of all, install it via npm (or any other package manager of your choice):

```sh
npm i @orama/plugin-analytics
```

Then, add it to your Orama configuration:

```js
import { Orama } from '@orama/core';
import { pluginAnalytics } from '@orama/plugin-analytics';

const db = await create({
  schema: { name: 'string' } as const,
  plugins: [
    pluginAnalytics({
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

// Collects anonymous analytics data and sends it to Orama Cloud
await search(db, { term: 'foo' })
```

## Disabling Analytics

By default, Orama is shipped without analytics plugin. If you want to enable it, you need to explicitly add it to your configuration as described above.

Anyway, you can disable it by passing `enabled: false` to the `pluginAnalytics` function in your configuration, like this:

```js
import { Orama } from '@orama/core';
import { pluginAnalytics } from '@orama/plugin-analytics';

const db = await create({
  schema: { name: 'string' } as const,
  plugins: [
    pluginAnalytics({
      apiKey: 'your-api-key',
      indexId: 'your-index-id',
      enabled: false, // <--- disable analytics
    })
  ]
})
```

This flag is useful when you want to disable analytics in development environment, for example.
