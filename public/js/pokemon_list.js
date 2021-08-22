const pokemon_list = document.getElementById('pokemon-list');
const current_team = document.getElementById('current-team-selector');

// Array that stores all the pokemon loaded from API.
let all_pokemon = [];

// Array that holds all the rows of pokemon uses.
let pokemon_uses = []


const promises = [];

starting_pokemon = 1;
ending_pokemon = starting_pokemon + 11

// Load all of the current pokemon use counts from the database.
fetch('/uses', {method: 'GET'})
    .then(function (response) {
        if (response.ok) return response.json();
        throw new Error('Get uses request failed.');
    })
    .then(function (data) {
        pokemon_uses = data.all_rows;
        fetchPokemon(starting_pokemon, ending_pokemon);
    })
    .catch(function (error) {
        console.log(error);
    });

let team_list = loadStoredTeam();

// Return the number of times a pokemon has been used in a party.
function getUses(id, all_pokemon_uses) {
    let pokemon = findPokemonByProperty(all_pokemon_uses, id, 'pokemon_id');

    if (pokemon !== undefined) {
        return pokemon.uses;
    } else {
        return 0;
    }
}

// Incrementally load Pokemon from API.
const fetchPokemon = (start, end) => {

    for (let i = start; i <= end; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }
    Promise.all(promises).then((results) => {
        const pokemon = results
            .map(
            (result) => ({
                name: result.name,
                image: result.sprites['front_default'],
                type: result.types.map((type) => type.type.name).join(', '),
                id: result.id,
                uses: getUses(result.id, pokemon_uses)
            }));

        displayPokemon(pokemon);
        all_pokemon = pokemon;
    });
};

// Populate the pokemon list with filled out cards.
const displayPokemon = (all_pokemon) => {
    const pokemonHTMLString = all_pokemon
        .map(
            (pokemon) => `
        <li class="card"  onclick="addOrRemove(this)">
            <img class="card-image" src="${pokemon.image}"/>
            <h2 class="pokemon-number">#${pokemon.id}</h2>
            <h2 class="pokemon-name">${pokemon.name}</h2>
            <p class="pokemon-type">${pokemon.type}</p>
            <p class="pokemon-uses">Added to ${pokemon.uses} parties</p>
        </li>
    `
        )
        .join('');
    pokemon_list.innerHTML = pokemonHTMLString;
};

// Display the current team sidebar.
const displayTeam = (team) => {
    const teamHTMLString = team
        .map(
            (pokemon) => `
        <li class="team-card">
            <img class="team-card-image" src="${pokemon.image}"/>
            <h2 class="pokemon-name">${pokemon.name}</h2>
        </li>
    `
        )
        .join('');
    current_team.innerHTML = teamHTMLString;
};

const addOrRemove = function (pobj) {
    const uses = pobj.getElementsByClassName("pokemon-uses")[0];
    let pokemon_id = pobj.childNodes[3].innerHTML.substring(1);

    const clicked_pokemon = findPokemonByProperty(all_pokemon, pokemon_id, 'id');

    // Remove clicked pokemon if it is already in team.
    if (team_list.some(pokemon => pokemon.id === clicked_pokemon.id)) {
        team_list = arrayRemove(team_list, clicked_pokemon)
    } else if (team_list.length < 6) {
        // Or add to team if there is space.
        team_list.push(clicked_pokemon)

        // Post to database that pokemon was added to a team.
        fetch(`/index.ejs?pokemon_id=${pokemon_id}`, {method: 'POST'})
            .then(function (response) {
                if (response.ok) return;
                throw new Error('Pokemon use update post failed.');
            })
            .catch(function (error) {
                console.log(error);
            });
        // Update the uses value locally to match database.
        // Saves querying db for something we already know.
        clicked_pokemon.uses += 1;
        uses.innerHTML = `Added to ${clicked_pokemon.uses} parties`;
    }
    displayTeam(team_list);
    updateStoredTeam();
};

// Update info on how many pokemon are displayed.
document.getElementById('display-counter').innerHTML = ending_pokemon + " / 150";

displayTeam(team_list);

// Handle fetching more pokemon from API on scroll to bottom.
// If a user is zoomed out really far and can't scroll the page
// they won't be able to trigger more pokemon loading though.
window.onscroll = function (ev) {
    if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && ending_pokemon < 150) {
        starting_pokemon += 12;
        ending_pokemon = starting_pokemon + 11
        if (ending_pokemon > 150) {
            ending_pokemon = 150
        }
        fetchPokemon(starting_pokemon, ending_pokemon);
        document.getElementById('display-counter').innerHTML = ending_pokemon + " / 150";
    }
};