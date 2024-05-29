const { db } = require("../../config/database");
const games = require("../../model/game.js");

async function gameLeave(socket, payload) {
	const { player, gameId } = payload;

	try {
		// check data //
		if (!player || !gameId) {
			throw new Error("Game leave : data are incomplete");
		}

		// get game //
		const game = Object.values(games).find((game) => game.id === gameId);

		// check if game exists //
		if (!game) {
			throw new Error("Game leave : game does not exists");
		}

		// check if player belongs to game //
		const playerInGame = game.players.find(
			(playerInGame) => playerInGame.id === player.id
		);
		if (!playerInGame) {
			throw new Error("Game leave: this player does notbelong to this game");
		}

		// update games object //
		game.players = game.players.filter(
			(playerInGame) => playerInGame.id !== player.id
		);

		// update db //
		// await db.collection("inProgress").add(game);

		// send response to sender //
		socket.emit("game:leave:response", {
			success: true,
		});

		// remove player from room //
		socket.leave(`game_id=${gameId}`);

		// send info to all players in room //
		socket.to(`game_id=${gameId}`).emit("game:updated", {
			success: true,
			data: game,
		});
	} catch (error) {
		// send response to sender //
		socket.emit("game:leave:response", {
			success: false,
			message: error.message,
		});
	}
}

module.exports = gameLeave;
