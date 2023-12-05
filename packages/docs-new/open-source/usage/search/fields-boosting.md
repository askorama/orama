# Fields Boosting

You can use the `boost` interface to boost the importance of a field in the search results.

```javascript copy
const searchResult = await search(movieDB, {
  term: 'Harry',
  properties: '*',
  boost: {
    title: 2,
  },
})
```

In this example, we are boosting the `title` field by `2` and the `director` field by `1.5`.

That means that any match of `'Harry'` in the `title` field will be considered twice as important as a match in any other field field.

You can boost multiple fields:

```javascript copy
const searchResult = await search(movieDB, {
  term: 'Harry',
  properties: '*',
  boost: {
    title: 2,
    director: 1.5,
  },
})
```