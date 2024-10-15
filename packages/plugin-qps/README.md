# Orama Plugin Quantum Proximity Scoring

**Orama Plugin Quantum Proximity Scoring** ranks search results based on the proximity of query tokens in the document.

## Installation

To get started with **Orama Plugin QPS**, just install it with npm:

```sh
npm i @orama/plugin-qps
```

## Usage

```js
import { create } from '@orama/orama'
import { pluginQPS } from '@orama/plugin-qps'

const db = await create({
  schema: {
    description: 'string',
  },
  plugins: [ pluginQPS() ],
})
```

# License

[Apache 2.0](/LICENSE.md)