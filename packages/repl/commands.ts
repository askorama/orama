import yargs from "yargs";

export function commands(input: string) {
  return yargs(input as unknown as string[])
    .command("search <text...>", "searches a text")
    .option("limit", {
      alias: "l",
      type: "number",
      default: 10,
    })
    .option("offset", {
      alias: "o",
      type: "number",
      default: 0,
    })
    .option("properties", {
      alias: "p",
      type: "string",
      default: "*",
    })
    .parse();
}
