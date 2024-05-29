const teamsList = require("../assets/json/teamsList.json");

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomIntFromIntervalWitout(min, max, index) {
	let random = index;

	while (random === index) {
		random = randomIntFromInterval(min, max);
	}

	return random;
}

function randomTeamsFromTeamsList(number) {
	const shuffled = teamsList.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, number);
}

function randomTeamFromGameTeams(teams, index) {
	return teams[(index + teams.length) % teams.length];
}

module.exports = {
	randomIntFromInterval,
	randomTeamsFromTeamsList,
	randomTeamFromGameTeams,
	randomIntFromIntervalWitout,
};
