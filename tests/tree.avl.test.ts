import t from 'tap'
import { create, insert, find, getSize, remove, contains, isBalanced, greaterThan, lessThan, rangeSearch, getNodeByKey } from '../src/trees/avl/index.js'

t.test('AVL Tree', t => {
  t.plan(16);

  t.test('create', t => {
    t.plan(3);

    const tree = create(1, 'foo');
    t.equal(getSize(tree), 1);
    t.equal(find(tree, 1), 'foo');
    t.equal(find(tree, 4), null);
  });

  t.test('insert', t => {
    t.plan(1);

    const tree = create(1, 'foo');

    insert(tree, 2, 'bar');
    insert(tree, 10, 'baz');
    insert(tree, 25, 'qux');
    insert(tree, 5, 'quux');
    insert(tree, 20, 'quuz');
    insert(tree, 12, 'corge');

    t.equal(getSize(tree), 7);
  });

  t.test('isBalanced', t => {
    t.plan(1);

    const tree = create(1, { foo: 'bar' });

    insert(tree, 2, { foo: 'baz' });
    insert(tree, 10, { foo: 'qux' });
    insert(tree, 25, { foo: 'quux' });
    insert(tree, 5, { foo: 'quuz' });
    insert(tree, 20, { foo: 'corge' });
    insert(tree, 12, { foo: 'grault' });
    insert(tree, 15, { foo: 'garply' });
    insert(tree, 30, { foo: 'waldo' });
    insert(tree, 40, { foo: 'fred' });
    insert(tree, 520, { foo: 'plugh' });
    insert(tree, 630, { foo: 'xyzzy' });
    insert(tree, 3, { foo: 'thud' });
    insert(tree, 480, { foo: 'thuds' });

    t.equal(isBalanced(tree), true);
  });

  t.test('find', t => {
    t.plan(2);

    const tree = create(1, [1, 2, 3]);

    insert(tree, 2, [4, 5, 6]);
    insert(tree, 10, [7, 8, 9]);
    insert(tree, 25, [10, 11, 12]);
    insert(tree, 5, [13, 14, 15]);
    insert(tree, 20, [16, 17, 18]);
    insert(tree, 12, [19, 20, 21]);

    t.same(contains(tree, 20), true);
    t.same(find(tree, 20), [16, 17, 18]);
  });

  t.test('remove', t => {
    t.plan(3);

    const tree = create(1, 'foo');

    insert(tree, 2, 'bar');
    insert(tree, 10, 'baz');
    insert(tree, 25, 'qux');
    insert(tree, 5, 'quux');
    insert(tree, 20, 'quuz');
    insert(tree, 12, 'corge');

    remove(tree, 20);

    t.equal(getSize(tree), 6);
    t.equal(contains(tree, 20), false);
    t.equal(isBalanced(tree), true);
  });

  t.test('rangeSearch', t => {
    t.plan(1);

    const tree = create(1, ['foo']);

    insert(tree, 2, ['bar']);
    insert(tree, 10, ['baz']);
    insert(tree, 25, ['qux']);
    insert(tree, 5, ['quux']);
    insert(tree, 20, ['quuz']);
    insert(tree, 12, ['corge']);

    t.same(rangeSearch(tree, 5, 20), ['quux', 'baz', 'corge', 'quuz']);
  });

  t.test('greaterThan', t => {
    t.plan(1);

    const tree = create(1, ['foo']);

    insert(tree, 2, ['bar']);
    insert(tree, 10, ['baz']);
    insert(tree, 25, ['qux']);
    insert(tree, 5, ['quux']);
    insert(tree, 20, ['quuz']);
    insert(tree, 12, ['corge']);

    t.same(greaterThan(tree, 10), ['qux', 'quuz', 'corge']);
  });

  t.test('lessThan', t => {
    t.plan(1);

    const tree = create(1, ['foo']);

    insert(tree, 2, ['bar']);
    insert(tree, 10, ['baz']);
    insert(tree, 25, ['qux']);
    insert(tree, 5, ['quux']);
    insert(tree, 20, ['quuz']);
    insert(tree, 12, ['corge']);

    t.same(lessThan(tree, 10), ['foo', 'bar', 'quux']);
  });

  t.test('should find return null if the node is not defined', t => {
    t.plan(1);

    // @ts-expect-error - testing null
    t.equal(find(null, 2), null);
  });

  t.test('should get node by key return null if the node is not defined', t => {
    t.plan(1);

    // @ts-expect-error - testing null
    t.equal(getNodeByKey(null, 1), null);
  });

  t.test('should remove return null if the node is not defined', t => {
    t.plan(1);

    // @ts-expect-error - testing null
    t.equal(remove(null, 1), null);
  });

  t.test('should remove return null if left and right nodes are not defined', t => {
    t.plan(1);

    const tree = create(1, 'foo');

    t.equal(remove(tree, 1), null);
  });

  t.test('should remove return the right node if the left node is not defined', t => {
    t.plan(1);

    const tree = create(1, 'foo');

    insert(tree, 2, 'bar');

    t.equal(remove(tree, 1), tree.right);
  });

  t.test('should range search return an epmty array if the node is not defined', t => {
    t.plan(1);

    // @ts-expect-error - testing null
    t.same(rangeSearch(null, 1, 2), []);
  });

  t.test('should greater than return an epmty array if the node is not defined', t => {
    t.plan(1);

    // @ts-expect-error - testing null
    t.same(greaterThan(null, 1), []);
  });

  t.test('should less than return an epmty array if the node is not defined', t => {
    t.plan(1);

    // @ts-expect-error - testing null
    t.same(lessThan(null, 1), []);
  });
});