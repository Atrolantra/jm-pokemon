const current_team_viewer = document.getElementById('current-team-viewer');

let team_list = loadStoredTeam();

// Display the Pokemon in the team.
const displayTeam = (team) => {
    const teamHTMLString = team
        .map(
            (pokemon) => `
        <li class="team-card" oninput="updateName(team_list, this)">
            <img class="team-card-image" src="${pokemon.image}"/>
            <h2 class="pokemon-name" contenteditable="true">${pokemon.name}</h2>
            <p hidden>${pokemon.id}</p>
            <img class="remove-from-party-button" src="img/remove.png" onclick="removeFromParty(team_list, this.parentNode)"/>
        </li>
    `
        )
        .join('');
    current_team_viewer.innerHTML = teamHTMLString;
};

// Update the Pokemon's nickname in the stored team when changed by user.
function updateName(team, pokemon) {
    const clicked_pokemon = findPokemonByProperty(team, pokemon.childNodes[5].innerText, 'id');
    clicked_pokemon.name = pokemon.childNodes[3].innerText;
    updateStoredTeam();
    console.log(team_list)
}

// Display the team's current size.
function updateTeamSize() {
    document.getElementById('team-size').innerHTML = team_list.length + " / 6";
}

// Remove pokemon from party when 'x' button is clicked.
const removeFromParty = function (team, pokemon) {
    const clicked_pokemon = findPokemonByProperty(team, pokemon.childNodes[5].innerText, 'id');
    team_list = arrayRemove(team_list, clicked_pokemon)
    displayTeam(team_list);
    updateStoredTeam();
    updateTeamSize();
}

displayTeam(team_list)
updateTeamSize();
