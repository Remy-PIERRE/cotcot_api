const timerOptions = require("../../assets/json/timers.json");
const gameOver = require("../game/gameOver");

async function gameTimer(socket, game) {
	const intervalDuration = timerOptions.find((o) => o.name === "game").interval;

	const intervalId = setInterval(() => {
		const durationLeft = game.gameStart + game.duration - Date.now();

		if (durationLeft < 0) {
			clearInterval(intervalId);

			// update game //
			gameOver(socket, game);
		}
	}, intervalDuration);
}

module.exports = gameTimer;
