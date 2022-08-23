import * as fs from "node:fs";
import * as readline from "node:readline";
import * as util from "node:util";
import { create, insert, search } from "@lyrasearch/lyra";
import yargs from "yargs";
import progress from "cli-progress";

const db = create({
  schema: {
    type: "string",
    title: "string",
    category: "string",
  },
});

async function populateDB() {
  let elementCounts = 0;
  const bar = new progress.SingleBar({}, progress.Presets.shades_classic);

  const fileStream = fs.createReadStream("./dataset/title.tsv");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  bar.start(1_000_000, 0);

  for await (const row of rl) {
    const [, type, title, , , , , , category] = row.split("\t");

    insert(db, {
      type,
      title,
      category,
    });
    bar.update(elementCounts++);
  }

  bar.stop();
}

function log(cmd: string | object) {
  console.log(util.inspect(cmd, true, null, true));
}

function parseCommand(cmd: string) {
  const y = yargs(cmd as unknown as string[]);

  return y
    .option("populate", {
      alias: "p",
      describe: "Populate the database",
    })
    .option("search", {
      alias: "s",
      describe: "Search the database",
      type: "string",
      demandOption: true,
    })
    .option("limit", {
      alias: "l",
      describe: "Limit the number of results",
      type: "number",
    })
    .option("offset", {
      alias: "o",
      describe: "Offset the results",
      type: "number",
    })
    .option("exact", {
      alias: "e",
      describe: "Search for an exact match",
      type: "boolean",
    })
    .option("tolerance", {
      alias: "t",
      describe: "Tolerance for fuzzy search",
      type: "number",
    }).argv;
}

console.clear();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
  prompt: "> ",
});

rl.on("line", async (cmd: string) => {
  const parsed = await parseCommand(cmd);

  if (parsed.populate) {
    await populateDB();
    return;
  }

  const searchResult = search(db, {
    term: parsed.search,
    limit: parsed.limit ?? 10,
    offset: parsed.offset ?? 0,
    exact: parsed.exact,
    tolerance: parsed.tolerance ?? 0,
  });

  log(searchResult);
});
