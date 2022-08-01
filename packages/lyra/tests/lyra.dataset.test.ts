import t from "tap";
import { create, insert, search, SearchResult } from "../src/lyra";
import dataset from "./datasets/events.json";

function removeVariadicData(res: SearchResult<any>): SearchResult<any> {
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

for (const event of (dataset as any).result.events) {
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

t.test("lyra.dataset", async t => {
  t.plan(2);

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
});
