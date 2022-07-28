/* global console */

import {readFile} from 'fs/promises';
import { create, insert, search } from "@nearform/lyra";
import { URL } from 'node:url';

const lines = JSON.parse(await readFile(new URL("../dataset/divinaCommedia.json", import.meta.url).pathname))

const db = create({
  schema: {
    id: "string",
    txt: "string",
  },
});

for (const line of lines) {
  insert(db, line);
}

const d1 =  search(db, {
  term: "stelle",
  properties: ["txt"],
  exact: true,
});

const d2 =  search(db, {
  term: "stelle",
  exact: true,
});

const d3 =  search(db, {
  term: "stele",
  properties: "*",
  tolerance: 1,
});

const d4 =  search(db, {
  term: "onde si muovono a diversi porti",
  properties: "*",
  exact: true,
});

const d5 =  search(db, {
  term: "ode si mossero a divisi porte",
  properties: "*",
  tolerance: 5
});

const d6 =  search(db, {
  term: "ode si mossero a divisi porte",
  properties: ["txt"],
  tolerance: 5
});

const table = `
| Search             | Term                                  | Properties | Typo tolerance | Time Elapsed  | Results     |
|--------------------|---------------------------------------|------------|----------------|---------------|-------------|
| **Exact search**   | \`"stelle"\`                          | \`["txt"]\`| \`N/A\`        | ${d1.elapsed} | ${d1.count} |
| **Exact search**   | \`"stelle"\`                          | \`"*"\`    | \`N/A\`        | ${d2.elapsed} | ${d2.count} |
| **Typo tolerance** | \`"stele"\`                           | \`"*"\`    | \`1\`          | ${d3.elapsed} | ${d3.count} | 
| **Exact search**   | \`"onde si muovono a diversi porti"\` | \`"*"\`    | \`N/A\`        | ${d4.elapsed} | ${d4.count} | 
| **Typo tolerance** | \`"ode si mossero a divisi porte"\`   | \`"*"\`    | \`5\`          | ${d5.elapsed} | ${d5.count} | 
| **Typo tolerance** | \`"ode si mossero a divisi porte"\`   | \`["txt"]\`| \`5\`          | ${d6.elapsed} | ${d6.count} |
`;

const markdownContent = `
# Benchmakrs

The following is an automated benchmark performed on the [Divina Commedia](https://en.wikipedia.org/wiki/Divina_Commedia) dataset. <br />
You can find the full dataset [here](https://github.com/nearform/lyra/blob/main/packages/benchmarks/dataset/divinaCommedia.json).

# Results

${table}
`;

console.log(markdownContent);