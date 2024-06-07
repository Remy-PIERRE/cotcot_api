const { getGameById, getPlayerById } = require("../../model/Games");
const turnResolution = require("../turn/turnResolution");
const turnStart = require("../turn/turnStart");

async function playerChallengeSuccess(socket, payload) {
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
		playerCurrent.state = "challenge_success";
		turnResolution(socket, game);
	} catch (error) {
		// nothing to send //
		console.log("challenge success error : ", error);
	}
}

module.exports = playerChallengeSuccess;
