import readline from "readline";
import { Lyra } from "@nearform/lyra";
import dataset from "./datasets/reviews.json";
import { commands } from "./commands";

type Dataset = {
  "": string;
  Rating: string;
  "Review Text": string;
  "Division Name": string;
  Title: string;
  "Recommended IND": string;
  Age: string;
  "Department Name": string;
  "Class Name": string;
  "Positive Feedback Count": string;
  "Clothing ID": string;
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const db = new Lyra({
  schema: {
    rating: "string",
    review: "string",
    title: "string",
  },
});

async function load() {
  for (const data of dataset as Dataset[]) {
    await db.insert({
      rating: data.Rating,
      review: data["Review Text"],
      title: data.Title,
    });
  }
}

async function parseLine(input: string) {
  const cmd = await commands(input);
  const tokens = (cmd as any).text.join(", ");

  const properties = cmd.properties === "*" ? "*" : cmd.properties.split(",");

  const result = await db.search({
    term: tokens,
    limit: cmd.limit,
    offset: cmd.offset,
    properties,
  });

  console.log(result);
}

async function start() {
  console.log("loading dataset...");
  await load();
  console.log(`${(dataset as any[]).length} reviews loaded`);

  rl.on("line", parseLine);
}

start();
