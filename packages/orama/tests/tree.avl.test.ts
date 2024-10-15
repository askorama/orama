import t from 'tap'

import { AVLTree } from '../src/trees/avl.js'

t.test('AVL Tree', async (t) => {
  t.test('create', async (t) => {
    const tree = new AVLTree<number, string>(1, ['foo'])
    t.equal(tree.getSize(), 1)
    t.strictSame(tree.find(1), new Set(['foo']))
    t.equal(tree.find(4), null)
  })

  t.test('insert', async (t) => {
    const tree = new AVLTree(1, ['foo'])

    tree.insert(2, 'bar')
    tree.insert(10, 'baz')
    tree.insert(25, 'qux')
    tree.insert(5, 'quux')
    tree.insert(20, 'quuz')
    tree.insert(12, 'corge')

    t.equal(tree.getSize(), 7)
  })

  t.test('find', async (t) => {
    const tree = new AVLTree(1, [1, 2, 3])

    tree.insertMultiple(2, [4, 5, 6])
    tree.insertMultiple(10, [7, 8, 9])
    tree.insertMultiple(25, [10, 11, 12])
    tree.insertMultiple(5, [13, 14, 15])
    tree.insertMultiple(20, [16, 17, 18])
    tree.insertMultiple(12, [19, 20, 21])

    t.same(tree.contains(20), true)
    t.strictSame(tree.find(20), new Set([16, 17, 18]))
  })

  t.test('remove', async (t) => {
    const tree = new AVLTree(1, ['foo'])

    tree.insert(2, 'bar')
    tree.insert(10, 'baz')
    tree.insert(25, 'qux')
    tree.insert(5, 'quux')
    tree.insert(20, 'quuz')
    tree.insert(12, 'corge')

    tree.remove(20)

    t.equal(tree.getSize(), 6)
    t.equal(tree.contains(20), false)
  })

  t.test('rangeSearch', async (t) => {
    const tree = new AVLTree(1, ['foo'])

    tree.insertMultiple(2, ['bar'])
    tree.insertMultiple(10, ['baz'])
    tree.insertMultiple(25, ['qux'])
    tree.insertMultiple(5, ['quux'])
    tree.insertMultiple(20, ['quuz'])
    tree.insertMultiple(12, ['corge'])

    t.strictSame(tree.rangeSearch(5, 20), new Set(['quux', 'baz', 'corge', 'quuz']))
  })

  t.test('greaterThan', async (t) => {
    const tree = new AVLTree(1, ['foo'])

    tree.insertMultiple(2, ['bar'])
    tree.insertMultiple(10, ['baz'])
    tree.insertMultiple(25, ['qux'])
    tree.insertMultiple(5, ['quux'])
    tree.insertMultiple(20, ['quuz'])
    tree.insertMultiple(12, ['corge'])

    t.strictSame(tree.greaterThan(10), new Set(['qux', 'quuz', 'corge']))
  })

  t.test('lessThan', async (t) => {
    const tree = new AVLTree(1, ['foo'])

    tree.insertMultiple(2, ['bar'])
    tree.insertMultiple(10, ['baz'])
    tree.insertMultiple(25, ['qux'])
    tree.insertMultiple(5, ['quux'])
    tree.insertMultiple(20, ['quuz'])
    tree.insertMultiple(12, ['corge'])

    t.strictSame(tree.lessThan(10), new Set(['foo', 'bar', 'quux']))
  })
})
