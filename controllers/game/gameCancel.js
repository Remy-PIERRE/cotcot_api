const { db } = require("../../config/database");
const games = require("../../model/game.js");

async function gameCancel(socket, payload) {
	const { player, gameId } = payload;

	try {
		// check data //
		if (!player || !gameId) {
			throw new Error("Game cancel : data are incomplete");
		}

		// get game //
		const [gameDB, game] = Object.entries(games).find(([key, value]) => {
			if (value.id === gameId) {
				return [key, value];
			}
		});

		// check if game exists //
		if (!game) {
			throw new Error("Game cancel : game does not exists");
		}

		// check if player is game master //
		if (game.master.id !== player.id) {
			throw new Error("Game cancel : denied");
		}

		// send to db //
		// const response = await db.collection("inProgress").doc(gameDB).delete();

		// update games object //
		delete games[gameDB];

		// send response to sender //
		socket.emit("game:canceled", {
			success: true,
		});

		// send info to all players in room //
		socket.to(`game_id=${gameId}`).emit("game:canceled", {
			success: true,
		});

		// clear socket room //
		socket.in(`game_id=${gameId}`).socketsLeave(`game_id=${gameId}`);
	} catch (error) {
		// send response to sender //
		socket.emit("game:canceled", {
			success: false,
			message: error.message,
		});
	}
}

module.exports = gameCancel;
