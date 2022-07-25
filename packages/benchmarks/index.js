import cronometro from "cronometro";
import prefixSearch from "./engines/prefix-search.js";
import exactSearch from "./engines/exact-search.js";
import indexing from "./engines/indexing.js";
import typoTolerance from "./engines/typo-tolerance.js";
import prefixSearchMovies from "./engines/prefix-search-movies.js";

await cronometro(indexing);
await cronometro(prefixSearch);
await cronometro(exactSearch);
await cronometro(typoTolerance);
await cronometro(prefixSearchMovies);
