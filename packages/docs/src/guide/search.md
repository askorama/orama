# Searching

Given the database structure we created in the [previous document](/insert-data), we now have the following index:

```js
import { lyra } from '@nearfom/lyra';

const movieDB = new Lyra({
  schema: {
    title: 'string',
    director: 'string',
    plot: 'string',
    year: 'number',
    isFavorite: 'boolean'
  }
});
```

Which means that we can make a search through all the _searchable properties_ (all the `string` properties). 

To do that, we can simply use the `search` method:

```js
const result = await movieDB.search({
  term: 'Chris',
  properties: ['director']
});
```

In that case, we are searching for the word `Chris` in the `director` index exclusively, which will give us the following result:

```js
{
  elapsed: '102μs',
  hits: [
    {
      id: 'z3xoJ_VbaBnXsRHnsStpw',
      title: "Harry Potter and the Philosopher's Stone",
      director: 'Chris Columbus',
      plot: 'Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.'
    },
    {
      id: 'VcaClDjvvriskxi1nBnPW',
      title: 'The prestige',
      director: 'Christopher Nolan',
      plot: 'Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.'
    },
    {
      id: 'wUANzFP3zT8rTHp1sRYbF',
      title: 'Inception',
      director: 'Christopher Nolan',
      plot: "Cobb steals information from his targets by entering their dreams. Saito offers to wipe clean Cobb's criminal history as payment for performing an inception on his sick competitor's son."
    }
  ],
  count: 3
}
```

If the `properties` property is not set, Lyra will search through all the searchable indices.

## Limit, Offset

We could also limit the search to `1` result by using the `limit` option:

```js
const result = await movieDB.search({
  term: 'Chris',
  properties: ['director'],
  limit: 1
});
```

And we'll get back the following result:

```js
{
  elapsed: '102μs',
  hits: [
    {
      id: 'z3xoJ_VbaBnXsRHnsStpw',
      title: "Harry Potter and the Philosopher's Stone",
      director: 'Chris Columbus',
      plot: 'Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.'
    }
  ],
  count: 3
}
```

As you can notice, we still get the `3` as a value for the `count` property. It means that we have a total of `3` documents containing the word `Chris` in the `director` index.

It also tells us that we can paginate our search, and we can do that by setting the `offset` property:

```js
const result = await movieDB.search({
  term: 'Chris',
  properties: ['director'],
  limit: 1,
  offset: 1,
});
```

It will return the **second** result for our search:

```js
{
  elapsed: '102μs',
  hits: [
    {
      id: 'VcaClDjvvriskxi1nBnPW',
      title: 'The prestige',
      director: 'Christopher Nolan',
      plot: 'Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.'
    }
  ],
  count: 3
}
```

## Defaults

By default, Lyra limits the search results to `10`, without any offset (so, `0` as `offset` value).