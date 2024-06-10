const {
	randomIntFromInterval,
	randomTeamsFromTeamsList,
} = require("../../utils/random");
const gameOptions = require("../../assets/json/gameOptions.json");
const { setIntoDb } = require("../db/set.js");
const { addNewGame } = require("../../model/Games.js");
const { gameCreated } = require("../socket/gameCreated.js");
const { sendError } = require("../socket/error.js");

async function gameCreate(socket, payload) {
	try {
		// check payload //
		const { player, game } = payload;
		if (!player || !game) {
			throw new Error("Data are missing");
		}

		// setup new game //
		gameSetup(game, player);

		// send to db //
		const collection = "in_progress";
		const response = await setIntoDb(game, collection);

		// check response //
		if (response.message) {
			throw new Error("Server error");
		}

		// add new game to games object //
		addNewGame(response.id, game);

		// send response to sender //
		gameCreated(socket, game);

		console.log("Game created", game.id, game.type, game.duration);
	} catch (error) {
		// send response to sender //
		const event = "game:create:response";
		const message = error.message;
		console.log("Error game created : ", message);
		sendError(socket, event, {
			success: false,
			message,
		});
	}
}

function gameSetup(game, player) {
	game.id = randomIntFromInterval(100000, 999999);
	game.state = "lobby";
	game.turn = 0;
	game.gameStart = Date.now();
	game.turnDuration = game.turnDuration || gameOptions.turnDuration;
	game.resolutionDuration =
		game.resolutionDuration || gameOptions.resolutionDuration;
	game.bluffChances = game.bluffChances || gameOptions.bluffChances;
	game.challengeTeam = game.challengeTeam || gameOptions.challengeTeam;
	game.master = { id: player.id, name: player.name };
	game.teams = randomTeamsFromTeamsList(2);
	game.players = [];
}

module.exports = gameCreate;
