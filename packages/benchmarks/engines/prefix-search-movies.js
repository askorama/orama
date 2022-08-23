import fs from "fs";
import cronometro from "cronometro";
import readline from "readline";
import { create, insert, search } from "@lyrasearch/lyra";
import { isMainThread } from "node:worker_threads";

let db;

if (!isMainThread) {
  db = create({
    schema: {
      type: "string",
      title: "string",
      category: "string",
    },
  });

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
}

const testCases = {
  [`Searching "believe" through 1M entries in all indices:`]() {
    return search(db, { term: "believe" });
  },
  [`Searching "believe" through 1M entries in "title" index:`]() {
    return search(db, { term: "believe", properties: ["title"] });
  },
  [`Searching "criminal minds" through 1M entries in the "title" index`]() {
    return search(db, {
      term: "criminal minds",
      properties: ["title"],
    });
  },
  [`Searching "musical" through 1M entries in the "category" index`]() {
    return search(db, {
      term: "musical",
      properties: ["category"],
    });
  },
  [`Searching "hero" through 1M entries in the "title" index`]() {
    return search(db, {
      term: "hero",
      properties: ["title"],
    });
  },
};

cronometro(testCases);

export default testCases;
