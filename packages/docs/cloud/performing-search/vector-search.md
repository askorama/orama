---
outline: deep
---

# Performing vector search on Orama Cloud

After deploying your index, Orama will distribute it to over 300 global points of presence across more than 100 countries worldwide. This will guarantee the lowest possible latency for any search query, at any scale.

At the time of this writing, you can execute search queries using our official JavaScript SDK.

This SDK manages connection, cache, telemetry, and type-safety for all your search operations. It is the official method for communicating with Orama Cloud.

::: tip Installing the Orama SDK
You can find the guide on installing the SDK [here](/cloud/integrating-orama-cloud/javascript-sdk).
:::

Make sure you have the Orama SDK installed to start performing vector search at the edge!

## Performing vector search

::: info
The following guide assumes that you have an **Open AI API key** set on Orama Cloud, as it is needed to perform transform text into embeddings at search time.
:::

To perform a vector search with Orama Cloud, you need to populate an Orama index with vectors. Currently, this can be achieved through [automatic embeddings generation](/cloud/orama-ai/automatic-embeddings-generation) during the deployment process.

Once you have at least one index containing vectors, you can perform vector search by using the `searchVector` function:

```ts
import { OramaClient } from '@oramacloud/client'

const client = new OramaClient({
  endpoint: '',
  api_key: ''
})

const vectorSearchResults = await client.searchVector({
  term: 'Super Mario videogame',
  threshold: 0.8, // Minimum similarity, between 0 and 1. Default is 0.8 (80% similar).
  limit: 5        // How many results to return. Default is 10.
})
```

Orama will automatically convert your search term, for instance, `"Super Mario videogame"`, into an embedding using your OpenAI API Key. It will then search through your vectors and ultimately return the full documents in their original format.