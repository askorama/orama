---
outline: deep
---

# Orama Cloud Indexes

An Orama index is essentially a collection of Orama documents that share the following properties:

- **Schema** \
All documents in a given index must follow the same schema.
- **Language** \
Every index is associated with a language. This is used to determine the language of the documents in the index and to apply language-specific analyzers at index time and at search time.
- **Components** \
A component is a building block of an index. An example of component can be a tokenizer, stemmer, or a collection of stop-words.

Depending on your subscription, you may have more or less limitations when it comes to indexes.
,,
| Subscription | Max. Indexes         | Max. Documents   | Max. Size | Max. data size in aggregate |
| ------------ | -------------------- | ---------------- | --------- | --------------------------- |
| Free         | Unlimited            | 10,000           | 10 MB     | 100 GB                      |
| Pro          | Unlimited            | Unlimited        | Unlimited | Unlimited                   |
| Enterprise   | Unlimited            | Unlimited        | Unlimited | Unlimited                   |

Regardless of your subscription, you can create as many indexes as you want, as long as they don't exceed the maximum data size in aggregate.

By _**maximum data size in aggregate**_, we mean the sum of the sizes of all the documents in all the indexes you have created.

## Index Types

Orama Cloud integrates natively with different data sources.

Every native integration between Orama Cloud and an external data source will lead to a highly optimized index,
where the main purpose is to provide a fast and reliable search experience, with minimal configuration.

### Native Integrations

Orama Cloud integrates natively with many different data sources, including:

- [Shopify](/cloud/data-sources/native-integrations/shopify)
- [Docusaurus](/cloud/data-sources/native-integrations/docusaurus)
- _Strapi (coming soon)_
- _Contentful (coming soon)_
- _Storyblok (coming soon)_

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