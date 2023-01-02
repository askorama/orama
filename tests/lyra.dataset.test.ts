import t from "tap";
import type { PropertiesSchema } from "../src/types";
import type { SearchResult } from "../src/methods/search";
import { create, insertBatch, remove, search } from "../src/lyra";
import dataset from "./datasets/events.json";

type EventJson = {
  result: {
    events: {
      date: string;
      description: string;
      granularity: string;
      category1: string;
      category2: string;
    }[];
  };
};

function removeVariadicData<T extends PropertiesSchema>(res: SearchResult<T>): SearchResult<T> {
  const hits = res.hits.map(h => {
    h.id = "";
    return h;
  });

  return {
    ...res,
    elapsed: 0n,
    hits,
  };
}

t.test("lyra.dataset", async t => {
  t.plan(4);
  const db = await create({
    schema: {
      date: "string",
      description: "string",
      granularity: "string",
      categories: {
        first: "string",
        second: "string",
      },
    },
  });

  t.before(async () => {
    const events = (dataset as EventJson).result.events.map(ev => ({
      date: ev.date,
      description: ev.description,
      granularity: ev.granularity,
      categories: {
        first: ev.category1 ?? "",
        second: ev.category2 ?? "",
      },
    }));

    await insertBatch(db, events);
  });

  t.test("should correctly populate the database with a large dataset", async t => {
    t.plan(4);

    const s1 = await search(db, {
      term: "august",
      exact: true,
      properties: ["categories.first"],
      limit: 10,
      offset: 0,
    });

    const s2 = await search(db, {
      term: "january, june",
      exact: true,
      properties: ["categories.first"],
      limit: 10,
      offset: 0,
    });

    const s3 = await search(db, {
      term: "january/june",
      exact: true,
      properties: ["categories.first"],
      limit: 10,
      offset: 0,
    });

    t.equal(Object.keys(db.docs).length, (dataset as EventJson).result.events.length);
    t.equal(s1.count, 1117);
    t.equal(s2.count, 1842);
    t.equal(s3.count, 1842);
  });

  //  Tests for https://github.com/LyraSearch/lyra/issues/159
  t.test("should correctly search long strings", async t => {
    t.plan(3);

    const s1 = await search(db, {
      term: "e into the",
      properties: ["description"],
    });

    const s2 = await search(db, {
      term: "The Roman armies",
      properties: ["description"],
    });

    const s3 = await search(db, {
      term: "the King of Epirus, is taken",
      properties: ["description"],
    });

    t.equal(s1.count, 500);
    t.equal(s2.count, 183);
    t.equal(s3.count, 1);
  });

  t.test("should perform paginate search", async t => {
    t.plan(5);

    const s1 = removeVariadicData(
      await search(db, {
        term: "war",
        exact: true,
        // eslint-disable-next-line
        // @ts-ignore
        properties: ["description"],
        limit: 10,
        offset: 0,
      }),
    );

    const s2 = removeVariadicData(
      await search(db, {
        term: "war",
        exact: true,
        properties: ["description"],
        limit: 10,
        offset: 10,
      }),
    );

    const s3 = removeVariadicData(
      await search(db, {
        term: "war",
        exact: true,
        properties: ["description"],
        limit: 10,
        offset: 20,
      }),
    );

    const s4 = await search(db, {
      term: "war",
      exact: true,
      properties: ["description"],
      limit: 2240,
      offset: 0,
    });

    const s5 = await search(db, {
      term: "war",
      exact: true,
      properties: ["description"],
      limit: 10,
      offset: 2239,
    });

    t.matchSnapshot(s1, `${t.name}-page-1`);
    t.matchSnapshot(s2, `${t.name}-page-2`);
    t.matchSnapshot(s3, `${t.name}-page-3`);

    t.equal(s4.count, 2357);
    t.equal(s5.hits.length, 10);
  });

  t.test("should correctly delete documents", async t => {
    t.plan(1);

    const documentsToDelete = await search(db, {
      term: "war",
      exact: true,
      properties: ["description"],
      limit: 10,
      offset: 0,
    });

    for (const doc of documentsToDelete.hits) {
      remove(db, doc.id);
    }

    const newSearch = await search(db, {
      term: "war",
      exact: true,
      properties: ["description"],
      limit: 10,
      offset: 0,
    });

    t.equal(newSearch.count, 2347);
  });
});
