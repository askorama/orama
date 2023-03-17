import t from "tap";
import {
  createGraph,
  addDirectedValue,
  addUndirectedValue,
  getAllValues,
  hasDirectedValue,
  hasUndirectedValue,
  removeDirectedValue,
  removeUndirectedValue,
} from "../src/graphs/adjacency-matrix.js";

t.test("createGraph", t => {
  t.plan(1);

  const graph = createGraph();

  t.same(graph, {});
  t.end();
});

t.test("addDirectedValue", t => {
  t.plan(2);

  const graph = createGraph();

  addDirectedValue(graph, "a", "b");

  t.equal(hasDirectedValue(graph, "a", "b"), true);
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
  t.plan(2);

  const graph = createGraph();

  addUndirectedValue(graph, "a", "b");
  addUndirectedValue(graph, "a", "c");
  addUndirectedValue(graph, "a", "d");
  addUndirectedValue(graph, "a", "e");

  removeDirectedValue(graph, "a", "b");

  t.same(getAllValues(graph, "a"), ["c", "d", "e"]);
  t.same(getAllValues(graph, "b"), ["a"]);

  t.end();
});

t.test("removeUndirectedValue", t => {
  t.plan(2);

  const graph = createGraph();

  addUndirectedValue(graph, "a", "b");
  addUndirectedValue(graph, "a", "c");
  addUndirectedValue(graph, "a", "d");
  addUndirectedValue(graph, "a", "e");

  removeUndirectedValue(graph, "a", "b");

  t.same(getAllValues(graph, "a"), ["c", "d", "e"]);
  t.same(getAllValues(graph, "b"), []);

  t.end();
});
