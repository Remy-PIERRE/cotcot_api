const { getGameById } = require("../../utils/game");
const { getPlayerById } = require("../../utils/player");

function beBluffConfirm(socket, payload) {
	// check payload //
	const { gameId, playerId } = payload;
	if (!gameId || !playerId) {
		return console.log("be bluff confirm : payload missing");
	}

	// check game //
	const game = getGameById(gameId);
	if (!game) {
		return console.log("be bluff confirm : game missing");
	}

	// check player //
	const player = getPlayerById(game, playerId);
	if (!player || !player.beBluff) {
		return console.log(
			"be bluff confirm : player missing or isn't being bluffed"
		);
	}

	// check duo //
	const duo = getPlayerById(game, player.duo);
	if (!duo || !duo.doBluff) {
		return console.log("be bluff confirm : duo missing or isn't bluffing");
	}

	// update player //
	player.beBluff = "confirm";

	// resolve bluff challenge //
	if (player.beBluff === "confirm" && duo.doBluff === "success") {
		duo.points += 1;
	}

	// dev //
	// console.log(
	// 	getGameById(gameId).players.map((p) => [
	// 		p.name,
	// 		p.doBluff,
	// 		p.beBluff,
	// 		p.points,
	// 	])
	// );
}

module.exports = beBluffConfirm;
