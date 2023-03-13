import { create, insertMultiple, search } from "@lyrasearch/lyra";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import data from "./assets/db.json";

interface Movies {
  id: string;
  title: string;
  director: string;
  plot: string;
  year: number;
  isFavorite: boolean;
}

function App() {
  const searchInput = useRef<HTMLInputElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [movies, setMovies] = useState<Movies[]>();

  useEffect(() => {
    // show all movies at the start
    setMovies(data);
  }, []);

  const handleSearch = async (e: React.KeyboardEvent) => {
    if (e.key != "Enter") return;

    const db = await create({
      schema: {
        id: "string", // users usually don't search this
        title: "string",
        director: "string",
        plot: "string", // users usually don't search this
        year: "number", // unsearchable
        isFavorite: "boolean", // unsearchable
      },
    });

    await insertMultiple(db, data, { batchSize: data.length });

    const searchResult = await search(db, {
      term: searchInput.current!.value,
      properties: ["title", "director"],
      tolerance: 1, // for typo tolerance
    });

    let result = [];

    for (let i = 0; i < searchResult.hits.length; i++) {
      result.push(searchResult.hits[i].document);
    }

    setIsSearching(true);
    setMovies(result);
  };

  return (
    <main className="main">
      <div className="top">
        {isSearching ? (
          <>
            <h1 className="title">Searching for "{searchInput.current!.value}"</h1>
            <button
              onClick={() => {
                setIsSearching(false);
                setMovies(data);
              }}
              className="button"
            >
              Reset
            </button>
          </>
        ) : (
          <>
            <h1 className="title">All Movies</h1>
            <input ref={searchInput} placeholder="Search..." onKeyDown={e => handleSearch(e)} className="input" />
          </>
        )}
      </div>
      <div className="container">
        {movies?.length ? (
          <>
            {movies.map(movie => (
              <div key={movie.id} className="movie">
                {movie.isFavorite && <p className="favLabel">&#x2B50;</p>}
                <h2 className="movieTitle">{movie.title}</h2>
                <p>{movie.plot}</p>
                <div className="details">
                  <sub className="sub">{movie.director}</sub>
                  <sub className="sub">{movie.year}</sub>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No movies found...</p>
        )}
      </div>
    </main>
  );
}

export default App;
