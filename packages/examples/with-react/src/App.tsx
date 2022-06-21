import { useEffect, useState } from 'react';
import { Lyra } from '@nearform/lyra/dist/esm/lyra';

const db = new Lyra({
  schema: {
    id: 'number',
    name: 'string',
  }
});

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [pokemon, setPokemon] = useState<any[]>();
  const [searchPokemon, setSearchPokemon] = useState<any[]>();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/pokedex.json')
      .then((data) => data.json())
      .then(async (pokeList) => {
        for (const { id, name } of pokeList.pokemon) {
          await db.insert({
            id, name
          });
        }

        setPokemon(pokeList.pokemon);
      })
      .catch(console.log)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (search) {
      db.search({
        term: search,
        properties: '*'
      })
        .then((result) => {
          const pokemons = result.hits.map((d) => pokemon?.find(p => p.id === (d as any).id));

          if (pokemons.length && !pokemons.some((x) => !x)) {
            setSearchPokemon([...new Set(pokemons)]);
          } else {
            setSearchPokemon([]);
          }
        })
        .catch(console.log)
    }
  }, [search]);

  return (
    <div>
      <h1> Lyra preview in React. Search for a Pokemon </h1>

      {isLoading && (
        <div> Loading pokemons... </div>
      )}

      <div>
        <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {!isLoading && (
        <div className='grid'>
          {searchPokemon?.map((p) => (
            <div className='grid grid-cols-2' key={p.id}>
              <img src={p.img} />
              <div>
                <h1 className='text-lg'>
                  {p.name}
                </h1>
                <p> Type: {p.type.join(', ')} </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
