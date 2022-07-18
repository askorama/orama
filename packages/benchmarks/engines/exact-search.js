import cronometro from "cronometro";
import { Lyra } from "@nearform/lyra";
import lines from "../dataset/divinaCommedia.json" assert { type: "json" };

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
