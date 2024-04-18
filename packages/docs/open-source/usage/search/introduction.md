---
outline: deep
---

# Introduction to search

Orama provides a simple search interface that allows you to search through your documents.

With a unique API, you can perform **full-text**, **vector**, and **hybrid** search.

## Searching with Orama

By default, Orama uses all the string properties to perform the search.
Let's say we have a database that contains some elements:

```javascript copy
import { create, insert, search } from "@orama/orama";

const movieDB = await create({
  schema: {
    title: "string",
    director: "string",
    plot: "string",
    year: "number",
    isFavorite: "boolean",
  },
});

await insert(movieDB, {
  title: "The prestige",
  director: "Christopher Nolan",
  plot: "Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.",
  year: 2006,
  isFavorite: true,
});

await insert(movieDB, {
  title: "Big Fish",
  director: "Tim Burton",
  plot: "Will Bloom returns home to care for his dying father, who had a penchant for telling unbelievable stories. After he passes away, Will tries to find out if his tales were really true.",
  year: 2004,
  isFavorite: true,
});

await insert(movieDB, {
  title: "Harry Potter and the Philosopher's Stone",
  director: "Chris Columbus",
  plot: "Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.",
  year: 2001,
  isFavorite: false,
});
```

We can now search for documents as easily as:

```javascript copy
const searchResult = await search(movieDB, {
  term: "Harry",
});
```

If you want to return all documents in the database, then you can omit the `term` in the search parameters.

## What does the `search` method return?

Now that we have learned how to perform **searches** on a Orama database, we can
briefly analyze the response that Orama gives us back.

Let's say we have run the following query:

```javascript copy
const searchResult = await search(movieDB, {
  term: "Cris",
  properties: ["director"],
  tolerance: 1,
});
```

Whether the document was found or not, Orama gives back an `object` with the
following properties:

```javascript copy
{
  elapsed: {
    raw: 181208,
    formatted: '181μs',
  },
  count: 2,
  hits: [
    {
      id: '37149225-243',
      score: 0.23856062735983122,
      document: {
        title: 'Harry Potter and the Philosopher\'s Stone',
        director: 'Chris Columbus',
        plot: 'Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.',
        year: 2001,
        isFavorite: false
      }
    },
    {
      id: '37149225-5',
      score: 0.21267890323564321,
      document: {
        title: 'The prestige',
        director: 'Christopher Nolan',
        plot: 'Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.',
        year: 2006,
        isFavorite: true
      }
    }
  ]
}
```

| Property  | Type     | Description                                                                                                                    |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `elapsed` | `object` | Time taken to execute the query. <br /> Returns an object with the following shape: <br />`{ raw: number, formatted: string }` |
| `hits`    | `object` | Array of results containing result score (from `0` to `1` based on relevance), Orama's ID, and original document.              |
| `count`   | `number` | Number of total results.                                                                                                       |

In case of missing or empty `term`, all scores will be returned as `0`.

## Search on specific properties

The `properties` property defines in which properties to run our query.

<<< @/snippets/open-source/search.js#properties

We are now searching for all the documents that contain the word `Chris` in the
`director` property.

We can also search through nested properties:

<<< @/snippets/open-source/search.js#nested-properties

By default, Orama searches in **all** searchable properties.

## Exact match

The `exact` property finds all the document with an exact match of the `term`
property.

<<< @/snippets/open-source/search.js#exact

We are now searching for all the documents that contain **`exactly`** the word
`Chris` in the `director` property.

Without the `exact` property, for example, the term `Christopher Nolan` would be returned as well, as it contains the word `Chris`.

::: warning
`exact` doesn't work together with the `tolerance` parameter. `exact` will have priority.
:::

## Typo tolerance

The `tolerance` property allows specifying the maximum distance (following the
Levenshtein algorithm) between the term and the searchable property.

> _The Levenshtein distance is a string metric for measuring the difference
> between two sequences. Informally, the Levenshtein distance between two words
> is the minimum number of single-character edits (insertions, deletions or
> substitutions) required to change one word into the other._ ([read more](https://oramasearch.com/blog/typo-no-more-an-in-depths-guide-to-the-levenshtein-edit-distance))

We are searching for all the documents that contain a term with an edit distance
of `1` (e.g. `Chris`) in the `director` property.

<<< @/snippets/open-source/search.js#tolerance

::: warning
`tolerance` doesn't work together with the `exact` parameter. `exact` will have priority.
:::

## Results limits

The `limit` property limits the result at the specified number.

<<< @/snippets/open-source/search.js#limit

We are searching for the `first` document that contains the term `Chris` in the
`director` property.

## Results offset

The `offset` property skips the first `X` results.

<<< @/snippets/open-source/search.js#offset

We are searching for all the documents that contain the term `Chris` in the
`director` property, but returning the document at offset `1`.

::: tip Remember!
By default, Orama limits the search results to `10`, without any offset (so, `0` as offset value).
:::

## Distinct

Orama can calculate distinct values letting you specify a unique key as follows:

<<< @/snippets/open-source/search.js#distinct

Using the property `distinctOn`, Orama returns only the first document for every property `type` value.
The `results.hits` array will contain only the first documents for every property `type` value.

NB: you can use this feature in combination with `sortBy`.

## `elapsed` property customization

You can always customize the behavior of the `elapsed` property by using the `formatElapsedTime` component when creating a new Orama instance:

```javascript copy
const db = await create({
  schema: {
    title: "string",
    body: "string",
  },
  components: {
    formatElapsedTime: (n: bigint) => {
      return `custom value: ${n}`;
    },
  },
});
```

When performing a search operation, the `elapsed` property will now return the following value:

```javascript copy
{
  elapsed: 'custom value: 181208', // instead of { raw: 181208, formatted: '181μs' }
  count: 2,
  hits: [...]
}
```

## Caveats

Search is **not** case sensitive.
