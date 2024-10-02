import t from 'tap'
import {
  create,
  insert,
  find,
  getSize,
  remove,
  contains,
  isBalanced,
  greaterThan,
  lessThan,
  rangeSearch
} from '../src/trees/avl.js'

t.test('AVL Tree', async (t) => {
  t.test('create', async (t) => {
    const tree = create(1, 'foo', false)
    t.equal(getSize(tree), 1)
    t.equal(find(tree, 1), 'foo')
    t.equal(find(tree, 4), null)
  })

  t.test('insert', async (t) => {
    const tree = create(1, ['foo'], false)

    insert(tree, 2, 'bar')
    insert(tree, 10, 'baz')
    insert(tree, 25, 'qux')
    insert(tree, 5, 'quux')
    insert(tree, 20, 'quuz')
    insert(tree, 12, 'corge')

    t.equal(getSize(tree), 7)
  })

  t.test('isBalanced', async (t) => {
    const tree = create(1, [{ foo: 'bar' }], false)

    insert(tree, 2, { foo: 'baz' })
    insert(tree, 10, { foo: 'qux' })
    insert(tree, 25, { foo: 'quux' })
    insert(tree, 5, { foo: 'quuz' })
    insert(tree, 20, { foo: 'corge' })
    insert(tree, 12, { foo: 'grault' })
    insert(tree, 15, { foo: 'garply' })
    insert(tree, 30, { foo: 'waldo' })
    insert(tree, 40, { foo: 'fred' })
    insert(tree, 520, { foo: 'plugh' })
    insert(tree, 630, { foo: 'xyzzy' })
    insert(tree, 3, { foo: 'thud' })
    insert(tree, 480, { foo: 'thuds' })

    t.equal(isBalanced(tree), true)
  })

  t.test('find', async (t) => {
    const tree = create(1, [1, 2, 3], false)

    insert(tree, 2, 4)
    insert(tree, 2, 5)
    insert(tree, 2, 6)
    insert(tree, 10, 7)
    insert(tree, 10, 8)
    insert(tree, 10, 9)
    insert(tree, 25, 10)
    insert(tree, 25, 11)
    insert(tree, 25, 12)
    insert(tree, 5, 13)
    insert(tree, 5, 14)
    insert(tree, 5, 15)
    insert(tree, 20, 16)
    insert(tree, 20, 17)
    insert(tree, 20, 18)
    insert(tree, 12, 19)
    insert(tree, 12, 20)
    insert(tree, 12, 21)

    t.same(contains(tree, 20), true)
    t.same(find(tree, 20), [16, 17, 18])
  })

  t.test('remove', async (t) => {
    const tree = create(1, ['foo'], false)

    insert(tree, 2, 'bar')
    insert(tree, 10, 'baz')
    insert(tree, 25, 'qux')
    insert(tree, 5, 'quux')
    insert(tree, 20, 'quuz')
    insert(tree, 12, 'corge')

    remove(tree, 20)

    t.equal(getSize(tree), 6)
    t.equal(contains(tree, 20), false)
    t.equal(isBalanced(tree), true)
  })

  t.test('rangeSearch', async (t) => {
    const tree = create(1, ['foo'], false)

    insert(tree, 2, 'bar')
    insert(tree, 10, 'baz')
    insert(tree, 25, 'qux')
    insert(tree, 5, 'quux')
    insert(tree, 20, 'quuz')
    insert(tree, 12, 'corge')

    t.same(rangeSearch(tree, 5, 20), ['quux', 'baz', 'corge', 'quuz'])
  })

  t.test('greaterThan', async (t) => {
    const tree = create(1, ['foo'], false)

    insert(tree, 2, 'bar')
    insert(tree, 10, 'baz')
    insert(tree, 25, 'qux')
    insert(tree, 5, 'quux')
    insert(tree, 20, 'quuz')
    insert(tree, 12, 'corge')

    t.same(greaterThan(tree, 10), ['qux', 'quuz', 'corge'])
  })

  t.test('lessThan', async (t) => {
    const tree = create(1, ['foo'], false)

    insert(tree, 2, 'bar')
    insert(tree, 10, 'baz')
    insert(tree, 25, 'qux')
    insert(tree, 5, 'quux')
    insert(tree, 20, 'quuz')
    insert(tree, 12, 'corge')

    t.same(lessThan(tree, 10), ['foo', 'bar', 'quux'])
  })
})
