---
sidebar_position: 1
---

# Create a new Lyra instance

## Create

Creating a new instance is very simple.

We `create` a new database instance with an **indexing `schema`**.<br/>
The schema represents **the structure** of the entry to be inserted into the database.

A database can be as simple as:

```js title="lyra.js"
import { create } from '@nearform/lyra';

const db = create({
  schema: {
    word: 'string',
  }
});
```

or more variegated

```js title="lyra.js"
import { create } from '@nearform/lyra';

const movieDB = create({
  schema: {
    title: 'string',
    director: 'string',
    plot: 'string',
    year: 'number',
    isFavorite: 'boolean',
  }
});
```
### Don't do this

With the current version of Lyra, nested properties are not supported.<br/>
The following schema will be rejected

```js title="this-is-wrong.js"
const movieDB = create({
  schema: {
    title: 'string',
    director: 'string',
    plot: 'string',
    year: 'number',
    isFavorite: 'boolean',
    cast: { // Cannot do this yet
      director: 'string',
      leading: 'string'
    }
  }
});
```

## Input Analyzer
By default, Lyra analyzes the input and performs a stemming operation, which allows the engine to perform more optimize queries, as well as saving indexing space.

<details><summary>What is stemming?</summary>
In linguistic morphology and information retrieval, stemming is the process of reducing inflected (or sometimes derived) words to their word stem, base or root form—generally a written word form. The stem need not be identical to the morphological root of the word; it is usually sufficient that related words map to the same stem, even if this stem is not in itself a valid root. Algorithms for stemming have been studied in computer science since the 1960s. Many search engines treat words with the same stem as synonyms as a kind of query expansion, a process called conflation. (Wikipedia (opens new window))
</details>

By default, Lyra uses **the English language analyzer**, but you can override this behaviour while initializing a new Lyra instance by setting the property `defaultLanguage` at database initialization.

```js title="lyra.js"
const db = new Lyra({
  schema: {
    word: 'string'
  },
  defaultLanguage: 'italian',
});
```