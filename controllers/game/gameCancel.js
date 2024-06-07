const { deleteGame, getGameById } = require("../../model/Games.js");
const { deleteGameFromDb } = require("../db/delete.js");
const { sendError } = require("../socket/error.js");
const {
	gameDeletedToSender,
	gameDeletedToAll,
} = require("../socket/gameDeleted.js");
const { clearRoom } = require("../socket/room.js");

async function gameCancel(socket, payload) {
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

		// check if player is game master //
		if (game.master.id !== player.id) {
			throw new Error("Action denied");
		}

		// send to db //
		const collection = "in_progress";
		await deleteGameFromDb(gameIdDb, collection);

		// update games object //
		deleteGame(gameIdDb);

		// send response //
		gameDeletedToSender(socket);
		gameDeletedToAll(socket, gameId);

		// clear socket room //
		clearRoom(socket, gameId);
	} catch (error) {
		// send response to sender //
		const event = "game:canceled";
		const message = error.message;
		sendError(socket, event, {
			success: false,
			message,
		});
	}
}

module.exports = gameCancel;
