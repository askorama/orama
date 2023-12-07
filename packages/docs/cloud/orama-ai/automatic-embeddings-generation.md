---
outline: deep
---

# Automatic embeddings generation

With Orama Cloud, you can automatically generate embeddings from your data at deployment.

This guide will walk you through the process of creating embeddings using Open AI. We plan to support additional models in the near future.

## What are text embeddings?

Text embeddings are numerical representations of text that allow computers to understand the meaning and relationships between words, enabling applications like semantic search, machine translation, and sentiment analysis.

In recent months, embeddings have gained popularity as they form the foundation of semantic search, which is crucial in developing generative AI experiences like ChatGPT, Google Bard, and others.

Orama is a hybrid database capable of storing various types of data. It specializes in search capabilities, and its support for vector search enables semantic search among large sets of embeddings, which are presented as vectors.

For a deeper understanding of text embeddings, the Tensorflow website offers a fantastic explanation. It can be accessed [here](https://www.tensorflow.org/text/guide/word_embeddings).

## Automatic embeddings generation with Orama Cloud

Creating text embeddings from a given text or set of texts can be complex. However, Orama Cloud simplifies this process by enabling automatic generation of these embeddings each time you deploy a new index. This makes it remarkably easy to conduct semantic searches through your data at a remarkable speed.

### Connecting to OpenAI

::: info
To use this feature, you will need an OpenAI account and an OpenAI API Key.
We will support more providers soon.
:::

Before you can start generating embeddings, you need to connect to OpenAI. This requires adding an OpenAI API Key to Orama Cloud.

We will encrypt this API Key and store it securely. For safety reasons, we recommend creating a new API Key specifically for Orama Cloud from the OpenAI dashboard.

As soon as you have your OpenAI API Key ready, you can add it to Orama Cloud by going to [https://cloud.oramasearch.com/developer-tools](https://cloud.oramasearch.com/developer-tools), and selecting "OpenAI API key" from the left menu.

<ZoomImg
  src='/cloud/guides/automatic-embeddings-generation/automatic-embeddings-generation.png'
  alt='Adding OpenAI API Key to Orama Cloud'
/>

After adding your API key, you won't be able to view it again due to security measures. You can always delete it, though this is discouraged because all operations dependent on vector search will cease to function. Alternatively, you can replace it with a new key.

<ZoomImg
  src='/cloud/guides/automatic-embeddings-generation/open-ai-api-key.png'
  alt='Your OpenAI API Key'
/>

### Creating the embeddings 

You can now create a new index by going to [https://cloud.oramasearch.com/indexes/new](https://cloud.oramasearch.com/indexes/new). For this guide, we will use a simple JSON file as a data source.

You can download the same JSON file here: [download dataset](/cloud/guides/example-datasets/games.json).

Once you have your dataset ready, you can create a new Index:

<ZoomImg
  src='/cloud/guides/automatic-embeddings-generation/new-index.png'
  alt='Creating a new index on Orama Cloud'
/>

After uploading the file, you can enable the "AI Search". This feature will scan the `"string"` properties in your schema and automatically select them to generate embeddings. You can always select or deselect different properties as needed.

<ZoomImg
  src='/cloud/guides/automatic-embeddings-generation/enable-orama-ai.png'
  alt='Enablin Orama AI on Orama Cloud'
/>

Once you have deployed your index containing embeddings, you can locate it in the indexes list where the "AI Search" column is marked with the icon of the chosen model, such as OpenAI.

Congratulations! You've just deployed your first automatically-generated embeddings on Orama Cloud!

## Querying the embeddings

Now that you have your embeddings distributed on Orama Cloud, you can use the [official JavaScript client](/cloud/integrating-orama-cloud/javascript-sdk) to perform vector search on them.

Read more about performing vector search on Orama Cloud [here](/cloud/performing-search/vector-search).