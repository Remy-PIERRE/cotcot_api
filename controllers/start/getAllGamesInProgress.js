const games = require("../../model/game.js");

const gameDummy = {
	type: "entre_amis",
	duration: 1000000,
	minPlayers: 2,
	maxPlayers: 8,
	id: 897632,
	state: "lobby",
	gameStart: 1716904306332,
	teams: ["Oies", "Dindons"],
	players: [
		// {
		// 	id: 2,
		// 	name: "Justine",
		// 	pseudo: "Ju",
		// 	points: 0,
		// 	state: "ready",
		// },
	],
	master: { id: 1583, name: "Remy Pierre" },
};

async function getAllGamesInProgress() {
	// TODO - DB //
	games["78901"] = gameDummy;
}

module.exports = getAllGamesInProgress;
