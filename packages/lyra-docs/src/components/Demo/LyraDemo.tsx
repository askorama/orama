import React, { Fragment, useEffect, useState } from 'react';

// Import lyra
import { Lyra } from '@nearform/lyra';

// Import pokedex
import { LyraResult } from '@site/utils/types';
import pokedex from './pokedex';

// import css
import styles from './lyraDemo.module.css';

const db = new Lyra({
  schema: {
    id: 'number',
    name: 'string',
  }
});

const LyraDemo = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState(true);
    const [pokemon, setPokemon] = useState<LyraResult>();
    const [search, setSearch] = useState('');

    const insertInLyra = async (id: number, name: string) => {
        await db.insert({
            id, name
        });
    }

	const searchInLyra = async (pokemon: string): Promise<LyraResult> => {
		const result = await db.search({
			term: pokemon,
		});
		return result;
	}

    useEffect(() => {
		for (const { id, name: {english: pokemonName} } of pokedex) {
			insertInLyra(id, pokemonName)
				.then(() => {
					console.log('Inserted in Lyra');
				})
				.catch(console.log)
		}
    }, []);


    // On submitting the form, search for the pokemon
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        searchInLyra(search)
			.then(newPokemon => setPokemon(newPokemon))
			.catch(console.log)
			.finally(() => setIsLoading(false));
    }

	useEffect(() => {
		console.log(isLoading);
	}, [isLoading]);

    return (
        <div id="try-lyra" className={styles.lyraDemoContainer}>
            <div className={styles.lyraSearchDemo}>
                <h1> Try Lyra </h1>

                {isLoading && (
                    <div> Search a pokemon... </div>
                )}

                <form onSubmit={(e) => handleSubmit(e)}>
                    <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} className={styles.lyraDemoInput} />
                    <button type='submit'>Search</button>
                </form>

				{pokemon && (
					<Fragment>
						<small>Found {pokemon.count} result(s) out of {pokedex.length} elements in {pokemon.elapsed}...</small>
						<h6>Pokemon Id: {pokemon.hits[0].id}</h6>
						<h6>Pokemon Name: {pokemon.hits[0].name}</h6>
					</Fragment>
				)}
                
            </div>
        </div>
    );
}

export default LyraDemo;