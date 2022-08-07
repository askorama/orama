import { readFile } from 'node:fs/promises'
import { URL } from "node:url";
import { isMainThread } from "node:worker_threads"
import cronometro from 'cronometro'
import { create, insert, search } from '@nearform/lyra'
import Minisearch from 'minisearch'
import lunr from 'lunr'

let lunrDB;
let minisearchDB;
let lyraDB;

if (!isMainThread) {

  const dataset = JSON.parse(await readFile(new URL("../dataset/divinaCommedia.json", import.meta.url).pathname));

  lunrDB = lunr(function () {
    this.ref('id');
    this.field('txt');

    dataset.forEach(function (doc) {
      this.add(doc);
    }, this);
  });

  minisearchDB = new Minisearch({
    fields: ['txt', 'id'],
    storeFields: ['txt', 'id'],
  });

  minisearchDB.addAll(dataset);

  lyraDB = create({
    schema: {
      id: 'string',
      txt: 'string'
    },
    defaultLanguage: 'english',
  });

  for (const { id, txt } of dataset) {
    insert(lyraDB, {
      id,
      txt
    });
  }
}

cronometro({
  ['minisearch - search "ste" prefix on all indexes']: () => {
    minisearchDB.search('ste', { fields: ['id', 'txt'], prefix: true });
  },
  ['lunr - search "ste" prefix on all indexes']: () => {
    lunrDB.search('ste*');
  },
  ['lyra - search "ste" prefix on all indexes']: () => {
    search(lyraDB, {
      term: 'ste',
      exact: false
    });
  }
});

cronometro({
  ['minisearch - search "ste" prefix on txt index']: () => {
    minisearchDB.search('ste', { fields: ['txt'], prefix: true });
  },
  ['lunr - search "ste" prefix on txt index']: () => {
    lunrDB.search('ste*');
  },
  ['lyra - search "ste" prefix on txt index']: () => {
    search(lyraDB, {
      term: 'ste',
      properties: ['txt'],
      exact: false
    });
  }
});

cronometro({
  ['minisearch - exact search "ombre mostrommi e nominommi a dito" on txt index']: () => {
    minisearchDB.search('ombre mostrommi e nominommi a dito', { fields: ['txt'], prefix: false });
  },
  ['lunr - exact search "ombre mostrommi e nominommi a dito" on txt index']: () => {
    lunrDB.search('ombre mostrommi e nominommi a dito');
  },
  ['lyra - exact search "ombre mostrommi e nominommi a dito" on txt index']: () => {
    search(lyraDB, {
      term: 'ombre mostrommi e nominommi a dito',
      properties: ['txt'],
      exact: true
    });
  }
});
