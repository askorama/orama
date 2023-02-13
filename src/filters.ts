import type { WhereFilter, FilterOperation, PropertiesSchema, Lyra } from "./types/index.js";
import type { AVLNode } from "./trees/avl/node.js";
import { greaterThan, lessThan, rangeSearch, find } from "./trees/avl/index.js";
import { intersect } from './utils.js'
import * as ERRORS from "./errors.js";

export function getWhereFiltersIDs<S extends PropertiesSchema>(filters: WhereFilter<S>, lyra: Lyra<S>): string[] {
  const filterKeys = Object.keys(filters);

  const filtersMap: Record<string, string[]> = filterKeys.reduce((acc, key) => ({
    [key]: [],
    ...acc,
  }), {});
  
  for (const param of filterKeys) {
    const operation = filters[param as keyof WhereFilter<S>]
    const operationKeys = Object.keys(operation as unknown as FilterOperation[])

    if (operationKeys.length > 1) {
      throw new Error(ERRORS.INVALID_FILTER_OPERATION(Object.keys(operationKeys)))
    }

    const operationOpt = operationKeys[0] as FilterOperation
    const operationValue = operation[operationOpt as keyof typeof operation];

    const AVLNode = lyra.index[param] as AVLNode<number, string[]>;

    switch (operationOpt) {
      case "gt": {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - this is a bug in the typescript compiler
        const filteredIDs = greaterThan(AVLNode, operationValue, false);
        filtersMap[param].push(...filteredIDs);
        break;
      }
      case "gte": {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - this is a bug in the typescript compiler
        const filteredIDs = greaterThan(AVLNode, operationValue, true);
        filtersMap[param].push(...filteredIDs);
        break;
      }
      case "lt": {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - this is a bug in the typescript compiler
        const filteredIDs = lessThan(AVLNode, operationValue, false);
        filtersMap[param].push(...filteredIDs);
        break;
      }
      case "lte": {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - this is a bug in the typescript compiler
        const filteredIDs = lessThan(AVLNode, operationValue, true);
        filtersMap[param].push(...filteredIDs);
        break;
      }
      case "eq": {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - this is a bug in the typescript compiler
        const filteredIDs = find(AVLNode, operationValue);
        filtersMap[param].push(...filteredIDs!);
        break;
      }
      case "between": {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - this is a bug in the typescript compiler
        const filteredIDs = rangeSearch(AVLNode, operationValue[0], operationValue[1]);
        filtersMap[param].push(...filteredIDs);
      }
    }
  }

  // AND operation: calculate the intersection between all the IDs in filterMap
  const result = intersect(Object.values(filtersMap)) as unknown as string[];

  return result;
}

export function intersectFilteredIDs(filtered: string[], lookedUp: [string, number][]): [string, number][] {
  const map = new Map<string, boolean>();
  const result: [string, number][] = [];

  for (const id of filtered) {
    map.set(id, true);
  }

  for (const [id, score] of lookedUp) {
    if (map.has(id)) {
      result.push([id, score]);
      map.delete(id);
    }
  }

  return result;
}