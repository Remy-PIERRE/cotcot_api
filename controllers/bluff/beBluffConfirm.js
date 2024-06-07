const { getGameById, getPlayerById } = require("../../model/Games");
const turnResolution = require("../turn/turnResolution");

function beBluffConfirm(socket, payload) {
	console.log("payload : ", payload);
	// check payload //
	const { gameId, playerId, response } = payload;
	if (!gameId || !playerId) {
		return console.log("be bluff confirm : payload missing");
	}

	// get game //
	const [gameIdDb, game] = getGameById(gameId);
	if (!game) {
		throw new Error("Game does not exists");
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
	player.beBluff = response ? "bluff_success" : "bluff_failure";

	turnResolution(socket, game);

	// resolve bluff challenge //
	// if (player.beBluff === "confirm" && duo.doBluff === "success") {
	// 	duo.points += 1;
	// }

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
