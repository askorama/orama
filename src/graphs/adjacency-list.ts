export type Matrix = Record<string, Record<string, number>>;

export function createGraph(): Matrix {
  return {};
}

export function addNode(graph: Matrix, value: string): void {
  if (!graph[value]) {
    graph[value] = {};
  }
}

export function addUndirectedValue(graph: Matrix, value1: string, value2: string): void {
  addNode(graph, value1);
  addNode(graph, value2);
  graph[value1][value2] = 1;
  graph[value2][value1] = 1;
}

export function addDirectedValue(graph: Matrix, value1: string, value2: string): void {
  addNode(graph, value1);
  addNode(graph, value2);
  graph[value1][value2] = 1;
}

export function hasValue(graph: Matrix, value: string): boolean {
  return !!graph[value];
}

export function hasUndirectedValue(graph: Matrix, value1: string, value2: string): boolean {
  return !!graph[value1] && !!graph[value1][value2];
}

export function hasDirectedValue(graph: Matrix, value1: string, value2: string): boolean {
  return !!graph[value1] && !!graph[value1][value2];
}

export function getAllValues(graph: Matrix, word: string): string[] {
  const results: string[] = [];

  for (const value in graph) {
    if (hasUndirectedValue(graph, word, value)) {
      results.push(value);
    } else if (hasDirectedValue(graph, word, value)) {
      results.push(value);
    }
  }

  return results;
}

export function removeUndirectedValue(graph: Matrix, value1: string, value2: string): void {
  if (hasUndirectedValue(graph, value1, value2)) {
    delete graph[value1][value2];
    delete graph[value2][value1];
  }
}

export function removeDirectedValue(graph: Matrix, value1: string, value2: string): void {
  if (hasDirectedValue(graph, value1, value2)) {
    delete graph[value1][value2];
  }
}
