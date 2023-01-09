module.exports = {
  env: {
    node: true,
    browser: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  globals: {
    Deno: "readonly",
  },
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "import/extensions": [2, "always", { ignorePackages: true }], // This is required for proper ESM use
    "@typescript-eslint/no-non-null-assertion": 0,
    "no-async-promise-executor": 0,
  },
};
