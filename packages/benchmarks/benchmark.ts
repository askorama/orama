import fs from "fs";
import { parse } from "csv-parse";
import { Lyra, SearchParams } from "@nearform/lyra/src/lyra";

const db = new Lyra({
  schema: {
    type: "string",
    title: "string",
    category: "string",
  },
});

function populateDB() {
  console.log("Populating the database...");
  return new Promise((resolve) => {
    fs.createReadStream("./dataset/title.csv")
      .pipe(parse({ delimiter: ";", from_line: 2 }))
      .on("data", (row) => {
        const [, type, title, , , , , , category] = row;

        db.insert({
          type,
          title,
          category,
        });
      })
      .on("end", () => {
        console.log("Database ready");
        resolve(1);
      });
  });
}

async function main() {
  await populateDB();

  console.log("--------------------------------");
  console.log("Results after 100.000 iterations");
  console.log("--------------------------------");

  const searchOnAllIndices = await searchBenchmark(db, {
    term: "believe",
    properties: "*",
  });
  console.log(
    `Searching "believe" through 1M entries in all indices: ${searchOnAllIndices}`
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

async function searchBenchmark(db: Lyra, query: SearchParams) {
  const results = Array.from({ length: 100_000 });

  for (let i = 0; i < results.length; i++) {
    const { elapsed } = await db.search(query);

    const isMicrosecond = elapsed.endsWith("μs");
    const timeAsStr = isMicrosecond
      ? elapsed.replace("ms", "")
      : elapsed.replace("μs", "");
    const time = parseInt(timeAsStr) * (isMicrosecond ? 1 : 1000);
    results[i] = time;
  }

  const total = Math.floor(
    (results as number[]).reduce((x, y) => x + y, 0) / results.length
  );

  return total > 1000 ? `${total}ms` : `${total}μs`;
}

main();
