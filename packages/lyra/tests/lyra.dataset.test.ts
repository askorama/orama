import t from "tap";
import { create, insert, remove, search } from "../src/lyra";
import type { PropertiesSchema, SearchResult } from "../src/lyra";
import dataset from "./datasets/events.json";

function removeVariadicData(res: SearchResult<PropertiesSchema>): SearchResult<PropertiesSchema> {
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

const db = create({
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

t.test("lyra.dataset", async t => {
  t.plan(3);

  t.before(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const events = (dataset as any).result.events;

    let i = 0;
    return new Promise<void>(resolve => {
      function insertBatch() {
        const batch = events.slice(i * 1000, (i + 1) * 1000);
        i++;

        if (!batch.length) {
          return resolve();
        }

        for (const event of batch) {
          insert(db, {
            date: event.date,
            description: event.description,
            granularity: event.granularity,
            categories: {
              first: event.category1 ?? "",
              second: event.category2 ?? "",
            },
          });
        }

        setImmediate(insertBatch);
      }

      setImmediate(insertBatch);
    });
  });

  t.test("should correctly populate the database with a large dataset", t => {
    t.plan(4);

    const s1 = search(db, {
      term: "august",
      exact: true,
      properties: ["categories.first"],
      limit: 10,
      offset: 0,
    });

    const s2 = search(db, {
      term: "january, june",
      exact: true,
      properties: ["categories.first"],
      limit: 10,
      offset: 0,
    });

    const s3 = search(db, {
      term: "january/june",
      exact: true,
      properties: ["categories.first"],
      limit: 10,
      offset: 0,
    });

    t.equal(Object.keys(db.docs).length, (dataset as any).result.events.length);
    t.equal(s1.count, 1117);
    t.equal(s2.count, 7314);
    t.equal(s3.count, 7314);
  });

  t.test("should perform paginate search", t => {
    t.plan(5);

    const s1 = removeVariadicData(
      search(db, {
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
      search(db, {
        term: "war",
        exact: true,
        properties: ["description"],
        limit: 10,
        offset: 10,
      }),
    );

    const s3 = removeVariadicData(
      search(db, {
        term: "war",
        exact: true,
        properties: ["description"],
        limit: 10,
        offset: 20,
      }),
    );

    const s4 = search(db, {
      term: "war",
      exact: true,
      properties: ["description"],
      limit: 2240,
      offset: 0,
    });

    const s5 = search(db, {
      term: "war",
      exact: true,
      properties: ["description"],
      limit: 10,
      offset: 2239,
    });

    t.matchSnapshot(s1, `${t.name}-page-1`);
    t.matchSnapshot(s2, `${t.name}-page-2`);
    t.matchSnapshot(s3, `${t.name}-page-3`);

    t.equal(s4.count, 2240);
    t.equal(s5.hits.length, 1);
  });

  t.test("should correctly delete documents", t => {
    t.plan(1);

    const documentsToDelete = search(db, {
      term: "war",
      exact: true,
      properties: ["description"],
      limit: 10,
      offset: 0,
    });

    for (const doc of documentsToDelete.hits) {
      remove(db, doc.id);
    }

    const newSearch = search(db, {
      term: "war",
      exact: true,
      properties: ["description"],
      limit: 10,
      offset: 0,
    });

    t.equal(newSearch.count, 2230);
  });
});
