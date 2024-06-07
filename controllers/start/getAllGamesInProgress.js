const { db } = require("../../config/database.js");
const startAllTimers = require("./startAllTimers.js");
const gameOptions = require("../../assets/json/gameOptions.json");
const { addNewGame } = require("../../model/Games.js");

const gameDummy = {
	type: "team_building",
	duration: 120000,
	minPlayers: 2,
	maxPlayers: gameOptions.maxPlayers,
	id: 853469,
	state: "in_progress",
	gameStart: Date.now(),
	turnDuration: gameOptions.turnDuration,
	resolutionDuration: gameOptions.resolutionDuration,
	teams: ["Coqs", "Dindons"],
	players: [
		{
			id: 2086,
			name: "Remy Pierre",
			pseudo: "Dindon Danseur",
			state: "",
			team: "Coqs",
			points: 0,
		},
		{
			id: 7811,
			name: "Justine Pourteau",
			pseudo: "Poussin Princier",
			state: "",
			team: "Dindons",
			points: 0,
		},
		// {
		// 	id: 7561,
		// 	name: "Sandro",
		// 	pseudo: "Dodo",
		// 	state: "",
		// 	team: "Coqs",
		// 	points: 0,
		// },
		// {
		// 	id: 7562,
		// 	name: "Daniel",
		// 	pseudo: "Dada",
		// 	state: "",
		// 	team: "Dindons",
		// 	points: 0,
		// },
		// {
		// 	id: 7563,
		// 	name: "William",
		// 	pseudo: "Willou",
		// 	state: "",
		// 	team: "Coqs",
		// 	points: 0,
		// },
		// {
		// 	id: 7564,
		// 	name: "Pattie",
		// 	pseudo: "Patto",
		// 	state: "",
		// 	team: "Dindons",
		// 	points: 0,
		// },
		// {
		// 	id: 7565,
		// 	name: "Philipe",
		// 	pseudo: "Philou",
		// 	state: "",
		// 	team: "Coqs",
		// 	points: 0,
		// },
		// {
		// 	id: 7566,
		// 	name: "Sabine",
		// 	pseudo: "Sacha",
		// 	state: "",
		// 	team: "Dindons",
		// 	points: 0,
		// },
	],
	master: { id: 7811, name: "Justine Pourteau" },
	bluffChances: gameOptions.bluffChances,
	turn: 0,
	challengeTeam: gameOptions.challengeTeam,
};

async function getAllGamesInProgress() {
	// DEV //
	addNewGame("qBvNeMZubAbAFd81NuFK", gameDummy);
	startAllTimers();
	return;

	try {
		const data = await db.collection("in_progress").get();
		data.forEach((doc) => {
			addNewGame(doc.id, doc.data());
		});
		startAllTimers();
	} catch (error) {
		console.log(error.message);
	}
}

module.exports = getAllGamesInProgress;
