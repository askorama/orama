# Orama Secure Proxy Plugin

[![Tests](https://github.com/oramasearch/orama/actions/workflows/turbo.yml/badge.svg)](https://github.com/oramasearch/orama/actions/workflows/turbo.yml)

Orama plugin for generating embeddings securely on the front-end.

# Usage

For the complete usage guide, please refer to the [official plugin documentation](https://docs.oramasearch.com/open-source/plugins/plugin-secure-proxy).

To use the Orama Secure Proxy Plugin, you will need to sign up for a free account at [https://cloud.oramasearch.com](https://cloud.oramasearch.com)

```js
import { create, insert, search } from '@orama/orama'
import { pluginSecureProxy} from '@orama/plugin-secure-proxy'

const db = await create({
  schema: {
    title: 'string',
    description: 'string',
    embeddings: 'vector[1536]'
  },
  plugins: [
    pluginSecureProxy({
      apiKey: '<API-KEY>',
      property: 'embeddings'
    })
  ]
})
```

For the full configuration guide of this plugin, please follow the [official plugin documentation](https://docs.oramasearch.com/open-source/plugins/plugin-secure-proxy).

# License

[Apache-2.0](/LICENSE.md)
