/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/lyra.test.ts TAP checkInsertDocSchema should compare the inserted doc with the schema definition > should compare the inserted doc with the schema definition - 1 1`] = `
Error: Invalid document structure. 
Lyra has been initialized with the following schema: 

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

exports[`tests/lyra.test.ts TAP defaultLanguage should throw an error if the desired language is not supported > should throw an error if the desired language is not supported 1`] = `
Error: Language "latin" is not supported.
Supported languages are:
 - arabic
 - armenian
 - dutch
 - english
 - french
 - greek
 - indonesian
 - italian
 - irish
 - indian
 - lithuanian
 - nepali
 - norwegian
 - portuguese
 - russian
 - spanish
 - swedish
 - german
 - finnish
 - danish
 - hungarian
 - romanian
 - serbian
 - turkish
`

exports[`tests/lyra.test.ts TAP defaultLanguage should throw an error if the desired language is not supported during insertion > should throw an error if the desired language is not supported during insertion 1`] = `
Error: Language "latin" is not supported.
Supported languages are:
 - arabic
 - armenian
 - dutch
 - english
 - french
 - greek
 - indonesian
 - italian
 - irish
 - indian
 - lithuanian
 - nepali
 - norwegian
 - portuguese
 - russian
 - spanish
 - swedish
 - german
 - finnish
 - danish
 - hungarian
 - romanian
 - serbian
 - turkish
`

exports[`tests/lyra.test.ts TAP lyra - hooks should validate on lyra creation > must match snapshot 1`] = `
Error: The following hooks aren't supported. Hooks: anotherHookName
`

exports[`tests/lyra.test.ts TAP lyra Should throw an error when searching in non-existing indices > must match snapshot 1`] = `
Error: Invalid property name. Expected a wildcard string ("*") or array containing one of the following properties: foo, baz, but got: bar
`
