const games = require("../../model/game.js");
const turnStart = require("../turn/turnStart");

async function playerReady(socket, payload) {
	const { player, gameId } = payload;

	try {
		// check data //
		if (!player || !gameId) {
			throw new Error("Player ready : data are incomplete");
		}

		// get game //
		const game = Object.values(games).find((game) => game.id === gameId);

		// check if game exists //
		if (!game) {
			throw new Error("Player ready : game does not exists");
		}

		// DEV //
		game.players.find((p) => p.name === "Sandro").state = "ready";
		game.players.find((p) => p.name === "Daniel").state = "ready";
		game.players.find((p) => p.name === "William").state = "ready";
		game.players.find((p) => p.name === "Pattie").state = "ready";
		game.players.find((p) => p.name === "Philipe").state = "ready";
		game.players.find((p) => p.name === "Sabine").state = "ready";

		// check if player in game //
		const playerCurrent = game.players.find(
			(playerInGame) => playerInGame.id === player.id
		);
		if (!playerCurrent) {
			throw new Error("Player ready : player does not exists");
		}

		// update player //
		if (playerCurrent.state !== "ready") {
			playerCurrent.state = "ready";

			// console.log(
			// 	"players : ",
			// 	game.players.map((p) => p.state)
			// );

			// if all are ready //
			if (
				game.players.filter((playerInGame) => playerInGame.state === "ready")
					.length === game.players.length
			) {
				turnStart(socket, game);
			}
		}
	} catch (error) {
		console.log(error);
		// send response to sender //
		socket.emit("game:start:response", {
			success: false,
			message: error.message,
		});
	}
}

module.exports = playerReady;
