import cronometro from "cronometro";
import { readFile } from "fs/promises";
import { create, insert } from "@lyrasearch/lyra";
import { URL } from "node:url";

const lines = JSON.parse(await readFile(new URL("../dataset/divinaCommedia.json", import.meta.url).pathname));

const testCases = {
  ['Indexing Divina Commedia, "id" and "txt" indexes']() {
    const db = create({
      schema: {
        id: "string",
        txt: "string",
      },
    });

    for (const line of lines) {
      insert(db, line);
    }
  },
  ['Indexing Divina Commedia, "txt" index only']() {
    const db = create({
      schema: {
        txt: "string",
      },
    });

    for (const { txt } of lines) {
      insert(db, { txt });
    }
  },
};

cronometro(testCases);

export default testCases;
