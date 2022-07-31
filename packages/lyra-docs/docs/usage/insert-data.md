---
sidebar_position: 2
---

# Insert Data

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

Whenever we create a database with Lyra we must specify a `Schema`, which represents the entry we are going to insert.

> <small>If you don't know how to create a lyra database, <a href="/docs/usage/creating-a-new-lyra-instance">go check it out</a> before proceeding.</small>

Our database and schema look like this:

```js title="lyra.js"
import { create, insert } from '@nearfom/lyra'; 

const movieDB = create({
  schema: {
    title: 'string',
    director: 'string',
    plot: 'string',
    year: 'number',
    isFavorite: 'boolean'
  }
});
```
and notice that we are now also **importing** the `insert` method to do our insertions.

## Insert
Data insertion in Lyra is quick and intuitive

```js title="lyra.js"
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

### Parameters
The **insert** method takes two mandatory parameters: 

1. the `database` in which we want the insertion to occur
2. the `document` to insert (which must abide to the aforementioned **schema**)

The optional parameters can be configurations properties (e.g. <a href="/docs/usage/creating-a-new-lyra-instance#input-analyzer">the override</a> of the default language for the given document).

```js title="lyra.js"
insert(movieDB, myDocument, { language: 'spanish' });
```
<hr/>

### <Highlight color="#ff5b9b">Doc IDs</Highlight>

The **insert** method returns the unique `id` of the inserted document.
```js
console.log(harryPotter) // 79741872-5
```