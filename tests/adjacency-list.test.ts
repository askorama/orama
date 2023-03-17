import t from "tap";
import {
  createGraph,
  hasValue,
  addDirectedValue,
  addUndirectedValue,
  addNode,
  getAllValues,
  hasDirectedValue,
  hasUndirectedValue,
  removeDirectedValue,
  removeUndirectedValue,
} from "../src/graphs/adjacency-list.js";

t.test("createGraph", t => {
  t.plan(1);

  const graph = createGraph();

  t.same(graph, {});
  t.end();
});

t.test("hasValue", t => {
  t.plan(3);

  const graph = createGraph();

  t.equal(hasValue(graph, "a"), false);
  t.equal(hasValue(graph, "b"), false);

  addNode(graph, "a");

  t.equal(hasValue(graph, "a"), true);

  t.end();
});

t.test("addDirectedValue", t => {
  t.plan(3);

  const graph = createGraph();

  addDirectedValue(graph, "a", "b");
  addDirectedValue(graph, "a", "c");

  t.equal(hasDirectedValue(graph, "a", "b"), true);
  t.equal(hasDirectedValue(graph, "a", "c"), true);
  t.equal(hasDirectedValue(graph, "b", "a"), false);

  t.end();
});

t.test("addUndirectedValue", t => {
  t.plan(2);

  const graph = createGraph();

  addUndirectedValue(graph, "a", "b");

  t.equal(hasUndirectedValue(graph, "a", "b"), true);
  t.equal(hasUndirectedValue(graph, "b", "a"), true);

  t.end();
});

t.test("getAllValues", t => {
  t.plan(2);

  const graph = createGraph();

  addUndirectedValue(graph, "a", "b");
  addUndirectedValue(graph, "a", "c");
  addUndirectedValue(graph, "a", "d");
  addUndirectedValue(graph, "a", "e");

  t.same(getAllValues(graph, "a"), ["b", "c", "d", "e"]);
  t.same(getAllValues(graph, "b"), ["a"]);

  t.end();
});

t.test("removeDirectedValue", t => {
  t.plan(3);

  const graph = createGraph();

  addDirectedValue(graph, "a", "b");
  addDirectedValue(graph, "a", "c");

  t.equal(hasDirectedValue(graph, "a", "b"), true);

  removeDirectedValue(graph, "a", "b");

  t.equal(hasDirectedValue(graph, "a", "b"), false);
  t.equal(hasDirectedValue(graph, "a", "c"), true);

  t.end();
});

t.test("removeUndirectedValue", t => {
  t.plan(3);

  const graph = createGraph();

  addUndirectedValue(graph, "a", "b");
  addUndirectedValue(graph, "a", "c");

  t.equal(hasUndirectedValue(graph, "a", "b"), true);

  removeUndirectedValue(graph, "a", "b");

  t.equal(hasUndirectedValue(graph, "a", "b"), false);
  t.equal(hasUndirectedValue(graph, "a", "c"), true);

  t.end();
});
