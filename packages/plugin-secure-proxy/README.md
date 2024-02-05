# Orama Secure Proxy Plugin

[![Tests](https://github.com/oramasearch/orama/actions/workflows/turbo.yml/badge.svg)](https://github.com/oramasearch/orama/actions/workflows/turbo.yml)

Orama plugin for generating embeddings and performing vector/hybrid search securely on the front-end.

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
    embeddings: 'vector[384]'
  },
  plugins: [
    pluginSecureProxy({
      apiKey: '<API-KEY>',
      defaultProperty: 'embeddings',
      model: 'orama/gte-small'
    })
  ]
})
```

Available models:

| Model name                       | Provider | Dimensions |
| -------------------------------- | -------- | ---------- |
| `orama/gte-small`                | Orama    | 384        |
| `orama/gte-medium`               | Orama    | 768        |
| `orama/gte-large`                | Orama    | 1024       |
| `openai/text-embedding-ada-002`  | Openai   | 1536       |
| `openai/text-embedding-3-small`  | Openai   | 1536       |
| `openai/text-embedding-3-large`  | Openai   | 3072       |

Mode models coming soon!

For the full configuration guide of this plugin, please follow the [official plugin documentation](https://docs.oramasearch.com/open-source/plugins/plugin-secure-proxy).

# License

[Apache-2.0](/LICENSE.md)
