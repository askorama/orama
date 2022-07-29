# Searching

Given the database structure we created in the [previous document](./insert-data.md), we now have the following index:

```js
import { create, search } from '@nearfom/lyra';

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
const result = await search(movieDB, {
  term: 'Chris',
  properties: ['director']
});
```

In that case, we are searching for the word `Chris` in the `director` index exclusively, which will give us the following result:

```js
{
  elapsed: 102,
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
const result = search(movieDB, {
  term: 'Chris',
  properties: ['director'],
  limit: 1
});
```

And we'll get back the following result:

```js
{
  elapsed: 102
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
const result = search(movieDB, {
  term: 'Chris',
  properties: ['director'],
  limit: 1,
  offset: 1,
});
```

It will return the **second** result for our search:

```js
{
  elapsed: 102
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

## Exact Match

Another way to search is to use the `exact` option, which will match the term exactly:

```js
const result = search(movieDB, {
  term: 'Chris',
  properties: ['director'],
  exact: true
});
```

The result will be something like this:

```js
{
  elapsed: 94
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

As you can see, we get a `count` of `1` as well. It means that we have a total of `1` document which contains exactly the word `Chris` in the `director` index.

## Tolerance

The tolerance allows you to specify the maximum distance (following the [levenshtein algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance)) between the term and the searchable property.

If the value is not set, Lyra will work as usual regardless of the tolerance.

```js
const result = search(movieDB, {
  term: 'Cris',
  properties: ['director'],
  tolerance: 1
});
```

The searched term is **Cris** but it's misspelled, the correct term would be **Chris**. With the tolerance set to **1** we are telling to **Lyra** that the maximum distance between the term and the searchable property is **1**, so Lyra can make just **1** operation on the term to find the word in the database.

The result will be something like this:

```js
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

> Note: Tolerance will not work together with the *exact* parameter.

## Defaults

By default, Lyra limits the search results to `10`, without any offset (so, `0` as `offset` value).