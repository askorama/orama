# Insert data

In the [previous document](/guide/creating-a-database), we saw how to instanciate a new Lyra database, so we now have the following schema:

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

We can now start adding new data by using the `insert` methods:

```js
const { id: thePrestige } = await movieDB.insert({
  title: 'The prestige',
  director: 'Christopher Nolan',
  plot: 'Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.',
  year: 2006,
  isFavorite: true
});

const { id: granTorino } = await movieDB.insert({
  title: 'Gran Torino',
  director: 'Clint Eastwood',
  plot: 'When Walt Kowalski\'s neighbour, Thao, tries to steal his 1972 Gran Torino, he decides to help him reform. However, Walt gets involved in a feud with a local gang leader when he saves Thao from them.',
  year: 2009,
  isFavorite: true
});

const { id: inception } = await movieDB.insert({
  title: 'Inception',
  director: 'Christopher Nolan',
  plot: 'Cobb steals information from his targets by entering their dreams. Saito offers to wipe clean Cobb\'s criminal history as payment for performing an inception on his sick competitor\'s son.',
  year: 2010,
  isFavorite: true
});

const { id: bigFish } = await movieDB.insert({
  title: 'Big Fish',
  director: 'Tim Burton',
  plot: 'Will Bloom returns home to care for his dying father, who had a penchant for telling unbelievable stories. After he passes away, Will tries to find out if his tales were really true.',
  year: 2004,
  isFavorite: true
});

const { id: harryPotter } = await movieDB.insert({
  title: 'Harry Potter and the Philosopher\'s Stone',
  director: 'Chris Columbus',
  plot: 'Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.',
  year: 2001,
  isFavorite: false
});
```

After every insertion, the `insert` method will return a Promise containing an object with an `id` property, representing an unique ID for the document.

Once we added some data, we can start [querying the database](/guide/search).