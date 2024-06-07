const { getGameById, getPlayerById } = require("../../model/Games");
const { sendError } = require("../socket/error");
const {
	gameUpdatedToSender,
	gameUpdatedToAll,
} = require("../socket/gameUpdated");
const resolutionTimer = require("../timer/resolutionTimer");

async function playerChallengeOver(socket, payload) {
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

		// check player belongs to game //
		const playerCurrent = getPlayerById(game, player.id);
		if (!playerCurrent) {
			throw new Error("Player does not exists");
		}

		// update player //
		playerCurrent.state = "waiting";

		// if all are waiting //
		if (
			game.players.filter((p) => p.state === "waiting").length ===
			game.players.length
		) {
			game.players.map((p) => (p.state = "turn_resolution"));
			game.resolutionStart = Date.now();
			resolutionTimer(socket, game);

			//  send response to all //
			gameUpdatedToAll(socket, game);
		}

		//  send response to sender //
		gameUpdatedToSender(socket, game);
	} catch (error) {
		// send response to sender //
		const event = "game:updated";
		const message = error.message;
		sendError(socket, event, {
			success: false,
			message,
		});
	}
}

module.exports = playerChallengeOver;
