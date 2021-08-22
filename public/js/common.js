// Load and return the current team if it exists.
function loadStoredTeam() {
    let team_list = [];
    if (JSON.parse(sessionStorage.getItem("team_list")) != null) {
        team_list = JSON.parse(sessionStorage.getItem("team_list"));
    }
    return team_list;
}

// Return the array without the specified value.
function arrayRemove(arr, value) {
    return arr.filter(function (element) {
        return element.id != value.id;
    });
}

function updateStoredTeam() {
    sessionStorage.setItem("team_list", JSON.stringify(team_list));
}

// Find and return an object from a list where the numerical value matches the object's property.
function findPokemonByProperty(search_list, value, property) {
    return search_list.find(obj => {
        return Number(obj[property]) === Number(value)
    });
}