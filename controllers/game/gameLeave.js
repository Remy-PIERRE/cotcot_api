const {
	getGameById,
	getPlayerById,
	removePlayerFromGame,
} = require("../../model/Games.js");
const { updateGamePlayersIntoDB } = require("../db/update.js");
const { sendError } = require("../socket/error.js");
const { gameLeaved } = require("../socket/gameLeaved.js");
const { gameUpdatedToAll } = require("../socket/gameUpdated.js");
const { leaveRoom } = require("../socket/room.js");

async function gameLeave(socket, payload) {
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

		// check player belong to game //
		const playerCurrent = getPlayerById(game, player.id);
		if (!playerCurrent) {
			throw new Error("Player not in game");
		}

		// remove player from game //
		removePlayerFromGame(game, playerCurrent);

		// update db //
		await updateGamePlayersIntoDB(gameIdDb, playerCurrent);

		// remove player from room && send response //
		leaveRoom(socket, gameId);
		gameLeaved(socket);
		gameUpdatedToAll(socket, game);

		console.log("Gameleaved : ", game.id, player.name);
	} catch (error) {
		// send response to sender //
		const event = "game:leave:response";
		const message = error.message;

		// DEV //
		console.log("error : ", message);

		sendError(socket, event, {
			success: false,
			message,
		});
	}
}

module.exports = gameLeave;
