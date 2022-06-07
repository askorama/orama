import cronometro from "cronometro";
import prefixSearch from "./engines/prefix-search";
import prefixSearchMovies from "./engines/prefix-search-movies";
import indexing from "./engines/indexing";

cronometro(prefixSearch);
cronometro(indexing);
cronometro(prefixSearchMovies);
