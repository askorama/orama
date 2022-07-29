const benchmarks = [
  "./engines/prefix-search.js",
  "./engines/exact-search.js",
  "./engines/indexing.js",
  "./engines/typo-tolerance.js",
  "./engines/prefix-search-movies.js",
];

for (const benchmark of benchmarks) {
  await import(benchmark);
}
