import cronometro from "cronometro";
import prefixSearch from "./engines/prefix-search.js";
import prefixSearchMovies from "./engines/prefix-search-movies.js";
import indexing from "./engines/indexing.js";

cronometro(prefixSearch);
cronometro(indexing);
cronometro(prefixSearchMovies);
