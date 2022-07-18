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
  ['Lyra typo-tolerant search. Searching "confonderi" in Divina Commedia, "txt" index']() {
    return db.search({
      term: "confonderi",
      properties: ["txt"],
      exact: true,
      tolerance: 1,
    });
  },
  ['Lyra typo-tolerant search. Searching "confondersi" in Divina Commedia all indexes']() {
    return db.search({ term: "confondersi", exact: true, tolerance: 2 });
  },
};

cronometro(testCases);

export default testCases;
