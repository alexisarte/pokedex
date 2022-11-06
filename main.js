const API_URL = "https://pokeapi.co/api/v2/";
const LIMIT = 20;
const PAGE_URL = API_URL + `pokemon/?limit=${LIMIT}&offset=`;
const POKEMONES = 1154;

const $ = (s) => document.querySelector(s);

function fetchPokemon(name) {
  const url = `${API_URL}pokemon/${name}`;
  console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      createPokemon(data);
    })
    .catch((err) => console.log(err));
}

function fetchPokemons(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      data.results.forEach((pokemon) => showPokemonName(pokemon.name));
      $(".pokemon-list").addEventListener("click", showPokemon);
    })
    .catch((err) => console.log(err));
}

// function showPokemonName(pokemonName) {
//     const name = document.createElement('li');
//     name.textContent = pokemonName;
//     $('.pokemon-list').appendChild(name);
// }

const showPokemonName = (pokemonName) => {
  const name = document.createElement("li");
  name.textContent = pokemonName;
  $(".pokemon-list").appendChild(name);
};

function removePokemon() {
  const pokemonData = $(".pokemon-data");
  const imgContainer = $(".img-container");
  while (imgContainer.firstChild !== null) {
    imgContainer.removeChild(imgContainer.firstChild);
  }
  while (pokemonData.lastChild.className != "img-container") {
    pokemonData.removeChild(pokemonData.lastChild);
  }
}

const showPokemon = (e) => {
  if (e.target.tagName === "LI") {
    removePokemon();
    fetchPokemon(e.target.textContent);
    $("#pokemon-container").style.visibility = "visible";
  }
};

function createPokemon(pokemon) {
  // imagen y nombre
  const imgContainer = document.querySelector(".img-container");
  // imgContainer.classList.add('img-container');
  const sprite = document.createElement("img");
  sprite.style.width = "96px";
  sprite.src = pokemon.sprites.front_default
    ? pokemon.sprites.front_default
    : pokemon.sprites.other["official-artwork"].front_default;
  const name = document.createElement("p");
  name.id = "pokemonName";
  name.textContent = pokemon.name;

  // habilidades
  const abilities = document.createElement("p");
  abilities.innerHTML = "Abilities:";
  pokemon.abilities.forEach(
    (a) => (abilities.innerHTML += ` ${a.ability.name} |`)
  );

  // peso y altura
  const weightAndHeight = document.createElement("p");
  weightAndHeight.innerHTML = `Weight: ${pokemon.weight} - height: ${pokemon.height}`;
  imgContainer.appendChild(sprite);

  $(".pokemon-data").append(imgContainer, name, abilities, weightAndHeight);
}

function pages() {
  let options = $(".options");
  for (let i = 0; i < POKEMONES / LIMIT; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = "Page " + (i + 1);
    options.appendChild(option);
  }
}

function removePokemonName() {
  const pokemonData = $(".pokemon-list");
  while (pokemonData.lastChild !== null) {
    pokemonData.removeChild(pokemonData.lastChild);
  }
}

function pokemonsList() {
  let options = $(".options");
  $(".pokemon-list").innerHTML = "";
  let url = PAGE_URL + options.value * LIMIT;
  fetchPokemons(url);
}

function nextOrPrevious(e) {
  const options = $(".options");
  if (e.target.tagName === "BUTTON") {
    let option = Number(options.value);
    if (
      (option === 0 && e.target.id === "previous") ||
      (option === Math.floor(POKEMONES / LIMIT) && e.target.id === "next")
    ) {
      return;
    }
    options.value = e.target.id === "next" ? ++option : --option;
    removePokemonName();
    const url = PAGE_URL + options.value * LIMIT;
    fetchPokemons(url);
  }
}

window.onload = () => {
  fetchPokemons(`${PAGE_URL}0`);
  pages();
  $(".options").addEventListener("change", pokemonsList);
  $(".buttons").addEventListener("click", nextOrPrevious);
};
