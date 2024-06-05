const {
	randomIntFromInterval,
	randomTeamsFromTeamsList,
} = require("../../utils/random");
const { db } = require("../../config/database");
const games = require("../../model/game.js");
const timerOptions = require("../../assets/json/timers.json");
const gameOptions = require("../../assets/json/gameOptions.json");

async function gameCreate(socket, payload) {
	try {
		const { player, game } = payload;

		// check data //
		if (!player || !game) {
			throw new Error("Game create : data are missing");
		}

		// create game //
		game.id = randomIntFromInterval(100000, 999999);
		game.state = "lobby";
		game.gameStart = Date.now();
		game.turnDuration = game.turnDuration || gameOptions.turnDuration;
		game.resolutionDuration =
			game.resolutionDuration || gameOptions.resolutionDuration;
		game.teams = randomTeamsFromTeamsList(2);
		game.players = [];
		game.master = { id: player.id, name: player.name };
		game.bluffChances = game.bluffChances || gameOptions.bluffChances;
		game.turn = 0;
		game.challengeTeam = game.challengeTeam || gameOptions.challengeTeam;

		// send to db //
		const response = await db.collection("in_progress").add(game);

		// check response //
		if (!response.id) {
			throw new Error("Game create : server error");
		}

		// add to games object //
		games[response.id] = game;

		// send response to sender //
		socket.emit("game:create:response", {
			success: true,
			data: games[response.id],
		});

		console.log("games : ", games);

		// DEV //
		// games[randomIntFromInterval(0, 100000)] = game;

		// console.log("games : ", games);

		// socket.emit("game:create:response", {
		// 	success: true,
		// 	data: game,
		// });
	} catch (error) {
		// send response to sender //
		socket.emit("game:create:response", {
			message: error.message,
		});
	}
}

module.exports = gameCreate;
