import t from 'tap'
import {
  create,
  insert,
  find,
  getSize,
  remove,
  contains,
  greaterThan,
  lessThan,
  rangeSearch
} from '../src/trees/zip.js'

t.test('ZIP Tree', async (t) => {
  t.test('create', async (t) => {
    const tree = create(1, 'foo')
    t.equal(getSize(tree), 1)
    t.equal(find(tree, 1), 'foo')
    t.equal(find(tree, 4), null)
  })

  t.test('insert', async (t) => {
    const tree = create(1, 'foo')

    insert(tree, 2, 'bar')
    insert(tree, 10, 'baz')
    insert(tree, 25, 'qux')
    insert(tree, 5, 'quux')
    insert(tree, 20, 'quuz')
    insert(tree, 12, 'corge')

    t.equal(getSize(tree), 7)
  })

  t.test('find', async (t) => {
    const tree = create(1, [1, 2, 3])

    insert(tree, 2, [4, 5, 6])
    insert(tree, 10, [7, 8, 9])
    insert(tree, 25, [10, 11, 12])
    insert(tree, 5, [13, 14, 15])
    insert(tree, 20, [16, 17, 18])
    insert(tree, 12, [19, 20, 21])

    t.same(contains(tree, 20), true)
    t.same(find(tree, 20), [16, 17, 18])
  })

  t.test('remove', async (t) => {
    const tree = create(1, 'foo')

    insert(tree, 2, 'bar')
    insert(tree, 10, 'baz')
    insert(tree, 25, 'qux')
    insert(tree, 5, 'quux')
    insert(tree, 20, 'quuz')
    insert(tree, 12, 'corge')

    remove(tree, 20)

    t.equal(getSize(tree), 6)
    t.equal(contains(tree, 20), false)
  })

  t.test('rangeSearch', async (t) => {
    const tree = create(1, 'foo')

    insert(tree, 2, 'bar')
    insert(tree, 10, 'baz')
    insert(tree, 25, 'qux')
    insert(tree, 5, 'quux')
    insert(tree, 20, 'quuz')
    insert(tree, 12, 'corge')

    t.same(rangeSearch(tree, 5, 20), ['quux', 'baz', 'corge', 'quuz'])
  })

  t.test('greaterThan', async (t) => {
    const tree = create(1, 'foo')

    insert(tree, 2, 'bar')
    insert(tree, 10, 'baz')
    insert(tree, 25, 'qux')
    insert(tree, 5, 'quux')
    insert(tree, 20, 'quuz')
    insert(tree, 12, 'corge')

    t.same(greaterThan(tree, 10), ['corge', 'quuz', 'qux'])
  })

  t.test('lessThan', async (t) => {
    const tree = create(1, 'foo')

    insert(tree, 2, 'bar')
    insert(tree, 10, 'baz')
    insert(tree, 25, 'qux')
    insert(tree, 5, 'quux')
    insert(tree, 20, 'quuz')
    insert(tree, 12, 'corge')

    t.same(lessThan(tree, 10), ['foo', 'bar', 'quux'])
  })
})
