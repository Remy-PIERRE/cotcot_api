const { db } = require("../../config/database.js");
const games = require("../../model/game.js");
const startAllTimers = require("./startAllTimers.js");
const gameOptions = require("../../assets/json/gameOptions.json");

const gameDummy = {
	type: "entre_amis",
	duration: 3600000,
	minPlayers: 2,
	maxPlayers: gameOptions.maxPlayers,
	id: 455261,
	state: "in_progress",
	gameStart: Date.now(),
	turnDuration: gameOptions.turnDuration,
	resolutionDuration: gameOptions.resolutionDuration,
	teams: ["Oies", "Dindons"],
	players: [
		{
			id: 1583,
			name: "Remy Pierre",
			pseudo: "Reminours",
			state: "",
			team: "Oies",
			points: 0,
		},
		{
			id: 7568,
			name: "Justine",
			pseudo: "Juju",
			state: "",
			team: "Dindons",
			points: 0,
		},
		{
			id: 7561,
			name: "Sandro",
			pseudo: "Dodo",
			state: "",
			team: "Oies",
			points: 0,
		},
		{
			id: 7562,
			name: "Daniel",
			pseudo: "Dada",
			state: "",
			team: "Dindons",
			points: 0,
		},
		{
			id: 7563,
			name: "William",
			pseudo: "Willou",
			state: "",
			team: "Oies",
			points: 0,
		},
		{
			id: 7564,
			name: "Pattie",
			pseudo: "Patto",
			state: "",
			team: "Dindons",
			points: 0,
		},
		{
			id: 7565,
			name: "Philipe",
			pseudo: "Philou",
			state: "",
			team: "Oies",
			points: 0,
		},
		{
			id: 7566,
			name: "Sabine",
			pseudo: "Sacha",
			state: "",
			team: "Dindons",
			points: 0,
		},
	],
	master: { id: 7568, name: "Justine" },
	bluffChances: gameOptions.bluffChances,
	turn: 0,
	challengeTeam: gameOptions.challengeTeam,
};

async function getAllGamesInProgress() {
	for (let attribute in games) delete games[attribute];

	// TODO - DB //
	games["7i2L0HAM7L3yo913GMH0"] = gameDummy;

	console.log(
		"games : ",
		Object.values(games).map((g) => [g.id, g.state])
	);
	return;

	try {
		const data = await db.collection("in_progress").get();
		data.forEach((doc) => {
			games[doc.id] = doc.data();
		});
		console.log("games : ", games);
		startAllTimers();
	} catch (error) {
		console.log(error.message);
	}
}

module.exports = getAllGamesInProgress;
