<script>
import { create, insert, search as lyraSearch } from "@lyrasearch/lyra/dist/esm/lyra";
import { formatNanoseconds, getNanosecondsTime } from "@lyrasearch/lyra/dist/esm/utils";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",

  data: () => ({
    db: null,
    isLoading: false,
    pokemon: [],
    searchPokemon: [],
    search: "",
    elapsedTime: "",
  }),

  created() {
    this.db = create({
      schema: {
        _id: "number",
        name: "string",
      },
    });
  },

  mounted() {
    fetch("/pokedex.json")
      .then(data => data.json())
      .then(pokeList => {
        for (const { id, name } of pokeList.pokemon) {
          insert(this.db, {
            _id: id,
            name,
          });
        }

        this.pokemon = pokeList.pokemon;
      })
      .catch(console.error)
      .finally(() => {
        this.isLoading = false;
      });
  },

  watch: {
    search(newValue) {
      if (newValue) {
        const timeStart = getNanosecondsTime();

        const result = lyraSearch(this.db, {
          term: newValue,
          properties: "*",
        });

        this.elapsedTime = formatNanoseconds(getNanosecondsTime() - timeStart);

        const pokemons = result.hits.map(({ _id: hitID }) =>
          this.pokemon?.find(({ id: pokemonID }) => pokemonID === hitID),
        );

        if (pokemons.length && !pokemons.some(x => !x)) {
          this.searchPokemon = [...new Set(pokemons)];
        } else {
          this.searchPokemon = [];
        }
      }
    },
  },
});
</script>

<template>
  <div class="flex w-full justify-center font-sans">
    <div class="ma">
      <h1>Lyra preview in Vue. Search for a Pokemon</h1>

      <div v-if="isLoading">Loading pokemons...</div>

      <div className="w-full h-8">
        <input
          className="w-full h-full border-rounded border-1 border-gray-500 pl-2"
          type="text"
          v-model="search"
          placeholder="Find a Pokemon..."
        />
      </div>

      <div v-if="!isLoading">
        <div class="grid mt-4">
          <!-- Render Pokemon grid -->
          <div v-for="p in searchPokemon" :key="p.id" class="grid grid-cols-2 my-2">
            <img :src="p.img" />

            <div>
              <h1 class="text-lg">{{ p.name }}</h1>
              <p>Type: {{ p.type.join(", ") }}</p>
            </div>
          </div>

          <!-- Render Elapsed time -->
          <div className="font-mono" v-if="searchPokemon.length && elapsedTime">
            <div className="font-mono">
              <small>
                Elapsed time: <strong>{{ elapsedTime }}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
