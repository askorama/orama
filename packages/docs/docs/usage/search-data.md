---
sidebar_position: 3
---

# Search Data

export const Highlight = ({children, color}) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: '8px',
      color: '#fff',
      padding: '10px',
      cursor: 'pointer',
    }}
    >
    {children}
  </span>
);


> With the current version of Lyra, only type `string` properties are searchable, however this does not prevent the adding of different types of properties.
> Lyra will keep them in memory and send the entire document back whenever there's a match for a query on searchable properties.

## Search

Let's say we have a database that contains some elements:

```js title="lyra.js"
import { create, insert, search } from '@nearfom/lyra'; 

const movieDB = create({
  schema: {
    title: 'string',
    director: 'string',
    plot: 'string',
    year: 'number',
    isFavorite: 'boolean'
  }
});

const { id: thePrestige } = insert(movieDB, {
  title: 'The prestige',
  director: 'Christopher Nolan',
  plot: 'Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.',
  year: 2006,
  isFavorite: true
});

const { id: bigFish } = insert(movieDB, {
  title: 'Big Fish',
  director: 'Tim Burton',
  plot: 'Will Bloom returns home to care for his dying father, who had a penchant for telling unbelievable stories. After he passes away, Will tries to find out if his tales were really true.',
  year: 2004,
  isFavorite: true
});

const { id: harryPotter } = insert(movieDB, {
  title: 'Harry Potter and the Philosopher\'s Stone',
  director: 'Chris Columbus',
  plot: 'Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.',
  year: 2001,
  isFavorite: false
});
```
> Notice that we are also importing the `search` method

<br/>

We can now search for one (or multiple) document(s) as easily as:

```js
const searchResult = search(movieDB, {
  term: 'Harry',
  properties: '*'
});
```
## Parameters
The **`search`** method takes two mandatory parameters:

1. the database in which the **search** should occur
2. what has to be searched

## Filters
The object that defines our query, in this case `{term: 'Harry', properties: '*'}`,
can be shaped, by setting additional properties (filters), to **"tighten"** or **"loosen"** our query.
### <Highlight color="#ff5b9b">Term</Highlight>
The `term` property specifies the `word` to be searched.
```js title="lyra.js"
const searchResult = search(movieDB, {
  term: 'Chris',
});
```
We are searching for all the documents that contain the word `Chris`.

### <Highlight color="#ff5b9b">Properties</Highlight>
The `properties` property defines in which property to run our query.
```js title="lyra.js"
const searchResult = search(movieDB, {
  term: 'Chris',
  properties: ['director']
});
```
We are searching for all the documents that contain the word `Chris` in the `director` property.

<details><summary>Nested properties</summary>
We can also search through nested properties:

```js title="nested-properties.js"
const searchResult = search(movieDB, {
  term: 'Chris',
  properties: ['cast.director'],
  offset: 1,
});
```

</details>

### <Highlight color="#ff5b9b">Exact</Highlight>
The `exact` property finds all the document with an exact match of the `term` property.
```js title="lyra.js"
const searchResult = search(movieDB, {
  term: 'Chris',
  properties: ['director'],
  exact: true,
});
```
We are searching for all the documents that contain **`exactly`** the word `Chris` in the `director` property.

> Without the `exact` property, for example, the term `Christopher Nolan` would be returned as well, as it contains the word `Chris`.

### <Highlight color="#ff5b9b">Tolerance</Highlight>
The `tolerance` property allows to specify the maximum distance (following the levenshtein algorithm) between the term and the searchable property.
<details><summary>Levenshtein distance</summary>
The Levenshtein distance is a string metric for measuring the difference between two sequences. Informally, the Levenshtein distance between two words is the minimum number of single-character edits (insertions, deletions or substitutions) required to change one word into the other. 
</details>

```js title="lyra.js"
const searchResult = search(movieDB, {
  term: 'Cris',
  properties: ['director'],
  tolerance: 1,
});
```
We are searching for all the documents that contain a term with an edit distance of `1` (e.g. `Chris`) in the `director` property.

:::caution

`Tolerance` doesn't work together with the `exact` parameter

:::

### <Highlight color="#ff5b9b">Limit</Highlight>
The `limit` property limits the result at the specified number.
```js title="lyra.js"
const searchResult = search(movieDB, {
  term: 'Chris',
  properties: ['director'],
  limit: 1,
});
```
We are searching for the `first` document that contains the term `Chris` in the `director` property.


### <Highlight color="#ff5b9b">Offset</Highlight>
The `offset` property paginates the results.
```js title="lyra.js"
const searchResult = search(movieDB, {
  term: 'Chris',
  properties: ['director'],
  offset: 1,
});
```
We are searching for all the document that contain the term `Chris` in the `director` property, but returning the document at offset `1`.

### <Highlight color="#ff5b9b">Defaults</Highlight>
By default, Lyra limits the search results to `10`, without any offset (so, `0` as offset value).

## What does the `search` method return?
Now that we have learned how to perform **searches** on a Lyra database, we can briefly analyze the responde that Lyra gives us back.

Let's say we have ran the following query:

```js
const searchResult = search(movieDB, {
  term: 'Cris',
  properties: ['director'],
  tolerance: 1
});
```
Whether the document was found or not, Lyra gives back an `object` with the following properties:

```bash
{
  elapsed: 103
  hits: [
    {
      id: 'SXLYl5aURpbuNYr7fUlQI',
      title: "Harry Potter and the Philosopher's Stone",
      director: 'Chris Columbus',
      plot: 'Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.',
      year: 2001,
      isFavorite: false
    }
  ],
  count: 1
}
```

### Elapsed
The time it took for Lyra **to find** (or not) the documents.

### Hits
An array of objects (or an empty array) that contains all the **found documents**.

### Count
The number of documents that were **found**.
