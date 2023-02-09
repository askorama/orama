import t from 'tap'
import { create, insert, find, getSize, remove, contains, isBalanced } from '../src/trees/avl/index.js'

t.test('AVL Tree', t => {
  t.plan(5);

  t.test('create', t => {
    t.plan(1);

    const tree = create(1);
    t.equal(getSize(tree), 1);
  });

  t.test('insert', t => {
    t.plan(1);

    const tree = create(1);

    insert(tree, 2);
    insert(tree, 10);
    insert(tree, 25);
    insert(tree, 5);
    insert(tree, 20);
    insert(tree, 12);

    t.equal(getSize(tree), 7);
  });

  t.test('isBalanced', t => {
    t.plan(1);

    const tree = create(1);

    insert(tree, 2);
    insert(tree, 10);
    insert(tree, 25);
    insert(tree, 5);
    insert(tree, 20);
    insert(tree, 12);

    t.equal(isBalanced(tree), true);
  });

  t.test('find', t => {
    t.plan(1);

    const tree = create(1);

    insert(tree, 2);
    insert(tree, 10);
    insert(tree, 25);
    insert(tree, 5);
    insert(tree, 20);
    insert(tree, 12);

    t.equal(find(tree, 20), 20);
  });

  t.test('remove', t => {
    t.plan(3);

    const tree = create(1);

    insert(tree, 2);
    insert(tree, 10);
    insert(tree, 25);
    insert(tree, 5);
    insert(tree, 20);
    insert(tree, 12);

    remove(tree, 20);

    t.equal(getSize(tree), 6);
    t.equal(contains(tree, 20), false);
    t.equal(isBalanced(tree), true);
  });

});