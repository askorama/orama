import cronometro from "cronometro";
import { isMainThread } from "worker_threads";
import { create, search, insertMultiple } from "../../dist/index.js";
import { createTokenizer } from "../../dist/internals.js";
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
  components: {
    tokenizer: await createTokenizer("english", { stemming: false }),
  },
});

const first30000Events = formattedEvents.slice(0, 30_000);

if (!isMainThread) {
  await insertMultiple(db, first30000Events);
  await insertMultiple(dbNoStemming, first30000Events);
}

await cronometro({
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

await cronometro({
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

await cronometro({
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

await cronometro({
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
