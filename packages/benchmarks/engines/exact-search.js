import cronometro from "cronometro";
import { readFile } from "fs/promises";
import { create, insert, search } from "@lyrasearch/lyra";
import { URL } from "node:url";
import { isMainThread } from "node:worker_threads";

let db;

if (!isMainThread) {
  const lines = JSON.parse(await readFile(new URL("../dataset/divinaCommedia.json", import.meta.url).pathname));

  db = create({
    schema: {
      id: "string",
      txt: "string",
    },
  });

  for (const line of lines) {
    insert(db, line);
  }
}

const testCases = {
  ['Lyra exact search. Searching "comandamento" in Divina Commedia, "txt" index']() {
    return search(db, {
      term: "comandamento",
      properties: ["txt"],
      exact: true,
    });
  },
  ['Lyra exact search. Searching "incominciai" in Divina Commedia all indexes']() {
    return search(db, { term: "incominciai", exact: true });
  },
};

cronometro(testCases);

export default testCases;
