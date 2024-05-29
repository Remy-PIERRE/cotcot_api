const games = require("../../model/game");
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
		playerCurrent.state = "waiting";

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
			turnResolution(socket, game);
		}
	} catch (error) {}
}

module.exports = playerChallengeOver;
