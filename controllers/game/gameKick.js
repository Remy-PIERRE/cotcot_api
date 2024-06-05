const { db } = require("../../config/database");
const games = require("../../model/game.js");

async function gamekick(socket, payload) {
	const { player, target, gameId } = payload;

	try {
		// check data //
		if (!player || !target || !gameId) {
			throw new Error("Game kick : data are incomplete");
		}

		// get game //
		const [gameDbId, game] = Object.entries(games).find(([key, value]) => {
			if (value.id === gameId) {
				return [key, value];
			}
		});

		// check if game exists //
		if (!game) {
			throw new Error("Game leave : game does not exists");
		}

		// chech if player is master //
		if (!game.master || game.master.id !== player.id) {
			throw new Error("Game leave : denied");
		}

		// check if target belongs to game //
		if (!game.players.find((playerInGame) => playerInGame.id === target.id)) {
			throw new Error("game leave : this player does not belong to this game");
		}

		// update games object //
		game.players = game.players.filter(
			(playerInGame) => playerInGame.id !== target.id
		);

		game["kicked"] = game["kicked"]
			? [...game["kicked"], target.id]
			: [target.id];

		// update db //
		await db.collection("in_progress").doc(gameDbId).update({
			players: game.players,
			kicked: game.kicked,
		});

		// send response to sender //
		socket.emit("game:kick:response", {
			success: true,
			data: game,
		});

		// remove target from room //
		//socket.leave(`game_id=${gameId}`);

		// send info to all players in room //
		socket.to(`game_id=${gameId}`).emit("game:updated", {
			success: true,
			data: game,
		});
	} catch (error) {
		// send response to sender //
		socket.emit("game:kick:response", {
			success: false,
			message: error.message,
		});
	}
}

module.exports = gamekick;
