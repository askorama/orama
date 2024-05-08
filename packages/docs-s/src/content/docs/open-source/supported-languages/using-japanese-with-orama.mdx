---
title: Using Japanese with Orama
---

At the time of writing, Orama supports Japanese via a custom tokenizer, which is part of the `@orama/tokenizers` package.

:::warning
The Japanese tokenizer is a compiled WASM from the [lindera](https://github.com/lindera-morphology/lindera) Rust project.
It can be quite large and its usage on the browser is discouraged.
:::

To get started, make sure to install all the dependencies you need:

```sh
npm i @orama/orama @orama/tokenizers
```

If you want to add Japanese stop-words as well, install the `@orama/stopwords` package too:

```sh
npm i @orama/stopwords
```

Now you're ready to get started with Orama:

```js
import { create, insert, search } from "@orama/orama";
import { createTokenizer } from "@orama/tokenizers";
import { stopwords as japaneseStopwords } from "@orama/stopwords/japanese";

const db = await create({
  schema: {
    name: "string",
  },
  components: {
    tokenizer: await createTokenizer({
      stopWords: japaneseStopwords,
    }),
  },
});

await insert(db, { name: "東京" }); // Tokyo
await insert(db, { name: "大阪" }); // Osaka
await insert(db, { name: "京都" }); // Kyoto
await insert(db, { name: "横浜" }); // Yokohama
await insert(db, { name: "札幌" }); // Sapporo
await insert(db, { name: "仙台" }); // Sendai
await insert(db, { name: "広島" }); // Hiroshima
await insert(db, { name: "東京大学" }); // University of Tokyo
await insert(db, { name: "京都大学" }); // Kyoto University
await insert(db, { name: "大阪大学" }); // Osaka University

const results = await search(db, {
  term: "大阪",
  threshold: 0,
});

console.log(results);

// {
//   "elapsed": {
//     "raw": 89554625,
//     "formatted": "89ms"
//   },
//   "hits": [
//     {
//       "id": "36666208-3",
//       "score": 4.210224897276653,
//       "document": {
//         "name": "大阪"
//       }
//     },
//     {
//       "id": "36666208-10",
//       "score": 1.9335268122510698,
//       "document": {
//         "name": "大阪大学"
//       }
//     }
//   ],
//   "count": 2
// }
```
