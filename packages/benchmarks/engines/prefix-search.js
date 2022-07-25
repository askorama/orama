import cronometro from "cronometro";
import {readFile} from 'fs/promises';
import { Lyra } from "@nearform/lyra";
import { URL } from 'node:url';

const lines = JSON.parse(await readFile(new URL("../dataset/divinaCommedia.json", import.meta.url).pathname))

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
  ['Lyra prefix search. Searching "vir" in Divina Commedia, "txt" index']() {
    return db.search({ term: "vir", properties: ["txt"] });
  },
  ['Lyra prefix search. Searching "virtut" in Divina Commedia, "txt" index']() {
    return db.search({ term: "virtut", properties: ["txt"] });
  },
  ['Lyra prefix search. Searching "vir" in Divina Commedia all indexes']() {
    return db.search({ term: "vir" });
  },
  ['Lyra prefix search. Searching "virtut" in Divina Commedia all indexes']() {
    return db.search({ term: "virtut" });
  },
};

cronometro(testCases);

export default testCases;
