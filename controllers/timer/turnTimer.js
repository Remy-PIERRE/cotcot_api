const timerOptions = require("../../assets/json/timers.json");
const games = require("../../model/game.js");
const { db } = require("../../config/database");
const turnResolution = require("../turn/turnResolution.js");
const resolutionTimer = require("./resolutionTimer.js");

async function turnTimer(socket, game) {
	const intervalDuration = timerOptions.find(
		(option) => option.name === "turn"
	).interval;

	let intervalId = setInterval(() => {
		const gameId = game.id;
		const gameUpdated = Object.values(games).find((game) => game.id === gameId);
		const durationLeft = game.turnStart + game.turnDuration - Date.now();

		if (!game.players.find((p) => p.state === "challenge")) {
			clearInterval(intervalId);
		}

		if (
			durationLeft < 0 ||
			(gameUpdated &&
				gameUpdated.players.filter(
					(player) => player.state === "turn_resolution"
				).length === gameUpdated.players.length)
		) {
			clearInterval(intervalId);

			// update game //
			game.players.map(
				(playerInGame) => (playerInGame.state = "turn_resolution")
			);
			game.resolutionStart = Date.now();

			resolutionTimer(socket, game);

			//update DB => remove from in_progress, add to over //
			// await db.collection("inProgress").add(game);

			// send event to sender //
			socket.emit("game:updated", {
				success: true,
				data: game,
			});

			// send event to all in room //
			socket.to(`game_id=${game.id}`).emit("game:updated", {
				success: true,
				data: game,
			});

			// turnResolution(socket, game);
		}
	}, intervalDuration);
}

module.exports = turnTimer;
