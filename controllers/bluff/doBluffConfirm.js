const { getGameById } = require("../../utils/game");
const { getPlayerById } = require("../../utils/player");
const { gameUpdatedToAll } = require("../socket/gameUpdated");

function doBluffconfirm(socket, payload) {
	// check payload //
	const { gameId, playerId } = payload;
	if (!gameId || !playerId) {
		return console.log("do bluff confirm : payload missing");
	}

	// check game //
	const game = getGameById(gameId);
	if (!game) {
		return console.log("do bluff confirm : game missing");
	}

	// check player //
	const player = getPlayerById(game, playerId);
	if (!player || !player.doBluff) {
		return console.log(
			"do bluff confirm : player missing or isn't doing bluff"
		);
	}

	// update player //
	player.doBluff = "success";

	// dev //
	// console.log(getGameById(gameId).players.map((p) => [p.name, p.doBluff]));

	gameUpdatedToAll(socket, game);
}

module.exports = doBluffconfirm;
