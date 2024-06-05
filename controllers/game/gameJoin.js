const { db } = require("../../config/database");
const games = require("../../model/game.js");

async function gameJoin(socket, payload) {
	try {
		const { player, gameId } = payload;
		console.log("joining : ", payload.player.name, payload.gameId);

		// check data //
		if (!player.id || !player.name || !player.pseudo || !gameId) {
			throw new Error("Game join : data are missing");
		}

		// get game //
		const [gameDbId, game] = Object.entries(games).find(([key, value]) => {
			if (value.id === gameId) {
				return [key, value];
			}
		});

		// check if game exists //
		if (!game) {
			throw new Error("Game join : game does not exists");
		}

		// check if player already in game //
		if (game.players.find((playerInGame) => playerInGame.id === player.id)) {
			socket.join(`game_id=${game.id}`);

			return socket.emit("game:join:response", {
				success: true,
				data: game,
			});
		}

		// check if party is full //
		if (game.players.length >= game.maxPlayers) {
			throw new Error("Game join : game is full");
		}

		// check if kicked //
		if (game.kicked && game.kicked.find((kicked) => kicked === player.id)) {
			throw new Error("Game join : game is full");
		}

		// add player to game //
		game.players.push({
			...player,
			points: 0,
		});

		// update db //
		// await db.collection("in_progress").doc(gameDbId).update({
		// 	players: game.players,
		// });

		// add player to room //
		socket.join(`game_id=${gameId}`);

		// send response to sender //
		socket.emit("game:join:response", {
			success: true,
			data: {
				...game,
				player,
			},
		});

		// send info to all players in room //
		socket.to(`game_id=${gameId}`).emit("game:updated", {
			success: true,
			data: game,
		});
	} catch (error) {
		// send response to sender //
		socket.emit("game:join:response", {
			message: error.message,
		});
	}
}

module.exports = gameJoin;
