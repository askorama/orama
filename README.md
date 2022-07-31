![Lyra](./docs/lyra-logo.png)

[![Tests](https://github.com/nearform/lyra/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/nearform/lyra/actions/workflows/tests.yml)

# Installation

You can install Lyra using `npm`, `yarn`, `pnpm`:

```sh
npm i @nearform/lyra
```
```sh
yarn add @nearform/lyra
```
```sh
pnpm add @nearform/lyra
```

# Usage

Lyra is quite simple to use. The first thing to do is to create a new database instance and set an indexing schema:

```js
import { create, insert, search, remove } from '@nearform/lyra';

const db = create({
  schema: {
    author: 'string',
    quote: 'string'
  }
});
```

Lyra will only index string properties, but will allow you to set and store additional data if needed.

Once the db instance is created, you can start adding some documents:

```js
insert(db, {
  quote: 'It is during our darkest moments that we must focus to see the light.',
  author: 'Aristotle'
});

insert(db, {
  quote: 'If you really look closely, most overnight successes took a long time.',
  author: 'Steve Jobs'
});

insert(db, {
  quote: 'If you are not willing to risk the usual, you will have to settle for the ordinary.',
  author: 'Jim Rohn'
});

insert(db, {
  quote: 'You miss 100% of the shots you don\'t take',
  author: 'Wayne Gretzky - Michael Scott'
});
```

After the data has been inserted, you can finally start to query the database.

```js
const searchResult = search(db, {
  term: 'if',
  properties: '*'
});
```

In the case above, you will be searching for all the documents containing the word `if`, looking up in every schema property (AKA index):

```js
{
  elapsed: 99,
  hits: [
    {
      id: 'ckAOPGTA5qLXx0MgNr1Zy',
      quote: 'If you really look closely, most overnight successes took a long time.',
      author: 'Steve Jobs'
    },
    {
      id: 'fyl-_1veP78IO-wszP86Z',
      quote: 'If you are not willing to risk the usual, you will have to settle for the ordinary.',
      author: 'Jim Rohn'
    }
  ],
  count: 2
}
```

You can also restrict the lookup to a specific property:

```js
const searchResult = search(db, {
  term: 'Michael',
  properties: ['author']
});
```

Result:

```js
{
  elapsed: 111,
  hits: [
    {
      id: 'L1tpqQxc0c2djrSN2a6TJ',
      quote: "You miss 100% of the shots you don't take",
      author: 'Wayne Gretzky - Michael Scott'
    }
  ],
  count: 1
}
```

If needed, you can also delete a given document by using the `remove` method:

```js
remove(db, 'L1tpqQxc0c2djrSN2a6TJ');
```

# License

Lyra is licensed under the [Apache 2.0](/LICENSE.md) license.