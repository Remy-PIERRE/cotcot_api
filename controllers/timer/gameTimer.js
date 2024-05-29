const timerOptions = require("../../assets/json/timers.json");
const { db } = require("../../config/database");

async function gameTimer(socket, game) {
	const intervalDuration = timerOptions.find(
		(option) => option.name === "game"
	).duration;

	const intervalRef = setInterval(() => {
		const durationLeft = game.gameStart + game.duration - Date.now();

		if (durationLeft < 0) {
			clearInterval(intervalRef);

			// update game //
			game.state = "over";
			console.log("game over");

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
		}
	}, intervalDuration);
}

module.exports = gameTimer;
