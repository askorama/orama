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
  ['Lyra prefix search. Searching "vir" in Divina Commedia, "txt" index']() {
    return search(db, { term: "vir", properties: ["txt"] });
  },
  ['Lyra prefix search. Searching "virtut" in Divina Commedia, "txt" index']() {
    return search(db, { term: "virtut", properties: ["txt"] });
  },
  ['Lyra prefix search. Searching "vir" in Divina Commedia all indexes']() {
    return search(db, { term: "vir" });
  },
  ['Lyra prefix search. Searching "virtut" in Divina Commedia all indexes']() {
    return search(db, { term: "virtut" });
  },
};

cronometro(testCases);

export default testCases;
