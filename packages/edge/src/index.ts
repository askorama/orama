import fs from "fs/promises";
import { serialize, deserialize } from "v8";
import { Lyra } from "@nearform/lyra";

async function main() {
  const lyra = new Lyra({
    schema: {
      name: "string",
      age: "number",
      job: "string",
    },
    edge: true,
  });

  await lyra.insert({
    name: "Michele",
    age: 27,
    job: "Senior Software Architect",
  });

  await lyra.insert({
    name: "Paolo",
    age: 37,
    job: "Staff Developer Experience Engineer",
  });

  await lyra.insert({
    name: "John",
    age: 18,
    job: "Junior Software Engineer",
  });

  console.log(lyra.getIndex);

  /*
  const serialized = serialize({
    index: lyra.getIndex,
    docs: lyra.getDocs,
  });

  await fs.writeFile('./lyra.v8', serialized);

  const deserialized = deserialize(await fs.readFile('./lyra.v8'));

  const newLyra = new Lyra({
    schema: {
      name: "string",
      age: "number",
      job: "string",
    },
    edge: true,
  });

  newLyra.setIndex = deserialized.index;
  newLyra.setDocs = deserialized.docs;

  console.log(await newLyra.search({
    term: "Engineer",
  }));
  */
}

main();
