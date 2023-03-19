module.exports = {
  env: {
    node: true,
    browser: true
  },
  parserOptions: {
    project: 'tsconfig.test.json',
    sourceType: 'module'
  },
  globals: {
    Deno: 'readonly'
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['import'],
  extends: ['plugin:import/typescript', 'standard-with-typescript'],
  rules: {
    'import/extensions': [2, 'always', { ignorePackages: true }], // This is required for proper ESM use
    'no-async-promise-executor': 0,
    'space-before-function-paren': 0, // This is inserted to make this compatible with prettier.
    '@typescript-eslint/return-await': 0,
    '@typescript-eslint/space-before-function-paren': 0, // This is inserted to make this compatible with prettier.
    '@typescript-eslint/strict-boolean-expressions': 0
  },
  overrides: [
    {
      files: ['test/**/*.ts'],
      rules: {
        '@typescript-eslint/no-floating-promises': 0,
        '@typescript-eslint/no-non-null-assertion': 0
      }
    },
    {
      files: ['test/ci/**/*.js'],
      parser: 'espree'
    }
  ]
}
