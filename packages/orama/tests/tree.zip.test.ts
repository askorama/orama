import t from 'tap'
import { ZipTree } from '../src/trees/zip.js'

t.test('ZIP Tree', async (t) => {
  t.test('create', (t) => {
    t.plan(3)

    const tree = new ZipTree()
    tree.insert(1, 'foo')
    t.equal(tree.getSize(), 1)
    t.equal(tree.find(1), 'foo')
    t.equal(tree.find(4), null)
  })

  t.test('insert', (t) => {
    t.plan(1)

    const tree = new ZipTree()

    tree.insert(1, 'foo')
    tree.insert(2, 'bar')
    tree.insert(10, 'baz')
    tree.insert(25, 'qux')
    tree.insert(5, 'quux')
    tree.insert(20, 'quuz')
    tree.insert(12, 'corge')

    t.equal(tree.getSize(), 7)
  })

  t.test('find', async (t) => {
    const tree = new ZipTree()
    tree.insert(1, [1, 2, 3])

    tree.insert(2, [4, 5, 6])
    tree.insert(10, [7, 8, 9])
    tree.insert(25, [10, 11, 12])
    tree.insert(5, [13, 14, 15])
    tree.insert(20, [16, 17, 18])
    tree.insert(12, [19, 20, 21])

    t.same(tree.contains(20), true)
    t.same(tree.find(20), [16, 17, 18])
  })

  t.test('remove', async (t) => {
    const tree = new ZipTree()
    tree.insert(1, 'foo')

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
    const tree = new ZipTree()
    tree.insert(1, 'foo')

    tree.insert(2, 'bar')
    tree.insert(10, 'baz')
    tree.insert(25, 'qux')
    tree.insert(5, 'quux')
    tree.insert(20, 'quuz')
    tree.insert(12, 'corge')

    t.same(tree.rangeSearch(5, 20), ['quux', 'baz', 'corge', 'quuz'])
  })

  t.test('greaterThan', async (t) => {
    const tree = new ZipTree()
    tree.insert(1, 'foo')

    tree.insert(2, 'bar')
    tree.insert(10, 'baz')
    tree.insert(25, 'qux')
    tree.insert(5, 'quux')
    tree.insert(20, 'quuz')
    tree.insert(12, 'corge')

    t.same(tree.greaterThan(10), ['corge', 'quuz', 'qux'])
  })

  t.test('lessThan', async (t) => {
    const tree = new ZipTree()
    tree.insert(1, 'foo')

    tree.insert(2, 'bar')
    tree.insert(10, 'baz')
    tree.insert(25, 'qux')
    tree.insert(5, 'quux')
    tree.insert(20, 'quuz')
    tree.insert(12, 'corge')

    t.same(tree.lessThan(10), ['foo', 'bar', 'quux'])
  })
})
