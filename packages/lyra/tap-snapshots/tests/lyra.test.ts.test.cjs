/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/lyra.test.ts TAP checkInsertDocSchema should compare the inserted doc with the schema definition > should compare the inserted doc with the schema definition - 1 1`] = `
Error: Invalid document structure. 
Class has been initialized with the following schema: 

{
  "quote": "string",
  "author": "string"
}

but found the following doc:

{
  "quote": "hello, world!",
  "author": true
}
`

exports[`tests/lyra.test.ts TAP checkInsertDocSchema should compare the inserted doc with the schema definition > should compare the inserted doc with the schema definition - 2 1`] = `
Error: Invalid document structure. 
Class has been initialized with the following schema: 

{
  "quote": "string",
  "author": "string"
}

but found the following doc:

{
  "quote": "hello, world!",
  "authors": "author should be singular"
}
`

exports[`tests/lyra.test.ts TAP checkInsertDocSchema should compare the inserted doc with the schema definition > should compare the inserted doc with the schema definition - 3 1`] = `
Error: Invalid document structure. 
Class has been initialized with the following schema: 

{
  "quote": "string",
  "author": "string"
}

but found the following doc:

{
  "quote": "hello, world!",
  "foo": {
    "bar": 10
  }
}
`

exports[`tests/lyra.test.ts TAP defaultLanguage should throw an error if the desired language is not supported > should throw an error if the desired language is not supported 1`] = `
Error: Language "latin" is not supported.
Supported languages are:
 - dutch
 - english
 - french
 - italian
 - norwegian
 - portuguese
 - russian
 - spanish
 - swedish
`

exports[`tests/lyra.test.ts TAP defaultLanguage should throw an error if the desired language is not supported during insertion > should throw an error if the desired language is not supported during insertion 1`] = `
Error: Language "latin" is not supported.
Supported languages are:
 - dutch
 - english
 - french
 - italian
 - norwegian
 - portuguese
 - russian
 - spanish
 - swedish
`
