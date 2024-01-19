---
outline: deep
---

# Orama Cloud Indexes

An Orama index is essentially a collection of Orama documents that share the following properties:

- **Schema** \
All documents in a given index must follow the same schema.
- **Embeddings configuration** \
If you want to perform either vector or hybrid search on your index, you'll have to generate embeddings. 

Depending on your subscription, you may have more or less limitations when it comes to indexes.

| Subscription | Max. Indexes         | Max. Documents   | Max. Size |
| ------------ | -------------------- | ---------------- | --------- |
| Free         | Unlimited            | 10,000           | 10 MB     |
| Pro          | Unlimited            | 100,000          | 100MB     |
| Enterprise   | Unlimited            | Unlimited        | Unlimited |

Regardless of your subscription, you can create as many indexes as you want.

## Index Types

Orama Cloud integrates natively with different data sources.

Every native integration between Orama Cloud and an external data source will lead to a highly optimized index,
where the main purpose is to provide a fast and reliable search experience, with minimal configuration.

### Native Integrations

Orama Cloud integrates natively with many different data sources, including:

- [Shopify](/cloud/data-sources/native-integrations/shopify)
- [ElasticPath](/cloud/data-sources/native-integrations/elasticpath)
- [Docusaurus](/cloud/data-sources/native-integrations/docusaurus)

And many more to come.

### Custom Integrations

You can always create a custom integration with your own data source. Orama Cloud currently supports the following data sources:

- [REST API](/cloud/data-sources/custom-integrations/rest-api) \
You can index data from a REST API. Orama Cloud will periodically fetch the data from the API and index it.
- [WebHooks](/cloud/data-sources/custom-integrations/webhooks) \
You can index data from a WebHook. Orama Cloud will index the data every time the WebHook is triggered.
- [JSON File](/cloud/data-sources/custom-integrations/json-file) \
You can upload a JSON file to Orama Cloud, and it will be indexed automatically.
- [CSV File](/cloud/data-sources/custom-integrations/csv-file) \
You can upload a CSV file to Orama Cloud, and it will be indexed automatically.