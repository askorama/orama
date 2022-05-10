export function levenshtein(a: string, b: string): number {
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let tmp;

  if (a.length > b.length) {
    tmp = a;
    a = b;
    b = tmp;
  }

  const row = Array.from({ length: a.length + 1 }, (_, i) => i);
  let val = 0;

  for (let i = 1; i <= b.length; i++) {
    let prev = i;

    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        val = row[j - 1];
      } else {
        val = Math.min(row[j - 1] + 1, Math.min(prev + 1, row[j] + 1));
      }

      row[j - 1] = prev;
      prev = val;
    }
    row[a.length] = prev;
  }

  return row[a.length];
}