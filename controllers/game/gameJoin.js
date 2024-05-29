const { db } = require("../../config/database");
const games = require("../../model/game.js");

async function gameJoin(socket, payload) {
	try {
		const { player, gameId } = payload;

		// check data //
		if (!player.id || !player.name || !player.pseudo || !gameId) {
			throw new Error("Game join : data are missing");
		}

		// get game //
		const game = Object.values(games).find((game) => game.id === gameId);

		// check if game exists //
		if (!game) {
			throw new Error("Game join : game does not exists");
		}

		// check if player already in game //
		if (game.players.find((playerInGame) => playerInGame.id === player.id)) {
			return socket.emit("game:join:response", {
				success: true,
				data: game,
			});
		}

		// check if party is full //
		if (game.players.length >= game.maxPlayers) {
			throw new Error("Game join : game is full");
		}

		// add player to game //
		game.players.push(player);

		// update db //
		// await db.collection("inProgress").add(game);

		// send response to sender //
		socket.emit("game:join:response", {
			success: true,
			data: {
				...game,
				player,
			},
		});

		// add player to room //
		socket.join(`game_id=${gameId}`);

		// send info to all players in room //
		socket.to(`game_id=${gameId}`).emit("game:updated", {
			success: true,
			data: game,
		});
	} catch (error) {
		// send response to sender //
		socket.emit("game:create:response", {
			message: error.message,
		});
	}
}

module.exports = gameJoin;
