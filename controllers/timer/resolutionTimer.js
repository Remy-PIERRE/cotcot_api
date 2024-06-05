const timerOptions = require("../../assets/json/timers.json");
const games = require("../../model/game.js");
const { db } = require("../../config/database");

async function resolutionTimer(socket, game) {
	const intervalDuration = timerOptions.find(
		(option) => option.name === "turn"
	).interval;

	const intervalId = setInterval(() => {
		const gameId = game.id;
		const gameUpdated = Object.values(games).find((game) => game.id === gameId);
		const durationLeft =
			game.resolutionStart + game.resolutionDuration - Date.now();

		if (!game.players.find((p) => p.state === "turn_resolution")) {
			clearInterval(intervalId);
		}

		if (
			durationLeft < 0 ||
			(gameUpdated &&
				gameUpdated.players.filter((player) => player.state === "ready")
					.length === gameUpdated.players.length)
		) {
			clearInterval(intervalId);

			game.players.map((playerInGame) => {
				if (
					playerInGame.state === "challenge_success" &&
					game.players.find((duo) => duo.id === playerInGame.duo).state ===
						"turn_resolution"
				) {
					playerInGame.points += 1;
				}
			});

			// update game //
			game.players.map((playerInGame) => (playerInGame.state = ""));

			socket.emit("game:updated", {
				success: true,
				data: game,
			});

			// send info to all players in room //
			socket.to(`game_id=${game.id}`).emit("game:updated", {
				success: true,
				data: game,
			});
		}
	}, intervalDuration);
}

module.exports = resolutionTimer;
