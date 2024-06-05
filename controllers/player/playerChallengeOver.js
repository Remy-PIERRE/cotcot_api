const games = require("../../model/game");
const resolutionTimer = require("../timer/resolutionTimer");
const turnResolution = require("../turn/turnResolution");

async function playerChallengeOver(socket, payload) {
	const { player, gameId } = payload;

	try {
		// check data //
		if (!player || !gameId) {
			throw new Error("Player ready : data are incomplete");
		}

		// get game //
		const game = Object.values(games).find((game) => game.id === gameId);

		// check if game exists //
		if (!game) {
			throw new Error("Player ready : game does not exists");
		}

		// check if player in game //
		const playerCurrent = game.players.find(
			(playerInGame) => playerInGame.id === player.id
		);
		if (!playerCurrent) {
			throw new Error("Player ready : player does not exists");
		}

		// update player //
		game.players.find((playerInGame) => playerInGame.id === player.id).state =
			"waiting";

		// send info to all players in room //
		socket.emit("game:updated", {
			success: true,
			data: game,
		});

		// if all are waiting //
		if (
			game.players.filter((playerInGame) => playerInGame.state === "waiting")
				.length === game.players.length
		) {
			game.players.map(
				(playerInGame) => (playerInGame.state = "turn_resolution")
			);

			resolutionTimer(socket, game);

			// send info to all players in room //
			socket.emit("game:updated", {
				success: true,
				data: game,
			});

			// send info to all players in room //
			socket.to(`game_id=${gameId}`).emit("game:updated", {
				success: true,
				data: game,
			});
		}
	} catch (error) {}
}

module.exports = playerChallengeOver;
