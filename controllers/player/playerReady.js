const { getGameById, getPlayerById } = require("../../model/Games.js");
const { sendError } = require("../socket/error.js");
const turnStart = require("../turn/turnStart");

async function playerReady(socket, payload) {
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

		// DEV //
		// game.players.find((p) => p.name === "Sandro").state = "ready";
		// game.players.find((p) => p.name === "Daniel").state = "ready";
		// game.players.find((p) => p.name === "William").state = "ready";
		// game.players.find((p) => p.name === "Pattie").state = "ready";
		// game.players.find((p) => p.name === "Philipe").state = "ready";
		// game.players.find((p) => p.name === "Sabine").state = "ready";

		// check player belongs to game //
		const playerCurrent = getPlayerById(game, player.id);
		if (!playerCurrent) {
			throw new Error("Player does not exists");
		}

		// if already ready === reconnexion, do nothing //
		if (playerCurrent.state === "ready") {
			return;
		}

		// update player //
		setupPlayer(playerCurrent);

		console.log("player ready : ", player.name);

		// if all ready => new turn //
		if (
			game.players.filter((p) => p.state === "ready").length ===
			game.players.length
		) {
			turnStart(socket, gameIdDb, game);
		}
	} catch (error) {
		// send response to sender //
		const event = "game:start:response";
		const message = error.message;
		console.log("Error player ready : ", message);
		sendError(socket, event, {
			success: false,
			message,
		});
	}
}

function setupPlayer(player) {
	player.state = "ready";
}

module.exports = playerReady;
