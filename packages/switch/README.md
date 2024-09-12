# Orama Switch

Orama Switch allows you to run queries on Orama Cloud and OSS with a single interface.

## Installation

```sh
npm i @orama/switch
```

## Usage

You can use the same APIs to access either Orama Cloud or Orama OSS.

For instance, this is how you would interact with Orama Cloud:

```js
import { Switch } from '@orama/switch'
import { OramaClient } from '@oramacloud/client'

const client = new OramaClient({
  endpoint: '<Your Orama Cloud Endpoint>',
  api_key: '<Your Orama Cloud API Key>',
})

const orama = new Switch(client)

const results = await orama.search({
  term: 'noise cancelling headphones',
  where: {
    price: {
      lte: 99.99
    }
  }
})
```

And this is Orama OSS:

```js
import { Switch } from '@orama/switch'
import { create } from '@orama/orama'

const db = await create({
  schema: {
    productName: 'string',
    price: 'number'
  }
})

const orama = new Switch(client)

const results = await orama.search({
  term: 'noise cancelling headphones',
  where: {
    price: {
      lte: 99.99
    }
  }
})
```

## License

[Apache 2.0](/LICENSE.md)