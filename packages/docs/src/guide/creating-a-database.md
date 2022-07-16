# Creating a new Lyra instance

You can create a new Lyra instance by importing the `Lyra` class in your project.

```js
import { Lyra } from '@nearform/lyra';

const db = new Lyra();
```

The Lyra class needs a **schema** to be able to process data and indices. The schema represents the documents we're going to insert into the database.

```js
import { lyra } from '@nearfom/lyra';

const movieDB = new Lyra({
  schema: {
    title: 'string',
    director: 'string',
    plot: 'string',
    year: 'number',
    isFavorite: 'boolean',
  }
});
```

With the current version of Lyra, only `string` fields (from now on, _properties_) will be searchable. You can still add many different properties, as the database will keep them in-memory and will send the whole document back after searching for a specific word or sentence in one or many searchable fields.

::: danger No nested properties
With the current version of Lyra, nested properties are not supported.
:::

The following schema will be rejected:

```js
import { lyra } from '@nearfom/lyra';

const movieDB = new Lyra({
  schema: {
    title: 'string',
    director: 'string',
    plot: 'string',
    year: 'number',
    isFavorite: 'boolean',
    cast: {
      director: 'string',
      leading: 'string'
    }
  }
});
```

# Input analyzer
By default, Lyra analyzes the input and performs a **stemming** operation, which allows the engine to perform more optimize queries, as well as saving indexing space.

> In linguistic morphology and information retrieval, stemming is the process of reducing inflected (or sometimes derived) words to their word stem, base or root form—generally a written word form. The stem need not be identical to the morphological root of the word; it is usually sufficient that related words map to the same stem, even if this stem is not in itself a valid root. Algorithms for stemming have been studied in computer science since the 1960s. Many search engines treat words with the same stem as synonyms as a kind of query expansion, a process called conflation. ([Wikipedia](https://en.wikipedia.org/wiki/Stemming))

By default, Lyra uses the English language analyzer, but you can override this behaviour while initializing a new Lyra insrance:

```js
import { lyra } from '@nearfom/lyra';

const movieDB = new Lyra({
  schema: {
    title: 'string',
    director: 'string',
    plot: 'string',
    year: 'number',
    isFavorite: 'boolean',
  },
  defaultLanguage: 'italian'
});
```

You can override the default language for a given document during data insertion:

```js
movieDB.insert(myDocument, 'spanish');
```

As for today, the available languages are:

- dutch
- english
- french
- italian
- norwegian
- portugese
- russian
- spanish
- swedish

# Inserting data

Once the database is ready, you can start [adding some data to it](./insert-data.md).