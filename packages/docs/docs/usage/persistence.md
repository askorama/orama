---
sidebar_position: 5
---

# Persistence

## Disk Persistence Plugin

To persist Lyra databases and to load them again into memory, you can use the
(still experimental)
[Disk Persistence Plugin](https://github.com/LyraSearch/plugin-disk-persistence).

## Low-Level methods

As an alternative, we can also rely on some "low level" methods, although they
won't be as convenient as the plugin.

### Saving the DB

Let's say we have a database that contains some elements:

```js title="save-lyra-db.js"
import { writeFile } from 'node:fs/promises'
import { create, insert, save } from '@nearform/lyra'; 

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

> Notice that we are also importing the `save` method.

<br/>

We can now save the DB into a serializable object, than can be later persisted
in a different file:

```js
const dbData = save(movieDB)

// `dbData` can be persisted as a JSON file
await writeFile('./myLocalDb.json', JSON.stringify(dbData), { encoding: 'utf8' })
```

### Loading the DB

Loading a persisted DB requires us to create our DB object in `edge` mode:

```js title="load-lyra-db.js"
import { writeFile } from 'node:fs/promises'
import { create, load, search } from '@nearform/lyra';

const movieDB = create({
  schema: {
    title: 'string',
    director: 'string',
    plot: 'string',
    year: 'number',
    isFavorite: 'boolean'
  },
  edge: true // Notice that `edge` must be true
});

const dbData = JSON.parse(await readFile('./myLocalDb.json', { encoding: 'utf8' }));

// We load the persisted data into our in-memory DB
load(movieDB, dbData);

// Now we can perform searches
const searchResult = search(movieDB, {
  term: 'Harry',
  properties: '*'
});
```
