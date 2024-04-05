/* global globalThis */

import tape from 'tape'
import { has, strict } from 'tcompare'
import { files } from '../../dist/test/_tests.js'

/* Compatibility with Tap */
tape.Test.prototype.strictSame = function _strictSame(a, b, msg, extra) {
  this._assert(strict(a, b), {
    message: msg ?? 'should be same',
    operator: '===',
    expected: b,
    actual: a,
    extra
  })
}

tape.Test.prototype.has = function _has(a, b, msg, extra) {
  this._assert(has(a, b), {
    message: msg ?? 'should contain all provided fields',
    operator: '===',
    expected: b,
    actual: a,
    extra
  })
}

tape.Test.prototype.match = function _match(a, b, msg, extra) {
  this._assert(has(a, b), {
    message: msg ?? 'should match pattern provided',
    operator: '===',
    expected: b,
    actual: a,
    extra
  })
}

tape.Test.prototype.rejects = function (promise, expected, message = 'should reject', extra) {
  if (typeof promise === 'function') promise = promise()
  return promise
    .then(() => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this.throws(() => {}, expected, message, extra)
    })
    .catch((err) => {
      this.throws(
        () => {
          throw err
        },
        expected,
        message,
        extra
      )
    })
}

tape.Test.prototype.type = function _type(a, b, msg, extra) {
  // eslint-disable-next-line valid-typeof
  this._assert(typeof a === b, {
    message: msg ?? 'should be of type',
    operator: 'ok',
    expected: b,
    actual: typeof a,
    extra
  })
}

function createTestContext(name, parent, level) {
  return { name, parent, level, subtests: [], failed: false, started: false }
}

function pad(level, additional = 0) {
  return ''.padStart(level * 4 + additional, ' ')
}

function padString(string, level, additional = 0) {
  const prefix = pad(level, additional)

  return string.replaceAll(/(^.)/gm, `${prefix}$1`)
}

const stream = tape.createStream({ objectMode: true })

let currentTest = -1

const tests = {
  [-1]: createTestContext('$', -1, -1)
}

console.log('TAP version 13')

stream.on('data', function (row) {
  switch (row.type) {
    case 'test':
      {
        const parent = row.parent ?? -1

        if (parent !== -1 && !tests[parent].started) {
          tests[parent].started = true
          console.log(`${pad(tests[parent].level)}# Subtest: ${tests[parent].name}`)
        }

        const newTest = createTestContext(row.name, parent, tests[parent].level + 1)
        newTest.index = tests[parent].subtests.length
        tests[parent].subtests.push(row.id)
        tests[row.id] = newTest
        currentTest = row.id
      }
      break
    case 'assert':
      {
        const test = tests[currentTest]

        if (!test.started) {
          tests[currentTest].started = true
          console.log(`${pad(test.level)}# Subtest: ${test.name}`)
        }

        tests[currentTest].subtests.push(row)

        if (!row.ok) {
          tests[currentTest].failed = true
        }

        console.log(
          `${pad(test.level + 1)}${row.ok ? 'ok' : 'not ok'} ${row.id + 1} - ${
            row.error ? row.error.message : row.name
          }`
        )

        if (row.error) {
          console.log(
            padString(`---\nstack: |\n${row.error.stack.replaceAll(/(^.)/gm, '  $1')}\n...`, test.level + 1, 2)
          )
        }
      }
      break
    case 'end':
      {
        const test = tests[currentTest]

        if (test.failed) {
          tests[test.parent].failed = true
        }

        console.log(`${pad(test.level + 1)}1..${test.subtests.length}`)
        console.log(`${pad(test.level)}${test.failed ? 'not ok' : 'ok'} ${test.index + 1} - ${test.name}\n`)

        currentTest = tests[currentTest].parent
      }
      break
  }
})

for (const file of files) {
  tape.test(file.replace('../../dist/', '').replace('.js', '.ts'), async (t) => {
    globalThis.t = t

    await import(file)
  })
}

tape.getHarness().onFinish(() => {
  const total = tests[-1].subtests.length
  const failed = tests[-1].subtests.filter((t) => tests[t].failed).length

  console.log(`1..${total}`)
  console.log(`# tests ${total}`)
  console.log(`# pass  ${total - failed}`)
  console.log(`# fail  ${failed}`)
})
