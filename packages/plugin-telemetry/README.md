# Nextra Plugin

[![Tests](https://github.com/oramasearch/orama/actions/workflows/turbo.yml/badge.svg)](https://github.com/oramasearch/orama/actions/workflows/turbo.yml)

Official plugin to provide telemetry data on your searches.

# Usage

For the complete usage guide, please refer to the [official plugin documentation](https://docs.oramasearch.com/open-source/plugins/plugin-telemetry).

To use the Orama Telemetry Plugin, you will need to sign up for a free account at [https://cloud.oramasearch.com](https://cloud.oramasearch.com)

```js
import { create, insert, search } from '@orama/orama'
import { pluginTelemetry } from '@orama/plugin-telemetry'

const db = await create({
  schema: {
    title: 'string',
    description: 'string'
  },
  plugins: [
    pluginTelemetry({ apiKey: '<API-KEY>' })
  ]
})
```

For the full configuration guide of this plugin, please follow the [official plugin documentation](https://docs.oramasearch.com/open-source/plugins/plugin-telemetry).

# License

[Apache-2.0](/LICENSE.md)
