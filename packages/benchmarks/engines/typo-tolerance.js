import cronometro from "cronometro";
import { readFile } from "fs/promises";
import { create, insert, search } from "@nearform/lyra";
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
  ['Lyra typo-tolerant search. Searching "confonderi" in Divina Commedia, "txt" index']() {
    return search(db, {
      term: "confonderi",
      properties: ["txt"],
      exact: true,
      tolerance: 1,
    });
  },
  ['Lyra typo-tolerant search. Searching "confondersi" in Divina Commedia all indexes']() {
    return search(db, { term: "confondersi", exact: true, tolerance: 2 });
  },
};

cronometro(testCases);

export default testCases;
