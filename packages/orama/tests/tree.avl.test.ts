import t from 'tap'

import { AVLTree } from '../src/trees/avl.js'

t.only('AVL Tree', (t) => {
  t.plan(8)

  t.only('create', (t) => {
    t.plan(3)

    const tree = new AVLTree(1, 'foo')
    t.equal(tree.getSize(), 1)
    t.equal(tree.find(1), 'foo')
    t.equal(tree.find(4), null)
  })

  t.only('insert', (t) => {
    t.plan(1)

    const tree = new AVLTree(1, 'foo')

    tree.insert(2, 'bar')
    tree.insert(10, 'baz')
    tree.insert(25, 'qux')
    tree.insert(5, 'quux')
    tree.insert(20, 'quuz')
    tree.insert(12, 'corge')

    t.equal(tree.getSize(), 7)
  })

  t.only('isBalanced', (t) => {
    t.plan(1)

    const tree = new AVLTree(1, { foo: 'bar' })

    tree.insert(2, { foo: 'baz' })
    tree.insert(10, { foo: 'qux' })
    tree.insert(25, { foo: 'quux' })
    tree.insert(5, { foo: 'quuz' })
    tree.insert(20, { foo: 'corge' })
    tree.insert(12, { foo: 'grault' })
    tree.insert(15, { foo: 'garply' })
    tree.insert(30, { foo: 'waldo' })
    tree.insert(40, { foo: 'fred' })
    tree.insert(520, { foo: 'plugh' })
    tree.insert(630, { foo: 'xyzzy' })
    tree.insert(3, { foo: 'thud' })
    tree.insert(480, { foo: 'thuds' })

    t.equal(tree.isBalanced(), true)
  })

  t.only('find', (t) => {
    t.plan(2)

    const tree = new AVLTree(1, [1, 2, 3])

    tree.insert(2, [4, 5, 6])
    tree.insert(10, [7, 8, 9])
    tree.insert(25, [10, 11, 12])
    tree.insert(5, [13, 14, 15])
    tree.insert(20, [16, 17, 18])
    tree.insert(12, [19, 20, 21])

    t.same(tree.contains(20), true)
    t.same(tree.find(20), [16, 17, 18])
  })

  t.only('remove', (t) => {
    t.plan(3)

    const tree = new AVLTree(1, 'foo')

    tree.insert(2, 'bar')
    tree.insert(10, 'baz')
    tree.insert(25, 'qux')
    tree.insert(5, 'quux')
    tree.insert(20, 'quuz')
    tree.insert(12, 'corge')

    tree.remove(20)

    t.equal(tree.getSize(), 6)
    t.equal(tree.contains(20), false)
    t.equal(tree.isBalanced(), true)
  })

  t.only('rangeSearch', (t) => {
    t.plan(1)

    const tree = new AVLTree(1, ['foo'])

    tree.insert(2, ['bar'])
    tree.insert(10, ['baz'])
    tree.insert(25, ['qux'])
    tree.insert(5, ['quux'])
    tree.insert(20, ['quuz'])
    tree.insert(12, ['corge'])

    t.same(tree.rangeSearch(5, 20), ['quux', 'baz', 'corge', 'quuz'])
  })

  t.only('greaterThan', (t) => {
    t.plan(1)

    const tree = new AVLTree(1, ['foo'])

    tree.insert(2, ['bar'])
    tree.insert(10, ['baz'])
    tree.insert(25, ['qux'])
    tree.insert(5, ['quux'])
    tree.insert(20, ['quuz'])
    tree.insert(12, ['corge'])

    t.same(tree.greaterThan(10), ['quuz', 'corge', 'qux'])
  })

  t.only('lessThan', (t) => {
    t.plan(1)

    const tree = new AVLTree(1, ['foo'])

    tree.insert(2, ['bar'])
    tree.insert(10, ['baz'])
    tree.insert(25, ['qux'])
    tree.insert(5, ['quux'])
    tree.insert(20, ['quuz'])
    tree.insert(12, ['corge'])

    t.same(tree.lessThan(10), ['bar', 'foo', 'quux'])
  })
})
