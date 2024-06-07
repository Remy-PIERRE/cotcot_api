const { getGameById, getRandomTeamForPlayer } = require("../../model/Games.js");
const { updateGameIntoDB } = require("../db/update.js");
const { gameStarted } = require("../socket/gameStarted.js");
const { gameUpdatedToAll } = require("../socket/gameUpdated.js");
const gameTimer = require("../timer/gameTimer");

async function gameStart(socket, payload) {
	try {
		// check payload //
		const { player, gameId } = payload;
		if (!player || !gameId) {
			throw new Error("Data are missing");
		}

		// get game //
		const [gameIdDb, game] = getGameById(gameId);
		if (!game) {
			throw new Error("Game does not exists");
		}

		// check if player is game master //
		if (game.master.id !== player.id) {
			throw new Error("Action denied");
		}

		// check if enought players are presents //
		if (game.players.length < game.minPlayers) {
			throw new Error("Min players requirement not reached");
		}

		// update game //
		setupGame(game);

		// update db //
		updateGameIntoDB(gameIdDb, game);

		// start game timer //
		gameTimer(socket, game);

		// send response to sender //
		gameStarted(socket, game);
		gameUpdatedToAll(socket, game);
	} catch (error) {
		// send response to sender //
		const event = "game:start:response";
		const message = error.message;
		sendError(socket, event, {
			success: false,
			message,
		});

		console.log("error : ", error.message);
	}
}

function setupGame(game) {
	game.state = "in_progress";
	game.gameStart = Date.now();

	game.players.map((p) => {
		p.state = "";
		p.team = getRandomTeamForPlayer(game);
		p.points = 0;
	});
}

module.exports = gameStart;
