
const b = require('benny')

function calculateCombination_Current(arrs) {
  const result = []
  const arrays = arrs.slice()
  const array = arrays.shift()
  if (array) {
    for (const elem of array) {
      result.push([elem])
    }
  }
  const arraysLength = arrays.length
  for (let i = 0; i < arraysLength; i++) {
    const array = arrays[i]
    const arrayLength = array.length
    const newResult = []
    for (let j = 0; j < arrayLength; j++) {
      const elem = array[j]
      for (const r of result) {
        newResult.push([...r, elem])
      }
    }
    result.length = 0
    result.push(...newResult)
  }

  return result
}

function calculateCombination_Recursive_Head(arrs) {
  if (!arrs.length) return [];
  if (arrs.length === 1) return arrs[0].map(item => [item]);

  const [head, ...tail] = arrs;
  const c = calculateCombination_Recursive_Head(tail);

  const combinations = [];
  for (const value of head) {
    for (const combination of c) {
      combinations.push([value, ...combination]);
    }
  }

  return combinations;
}

function calculateCombination_Recursive_Head_Indexed(arrs, index = 0) {
  if (index + 1 === arrs.length) return arrs[index].map(item => [item]);

  const head = arrs[index];
  const c = calculateCombination_Recursive_Head_Indexed(arrs, index + 1);

  const combinations = [];
  for (const value of head) {
    for (const combination of c) {
      combinations.push([value, ...combination]);
    }
  }

  return combinations;
}

function calculateCombination_Recursive_Head_Indexed2(arrs, count, index = 0) {
  if (index === count) return arrs[index].map(item => [item]);

  const head = arrs[index];
  const c = calculateCombination_Recursive_Head_Indexed2(arrs, count, index + 1);

  const combinations = [];
  for (const value of head) {
    for (const combination of c) {
      combinations.push([value, ...combination]);
    }
  }

  return combinations;
}

function calculateCombination_Recursive_Tail(arrs) {
  if (!arrs.length) return [];
  if (arrs.length === 1) return arrs[0].map(item => [item]);

  const tail = arrs.pop();
  const c = calculateCombination_Recursive_Tail(arrs);

  const combinations = [];
  for (const value of tail) {
    for (const combination of c) {
      combinations.push([...combination, value]);
    }
  }

  return combinations;
}

function calculateCombination_Recursive_Tail_Indexed(arrs, index) {
  if (index === 0) return arrs[0].map(item => [item]);

  const tail = arrs[index];
  const c = calculateCombination_Recursive_Tail_Indexed(arrs, index - 1);

  const combinations = [];
  for (const value of tail) {
    for (const combination of c) {
      combinations.push([...combination, value]);
    }
  }

  return combinations;
}

function* generateCombinations(arrs, currentCombination = [], index = 0) {
  if(index < arrs.length) {
    for(let val of arrs[index]) {
      yield* generateCombinations(arrs, [...currentCombination, val], index + 1);
    }
  } else {
    yield currentCombination;
  }
}

function calculateCombination_Generator(arrs) {
  return [...generateCombinations(arrs)];
}

const combination = (desc, arrs) => {
  b.suite(
    desc,

    b.add.skip('iterative', () => {
      calculateCombination_Current(arrs)
    }),

    b.add.skip('recursive head', () => {
      calculateCombination_Recursive_Head(arrs)
    }),

    b.add.skip('recursive tail', () => {
      calculateCombination_Recursive_Tail(arrs)
    }),

    b.add('recursive head indexed', () => {
      calculateCombination_Recursive_Head_Indexed(arrs, 0)
    }),

    b.add('recursive head indexed2', () => {
      calculateCombination_Recursive_Head_Indexed2(arrs, arrs.length - 1, 0)
    }),

    b.add.skip('recursive tail indexed', () => {
      calculateCombination_Recursive_Tail_Indexed(arrs, arrs.length - 1)
    }),

    b.add.skip('generator', () => {
      calculateCombination_Generator(arrs)
    }),

    b.cycle(),
    b.complete(),
    b.save({ file: 'reduce', version: '1.0.0' }),
    b.save({ file: 'reduce', format: 'chart' + desc + '.html' }),
  )
}

const main = async () => {
  const deep = [['a', 'b', 'c', 'd', 'e'], ['f', 'g', 'h', 'i', 'j'], ['k', 'l', 'm', 'n', 'o']]
  await combination('deep property', deep)

  const oneProperty = [['a'], ['b'], ['c']]
  await combination('one property', oneProperty)

  const distributed = [['a', 'b'], ['c'], ['d', 'e', 'f']]
  await combination('distributed', distributed)
}

main()