import cronometro from "cronometro";
import { create, search, insertBatch } from "../../dist/cjs/src/lyra.js";
import { formattedEvents } from "./utils/dataset.mjs";

const db = create({
  schema: {
    date: "string",
    description: "string",
    categories: {
      first: "string",
      second: "string",
    },
  },
});

const dbNoStemming = create({
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

insertBatch(db, first30000Events);
insertBatch(dbNoStemming, first30000Events);

cronometro({
  'search "beauty", default settings': () => {
    search(db, {
      term: "beauty",
    });
  },
  'search "beauty", tolerance of 1': () => {
    search(db, {
      term: "beauty",
      tolerance: 1,
    });
  },
  'search "beauty", tolerance of 2': () => {
    search(db, {
      term: "beauty",
      tolerance: 2,
    });
  },
});

cronometro({
  'search "decides to leave", default settings': () => {
    search(db, {
      term: "decides to leave",
    });
  },
  'search "decides to leave", tolerance of 1': () => {
    search(db, {
      term: "decides to leave",
      tolerance: 1,
    });
  },
  'search "decides to leave", tolerance of 2': () => {
    search(db, {
      term: "decides to leave",
      tolerance: 2,
    });
  },
});

cronometro({
  'search "beauty", default settings, no stemming': () => {
    search(dbNoStemming, {
      term: "beauty",
    });
  },
  'search "beauty", tolerance of 1, no stemming': () => {
    search(dbNoStemming, {
      term: "beauty",
      tolerance: 1,
    });
  },
  'search "beauty", tolerance of 2, no stemming': () => {
    search(dbNoStemming, {
      term: "beauty",
      tolerance: 2,
    });
  },
});

cronometro({
  'search "decides to leave", default settings, no stemming': () => {
    search(dbNoStemming, {
      term: "decides to leave",
    });
  },
  'search "decides to leave", tolerance of 1, no stemming': () => {
    search(dbNoStemming, {
      term: "decides to leave",
      tolerance: 1,
    });
  },
  'search "decides to leave", tolerance of 2, no stemming': () => {
    search(dbNoStemming, {
      term: "decides to leave",
      tolerance: 2,
    });
  },
});
