import t from 'tap'
import { boundedLevenshtein, levenshtein } from '../src/components/levenshtein.js'

t.test('levenshtein', (t) => {
  t.plan(3)

  t.test('should be 0 when both inputs are empty', (t) => {
    t.plan(1)

    t.equal(levenshtein('', ''), 0)
  })

  t.test('should be the max input length when either strings are empty', (t) => {
    t.plan(2)

    t.equal(levenshtein('', 'some'), 4)
    t.equal(levenshtein('body', ''), 4)
  })

  t.test('some examples', (t) => {
    t.plan(5)

    t.equal(levenshtein('aa', 'b'), 2)
    t.equal(levenshtein('b', 'aa'), 2)
    t.equal(levenshtein('somebody once', 'told me'), 9)
    t.equal(levenshtein('the world is gonna', 'roll me'), 15)
    t.equal(levenshtein('kaushuk chadhui', 'caushik chakrabar'), 8)
  })
})

t.test('boundedLevenshtein', (t) => {
  t.plan(4)

  t.test('should be 0 when both inputs are empty', async (t) => {
    t.plan(2)

    t.match(await boundedLevenshtein('', '', 0), { distance: 0, isBounded: true })
    t.match(await boundedLevenshtein('', '', 1), { distance: 0, isBounded: true })
  })

  t.test('should be the max input length when either strings are empty', async (t) => {
    t.plan(2)

    t.match(await boundedLevenshtein('', 'some', 4), { distance: 4, isBounded: true })
    t.match(await boundedLevenshtein('body', '', 4), { distance: 4, isBounded: true })
  })

  t.test('distance should be the same as levenshtein, when tolerance is high enough', async (t) => {
    t.plan(5)

    const tol = 15

    t.equal(levenshtein('aa', 'b'), (await boundedLevenshtein('aa', 'b', tol)).distance)
    t.equal(levenshtein('b', 'aa'), (await boundedLevenshtein('bb', 'a', tol)).distance)
    t.equal(
      levenshtein('somebody once', 'told me'),
      (await boundedLevenshtein('somebody once', 'told me', tol)).distance
    )
    t.equal(
      levenshtein('the world is gonna', 'roll me'),
      (await boundedLevenshtein('the world is gonna', 'roll me', tol)).distance
    )
    t.equal(
      levenshtein('kaushuk chadhui', 'caushik chakrabar'),
      (await boundedLevenshtein('kaushuk chadhui', 'caushik chakrabar', tol)).distance
    )
  })

  t.test('should tell whether the Levenshtein distance is upperbounded by a given tolerance', async (t) => {
    t.plan(2)

    t.match(await boundedLevenshtein('somebody once', 'told me', 9), { isBounded: true })
    t.match(await boundedLevenshtein('somebody once', 'told me', 8), { isBounded: false })
  })
})
