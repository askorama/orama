import cronometro from "cronometro";
import { readFile } from "fs/promises";
import { Lyra } from "@nearform/lyra";
import { URL } from "node:url";

const lines = JSON.parse(await readFile(new URL("../dataset/divinaCommedia.json", import.meta.url).pathname));

const db = new Lyra({
  schema: {
    id: "string",
    txt: "string",
  },
});

for (const line of lines) {
  await db.insert(line);
}

const testCases = {
  ['Lyra exact search. Searching "comandamento" in Divina Commedia, "txt" index']() {
    return db.search({
      term: "comandamento",
      properties: ["txt"],
      exact: true,
    });
  },
  ['Lyra exact search. Searching "incominciai" in Divina Commedia all indexes']() {
    return db.search({ term: "incominciai", exact: true });
  },
};

cronometro(testCases);

export default testCases;
