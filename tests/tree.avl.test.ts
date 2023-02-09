import t from 'tap'
import { create, insert, find, getSize, remove, contains, isBalanced } from '../src/trees/avl/index.js'

t.test('AVL Tree', t => {
  t.plan(5);

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

});