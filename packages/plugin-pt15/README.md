# Orama Plugin PT15

Fast ranking algorithm based on token position.

## Installation

To get started with **Orama Plugin PT15**, just install it with npm:

```sh
npm i @orama/plugin-pt15
```

## Usage

```js
import { create } from '@orama/orama'
import { pluginPT15 } from '@orama/plugin-pt15'

const db = await create({
  schema: {
    description: 'string',
  },
  plugins: [ pluginPT15() ],
})
```

# License

[Apache 2.0](/LICENSE.md)