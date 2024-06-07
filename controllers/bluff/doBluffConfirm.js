const { getGameById, getPlayerById } = require("../../model/Games");
const { gameUpdatedToAll } = require("../socket/gameUpdated");

function doBluffconfirm(socket, payload) {
	// check payload //
	const { gameId, playerId } = payload;
	if (!gameId || !playerId) {
		return console.log("do bluff confirm : payload missing");
	}

	// get game //
	const [gameIdDb, game] = getGameById(gameId);
	if (!game) {
		throw new Error("Game does not exists");
	}

	// check player //
	const player = getPlayerById(game, playerId);
	if (!player || !player.doBluff) {
		return console.log(
			"do bluff confirm : player missing or isn't doing bluff"
		);
	}

	// update player //
	player.doBluff = "bluff_success";

	gameUpdatedToAll(socket, game);
}

module.exports = doBluffconfirm;
