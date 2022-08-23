/*global console, process */

import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import readline from "readline";
import { create, save, load, insert, search } from "@lyrasearch/lyra";
import dpack from "dpack";
import { formatNanoseconds } from "@lyrasearch/lyra";

const db = create({
  schema: {
    type: "string",
    title: "string",
    category: "string",
  },
  edge: true,
});

async function populateDB() {
  console.log("Populating the database...");

  const fileStream = fs.createReadStream("./dataset/title.tsv");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const row of rl) {
    const [, type, title, , , , , , category] = row.split("\t");

    insert(db, {
      type,
      title,
      category,
    });
  }

  const data = save(db);

  console.time("Serializing");
  await writeFile("./dataset/database.dpack", dpack.serialize(data));
  console.timeEnd("Serializing");
}

async function restoreDB() {
  console.log("Restoring the database...");

  console.time("Deserializing");
  const serialized = dpack.parseLazy(await readFile("./dataset/database.dpack"));
  console.timeEnd("Deserializing");

  load(db, serialized);
}

async function main() {
  if (process.env.RESTORE === "true") {
    await restoreDB();
  } else {
    await populateDB();
  }

  console.log("--------------------------------");
  console.log("Results after 1000 iterations");
  console.log("--------------------------------");

  const searchOnAllIndices = searchBenchmark(db, {
    term: "believe",
    properties: "*",
  });
  console.log(`Searching "believe" through 1M entries in all indices: ${searchOnAllIndices}`);

  const exactSearchOnAllIndices = searchBenchmark(db, {
    term: "believe",
    properties: "*",
    exact: true,
  });
  console.log(`Exact search for "believe" through 1M entries in all indices: ${exactSearchOnAllIndices}`);

  const typoTolerantSearch = searchBenchmark(db, {
    term: "belve",
    properties: "*",
    tolerance: 2,
  });
  console.log(`Typo-tolerant search for "belve" through 1M entries in all indices: ${typoTolerantSearch}`);

  const searchOnSpecificIndex = searchBenchmark(db, {
    term: "believe",
    properties: ["title"],
  });
  console.log(`Searching "believe" through 1M entries in the "title" index: ${searchOnSpecificIndex}`);

  const searchOnSpecificIndex2 = searchBenchmark(db, {
    term: "criminal minds",
    properties: ["title"],
  });
  console.log(`Searching "criminal minds" through 1M entries in the "title" index: ${searchOnSpecificIndex2}`);

  const searchOnSpecificIndex3 = searchBenchmark(db, {
    term: "musical",
    properties: ["category"],
    exact: true,
  });
  console.log(`Searching "musical" through 1M entries in the "category" index: ${searchOnSpecificIndex3}`);

  const searchOnSpecificIndex4 = searchBenchmark(db, {
    term: "hero",
    properties: ["title"],
  });
  console.log(`Searching "hero" through 1M entries in the "title" index: ${searchOnSpecificIndex4}`);
}

function searchBenchmark(db, query) {
  const results = Array.from({ length: 1000 });

  for (let i = 0; i < results.length; i++) {
    results[i] = search(db, query);
  }

  const time = Math.floor(Number(results.reduce((accu, result) => accu + result.elapsed, 0n)) / results.length);
  const counts = new Set(results.map(result => result.count));

  if (counts.size > 1) {
    throw new Error(`The benchmark is not reliable. Different counts returned in results: ${Array.from(counts)}`);
  }

  return `${Array.from(counts)[0]} results in ${formatNanoseconds(time)}`;
}

main();
