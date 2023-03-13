import cronometro from "cronometro";
import { create, insertBatch, search } from "../../dist/index.js";
import { formattedEvents } from "./utils/dataset.js";

const db = await create({
  schema: {
    date: "string",
    description: "string",
    categories: {
      first: "string",
      second: "string",
    },
  },
});

const dbNoStemming = await create({
  schema: {
    date: "string",
    description: "string",
    categories: {
      first: "string",
      second: "string",
    },
  },
  tokenizer: {
    enableStemming: false,
  },
});

const first30000Events = formattedEvents.slice(0, 30_000);

await insertBatch(db, first30000Events);
await insertBatch(dbNoStemming, first30000Events);

cronometro({
  'search "beauty", default settings': () => {
    return search(db, {
      term: "beauty",
    });
  },
  'search "beauty", tolerance of 1': () => {
    return search(db, {
      term: "beauty",
      tolerance: 1,
    });
  },
  'search "beauty", tolerance of 2': () => {
    return search(db, {
      term: "beauty",
      tolerance: 2,
    });
  },
});

cronometro({
  'search "decides to leave", default settings': () => {
    return search(db, {
      term: "decides to leave",
    });
  },
  'search "decides to leave", tolerance of 1': () => {
    return search(db, {
      term: "decides to leave",
      tolerance: 1,
    });
  },
  'search "decides to leave", tolerance of 2': () => {
    return search(db, {
      term: "decides to leave",
      tolerance: 2,
    });
  },
});

cronometro({
  'search "beauty", default settings, no stemming': () => {
    return search(dbNoStemming, {
      term: "beauty",
    });
  },
  'search "beauty", tolerance of 1, no stemming': () => {
    return search(dbNoStemming, {
      term: "beauty",
      tolerance: 1,
    });
  },
  'search "beauty", tolerance of 2, no stemming': () => {
    return search(dbNoStemming, {
      term: "beauty",
      tolerance: 2,
    });
  },
});

cronometro({
  'search "decides to leave", default settings, no stemming': () => {
    return search(dbNoStemming, {
      term: "decides to leave",
    });
  },
  'search "decides to leave", tolerance of 1, no stemming': () => {
    return search(dbNoStemming, {
      term: "decides to leave",
      tolerance: 1,
    });
  },
  'search "decides to leave", tolerance of 2, no stemming': () => {
    return search(dbNoStemming, {
      term: "decides to leave",
      tolerance: 2,
    });
  },
});
