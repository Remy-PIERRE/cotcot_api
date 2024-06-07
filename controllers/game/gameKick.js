const {
	getGameById,
	getPlayerById,
	kickPlayerFromGame,
} = require("../../model/Games.js");
const { updateGamePlayersAndKickedIntoDB } = require("../db/update.js");
const { sendError } = require("../socket/error.js");
const { gameKicked } = require("../socket/gameKicked.js");
const { gameUpdatedToAll } = require("../socket/gameUpdated.js");

async function gamekick(socket, payload) {
	try {
		// check payload //
		const { player, target, gameId } = payload;
		if (!player || !target || !gameId) {
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

		// check player belong to game //
		const targetCurrent = getPlayerById(game, target.id);
		if (!targetCurrent) {
			throw new Error("Target not in game");
		}

		// remove player from game //
		kickPlayerFromGame(game, targetCurrent);

		// update db //
		await updateGamePlayersAndKickedIntoDB(gameIdDb, game);

		// remove target from room && send response //
		// TODO - leavePlayerFromRoom(socket, gameId, targetCurrent);
		gameKicked(socket, game);
		gameUpdatedToAll(socket, game);
	} catch (error) {
		// send response to sender //
		const event = "game:kick:response";
		const message = error.message;
		sendError(socket, event, {
			success: false,
			message,
		});
	}
}

module.exports = gamekick;
