const { getGameById } = require("../../model/Games.js");

async function gameGet(socket, payload) {
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

		// check if player belong to this game //
		const playerCurrent = game.players.find(
			(playerInGame) => playerInGame.id === player.id
		);

		// send response to sender //
		socket.emit("game:get:response", {
			success: true,
			data: {
				...game,
				player: playerCurrent,
			},
		});
	} catch (error) {
		// send response to sender //
		socket.emit("game:get:response", {
			message: error.message,
		});
	}
}

module.exports = gameGet;
