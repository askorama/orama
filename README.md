<center>
  <img src="./docs/lyra-logo.png" />
</center>

Fast, in-memory, full-text search engine with a powerful indexes and plugin system.

# Installation

```sh
npm i @nearform/lyra
```

```sh
yarn add @nearform/lyra
```

# Usage

```js
import { Lyra } from '@nearform/lyra';

  // Instantiate a new Lyra instance
  const db = new Lyra({
    schema: {
      title: 'string',
      director: 'string',
      plot: 'string',
    }
  });

  // Insert data in the database
  await db.insert({
    title: 'The Prestige',
    director: 'Christopher Nolan',
    plot: 'Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.'
  });
  await db.insert({
    title: 'Interstellar',
    director: 'Christopher Nolan',
    plot: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.'
  });
  await db.insert({
    title: 'Inception',
    director: 'Christopher Nolan',
    plot: 'Cobb steals information from his targets by entering their dreams. Saito offers to wipe clean Cobb\'s criminal history as payment for performing an inception on his sick competitor\'s son.'
  });
  await db.insert({
    title: 'Gran Torino',
    director: 'Clint Eastwood',
    plot: 'When Walt Kowalski\'s neighbour, Thao, tries to steal his 1972 Gran Torino, he decides to help him reform. However, Walt gets involved in a feud with a local gang leader when he saves Thao from them.'
  });

  // Search for inserted data
  const result = await db.search({
    term: 'nolan',
    properties: ['director'] // Use '*' to search through all of the schema properties
  });
```

Output:

```js
{
  elapsed: '89μs',
  hits: [
    {
      id: 'lqTxrPm3bMpymR7i6BNWz',
      title: 'The Prestige',
      director: 'Christopher Nolan',
      plot: 'Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.'
    },
    {
      id: 'NSfnakvjdxiBSTBKtGrS0',
      title: 'Interstellar',
      director: 'Christopher Nolan',
      plot: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.'
    },
    {
      id: '3lxsbV0QCm952nqIYkpP-',
      title: 'Inception',
      director: 'Christopher Nolan',
      plot: "Cobb steals information from his targets by entering their dreams. Saito offers to wipe clean Cobb's criminal history as payment for performing an inception on his sick competitor's son."
    }
  ],
  count: 3
}
```

# License
[Apache 2.0](/LICENSE.md)