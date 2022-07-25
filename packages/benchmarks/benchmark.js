/*global console*/

import fs from "fs";
import readline from "readline";
import { Lyra } from "@nearform/lyra";

const db = new Lyra({
  schema: {
    type: "string",
    title: "string",
    category: "string",
  },
});

function populateDB() {
  console.log("Populating the database...");
  return new Promise(async (resolve) => {
    const fileStream = fs.createReadStream("./dataset/title.tsv");
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const row of rl) {
      const [, type, title, , , , , , category] = row.split("\t");

      db.insert({
        type,
        title,
        category,
      });
    }

    resolve(1);
  });
}

async function main() {
  await populateDB();

  console.log("--------------------------------");
  console.log("Results after 1000 iterations");
  console.log("--------------------------------");

  const searchOnAllIndices = await searchBenchmark(db, {
    term: "believe",
    properties: "*",
  });
  console.log(
    `Searching "believe" through 1M entries in all indices: ${searchOnAllIndices}`
  );

  const exactSearchOnAllIndices = await searchBenchmark(db, {
    term: "believe",
    properties: "*",
    exact: true,
  });
  console.log(
    `Exact search for "believe" through 1M entries in all indices: ${exactSearchOnAllIndices}`
  );

  const typoTolerantSearch = await searchBenchmark(db, {
    term: "belve",
    properties: "*",
    tolerance: 2,
  });
  console.log(
    `Typo-tolerant search for "belve" through 1M entries in all indices: ${typoTolerantSearch}`
  );

  const searchOnSpecificIndex = await searchBenchmark(db, {
    term: "believe",
    properties: ["title"],
  });
  console.log(
    `Searching "believe" through 1M entries in the "title" index: ${searchOnSpecificIndex}`
  );

  const searchOnSpecificIndex2 = await searchBenchmark(db, {
    term: "criminal minds",
    properties: ["title"],
  });
  console.log(
    `Searching "criminal minds" through 1M entries in the "title" index: ${searchOnSpecificIndex2}`
  );

  const searchOnSpecificIndex3 = await searchBenchmark(db, {
    term: "musical",
    properties: ["category"],
    exact: true,
  });
  console.log(
    `Searching "musical" through 1M entries in the "category" index: ${searchOnSpecificIndex3}`
  );

  const searchOnSpecificIndex4 = await searchBenchmark(db, {
    term: "hero",
    properties: ["title"],
  });
  console.log(
    `Searching "hero" through 1M entries in the "title" index: ${searchOnSpecificIndex4}`
  );
}

async function searchBenchmark(db, query) {
  const results = Array.from({ length: 1000 });

  for (let i = 0; i < results.length; i++) {
    const { elapsed, count } = await db.search(query);
    const isMicrosecond = elapsed.endsWith("μs");
    const timeAsStr = isMicrosecond
      ? elapsed.replace("ms", "")
      : elapsed.replace("μs", "");
    const time = parseInt(timeAsStr) * (isMicrosecond ? 1 : 1000);
    results[i] = [time, count];
  }

  const total = Math.floor(results[0].reduce((x, y) => x + y, 0) / results.length);
  const counts = Math.floor(results[1].reduce((x, y) => x + y, 0) / results.length);

  const time = total > 1000 ? `${total}ms` : `${total}μs`;

  return `${counts} results in ${time}`;
}

main();
