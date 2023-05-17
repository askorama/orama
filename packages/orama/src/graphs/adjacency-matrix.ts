export type Matrix = {
  [key: string]: {
    [key: string]: number;
  };
};

export function createGraph(): Matrix {
  return {};
}

export function addDirectedValue(matrix: Matrix, source: string, target: string): void {
  if (!matrix[source]) {
    matrix[source] = {};
  }

  matrix[source][target] = 1;
}

export function addUndirectedValue(matrix: Matrix, node1: string, node2: string): void {
  addDirectedValue(matrix, node1, node2);
  addDirectedValue(matrix, node2, node1);
}

export function hasDirectedValue(matrix: Matrix, source: string, target: string): boolean {
  return matrix?.[source]?.[target] === 1 ?? false;
}

export function hasUndirectedValue(matrix: Matrix, node1: string, node2: string): boolean {
  return hasDirectedValue(matrix, node1, node2) && hasDirectedValue(matrix, node2, node1);
}

export function removeDirectedValue(matrix: Matrix, source: string, target: string): void {
  if (matrix[source]) {
    delete matrix[source][target];
  }
}

export function removeUndirectedValue(matrix: Matrix, node1: string, node2: string): void {
  removeDirectedValue(matrix, node1, node2);
  removeDirectedValue(matrix, node2, node1);
}

export function getAllValues(matrix: Matrix, node: string): string[] {
  const results: string[] = [];

  if (matrix[node]) {
    for (const neighbor in matrix[node]) {
      if (matrix[node][neighbor] === 1) {
        results.push(neighbor);
      }
    }
  }

  return results;
}