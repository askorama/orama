import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";

const pkg = JSON.parse(Deno.readTextFileSync("./package.json"));

await emptyDir("./dist");

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./dist",
  shims: {
    deno: false,
  },
  scriptModule: 'cjs',
  test: false,
  typeCheck: false,
  declaration: true,
  package: pkg,
  packageManager: "pnpm",
  postBuild() {
    Deno.copyFileSync("LICENSE.md", "dist/LICENSE.md");
    Deno.copyFileSync("README.md", "dist/README.md");
  },
});