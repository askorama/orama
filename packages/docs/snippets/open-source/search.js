// @ts-nocheck

// #region properties
const searchResult = await search(movieDB, {
  term: "Chris",
  properties: ["director"],
});
// #endregion properties

// #region nested-properties
const searchResult = await search(movieDB, {
  term: "Chris",
  properties: ["cast.director"],
});
// #endregion nested-properties

// #region exact
const searchResult = await search(movieDB, {
  term: "Chris",
  properties: ["director"],
  exact: true,
});
// #endregion exact

// #region tolerance
const searchResult = await search(movieDB, {
  term: "Chris",
  properties: ["director"],
  tolerance: 1,
});
// #endregion tolerance

// #region limit
const searchResult = await search(movieDB, {
  term: "Chris",
  properties: ["director"],
  limit: 1,
});
// #endregion limit

// #region offset
const searchResult = await search(movieDB, {
  term: "Chris",
  properties: ["director"],
  offset: 1,
});
// #endregion offset

// #region distinct
const results = await search(db, {
  distinctOn: "type",
  sortBy: {
    property: "rank",
    order: "DESC",
  },
});
// #endregion distinct

// #region bm25
const searchResult = await search(movieDB, {
  term: "Chris",
  properties: ["director"],
  relevance: {
    // Term frequency saturation parameter.
    // Default value: 1.2
    // Recommended value: between 1.2 and 2
    k: 1.2,

    // Length normalization parameter.
    // Default value: 0.75
    // Recommended value: > 0.75
    b: 0.75,

    // Frequency normalization lower bound.
    // Default value: 0.5
    // Recommended value: between 0.5 and 1
    d: 0.5,
  },
});
// #endregion bm25

// #region preflight
import { create, insert, search } from "@orama/orama";

const db = await create({
  schema: {
    title: "string",
  },
});

await insert(db, { title: "Red headphones" });
await insert(db, { title: "Green headphones" });
await insert(db, { title: "Blue headphones" });
await insert(db, { title: "Yellow headphones" });

const results = await search(db, {
  term: "headphones",
  preflight: true,
});

console.log(results);

// {
//   elapsed: {
//     raw: 181208,
//     formatted: '181μs'
//   }
//   hits: []
//   count: 4
// }
// #endregion preflight
