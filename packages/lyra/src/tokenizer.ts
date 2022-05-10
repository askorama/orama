export function tokenize(input: string): Set<string> {
  return new Set(
    input
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .split(" ")
      .filter(Boolean)
  );
}