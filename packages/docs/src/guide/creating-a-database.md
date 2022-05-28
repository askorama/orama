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
    isFavorite: 'boolean'
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
    isFavorite: 'boolean'
    cast: {
      director: 'string',
      leading: 'string'
    }
  }
});
```

Once the database is ready, you can start [adding some data to it](/guide/insert-data).