/*global console*/

import fs from "fs";
import cronometro from "cronometro";
import { parse } from "csv-parse";
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

await populateDB();

const testCases = {
  [`Searching "believe" through 1M entries in all indices:`]() {
    return db.search({ term: "believe" });
  },
  [`Searching "believe" through 1M entries in "title" index:`]() {
    return db.search({ term: "believe", properties: ["title"] });
  },
  [`Searching "criminal minds" through 1M entries in the "title" index`]() {
    return db.search({
      term: "criminal minds",
      properties: ["title"],
    });
  },
  [`Searching "musical" through 1M entries in the "category" index`]() {
    return db.search({
      term: "musical",
      properties: ["category"],
    });
  },
  [`Searching "hero" through 1M entries in the "title" index`]() {
    return db.search({
      term: "hero",
      properties: ["title"],
    });
  },
};

cronometro(testCases);

export default testCases;
