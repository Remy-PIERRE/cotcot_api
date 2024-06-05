const { db } = require("../../config/database");
const games = require("../../model/game.js");
const { randomTeamFromGameTeams } = require("../../utils/random");
const gameTimer = require("../timer/gameTimer");

async function gameStart(socket, payload) {
	const { player, gameId } = payload;

	try {
		// check data //
		if (!player || !gameId) {
			throw new Error("Game start : data are incomplete");
		}

		// get game //
		const [gameDbId, game] = Object.entries(games).find(([key, value]) => {
			if (value.id === gameId) {
				return [key, value];
			}
		});

		// check if game exists //
		if (!game) {
			throw new Error("Game start : game does not exists");
		}

		// chech if player is master //
		if (!game.master || game.master.id !== player.id) {
			throw new Error("Game start : denied");
		}

		// check if enought players are presents //
		if (game.players.length < game.minPlayers) {
			throw new Error("Game start : not enought players to start");
		}

		// update game //
		game.state = "in_progress";
		game.gameStart = Date.now();

		game.players.map((playerInGame, index) => {
			playerInGame.team = randomTeamFromGameTeams(game.teams, index);
			playerInGame.points = 0;
			playerInGame.state = "";
		});

		// update db //
		await db
			.collection("in_progress")
			.doc(gameDbId)
			.update({
				...game,
			});

		// start game timer //
		gameTimer(socket, game);

		// send response to sender //
		socket.emit("game:start:response", {
			success: true,
			data: game,
		});

		// send info to all players in room //
		socket.to(`game_id=${gameId}`).emit("game:updated", {
			success: true,
			data: game,
		});
	} catch (error) {
		// send response to sender //
		socket.emit("game:start:response", {
			success: false,
			message: error.message,
		});
	}
}

module.exports = gameStart;
