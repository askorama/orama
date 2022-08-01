import { create, insert, search as lyraSearch } from "@nearform/lyra/dist/esm/lyra";
import { formatNanoseconds, getNanosecondsTime } from "@nearform/lyra/dist/esm/utils";
import { useEffect, useState } from "react";
import type { Pokemon } from "./types/pokemon";

const db = create({
  schema: {
    id: "number",
    name: "string",
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [pokemon, setPokemon] = useState<Pokemon[]>();
  const [searchPokemon, setSearchPokemon] = useState<Pokemon[]>();
  const [search, setSearch] = useState("");
  const [elapsedTime, setElapsedTime] = useState<string>("");

  useEffect(() => {
    fetch("/pokedex.json")
      .then(data => data.json())
      .then(pokeList => {
        for (const { id, name } of pokeList.pokemon) {
          insert(db, {
            id,
            name,
          });
        }

        setPokemon(pokeList.pokemon);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (search) {
      const timeStart = getNanosecondsTime();

      const result = lyraSearch(db, {
        term: search,
        properties: "*",
      });

      setElapsedTime(formatNanoseconds(getNanosecondsTime() - timeStart));

      const pokemons = result.hits.map(({ id: hitID }: any) =>
        pokemon?.find(({ id: pokemonID }) => pokemonID === hitID),
      ) as Pokemon[];

      if (pokemons.length && !pokemons.some((x: any) => !x)) {
        setSearchPokemon([...new Set<Pokemon>(pokemons)]);
      } else {
        setSearchPokemon([]);
      }
    }
  }, [search]);

  return (
    <div className="ma">
      <h1> Lyra preview in React. Search for a Pokemon </h1>

      {isLoading && <div> Loading pokemons... </div>}

      <div className="w-full h-8">
        <input
          className="w-full h-full border-rounded border-1 border-gray-500 pl-2"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Find a Pokemon..."
        />
      </div>

      {!isLoading && (
        <>
          <div className="grid mt-4">
            {/* Render Pokemon grid */}
            {searchPokemon?.map(p => (
              <div className="grid grid-cols-2 my-2" key={p.id}>
                <img src={p.img} />

                <div>
                  <h1 className="text-lg">{p.name}</h1>
                  <p> Type: {p.type.join(", ")} </p>
                </div>
              </div>
            ))}
          </div>

          {/* Render Elapsed time */}
          {searchPokemon?.length && elapsedTime ? (
            <div className="font-mono">
              <small>
                Elapsed time: <strong>{elapsedTime}</strong>
              </small>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}

export default App;
