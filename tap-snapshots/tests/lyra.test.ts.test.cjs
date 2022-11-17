/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/lyra.test.ts TAP checkInsertDocSchema should check for nested wrong schema properties > should check for nested wrong schema properties 1`] = `
Error: Invalid document structure. 
Lyra has been initialized with the following schema: 

{
  "quote": "string",
  "author": {
    "name": "string",
    "surname": "string"
  }
}

but found the following doc:

{
  "quote": "Nobody ever figures out what life is all about, and it doesn't matter. Explore the world. Nearly everything is really interesting if you go into it deeply enough.",
  "author": "Richard Feynman"
}
`

exports[`tests/lyra.test.ts TAP checkInsertDocSchema should check for non serializable document property > should check for non serializable document property 1`] = `
Error: Invalid document structure. 
Lyra has been initialized with the following schema: 

{
  "quote": "string",
  "author": {
    "name": "string",
    "surname": "string"
  }
}

but found the following doc:

{
  "quote": "I'll need some information first, Just the basic facts, Can you show me where it hurts?",
  "author": [
    "David Jon Gilmour",
    "Roger Waters"
  ]
}
`

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
