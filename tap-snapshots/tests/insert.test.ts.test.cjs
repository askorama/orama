/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`tests/insert.test.ts TAP insert should throw an error if the 'id' field is already taken > must match snapshot 1`] = `
Error: Document with ID "john-01" already exists.
`

exports[`tests/insert.test.ts TAP insert should throw an error if the 'id' field is not a string > must match snapshot 1`] = `
TypeError: "id" must be of type "string". Got "number" instead.
`
