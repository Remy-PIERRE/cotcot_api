const games = require("../../model/game.js");

async function gameGet(socket, payload) {
	try {
		const { player, gameId } = payload;

		// check data //
		if (!player || !gameId) {
			throw new Error("Game get: data are incomplete");
		}

		// get game //
		const game = Object.values(games).find((game) => game.id === gameId);

		// check if game exists //
		if (!game) {
			throw new Error("Game get: game does not exists");
		}

		// check if player belong to this game //
		const playerCurrent = game.players.find(
			(playerInGame) => playerInGame.id === player.id
		);
		// if (
		// 	!game.players.find((playerInGame) => playerInGame.id === player.id) &&
		// 	game.master.id !== player.id
		// ) {
		// 	throw new Error("Game get: this player does not belong to this game");
		// }

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
