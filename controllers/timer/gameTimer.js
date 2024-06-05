const timerOptions = require("../../assets/json/timers.json");
const { db } = require("../../config/database");
const gameOver = require("../game/gameOver");

async function gameTimer(socket, game) {
	const intervalDuration = timerOptions.find(
		(option) => option.name === "game"
	).duration;

	console.log("game timer : ", game);

	const intervalId = setInterval(() => {
		const durationLeft = game.gameStart + game.duration - Date.now();
		// console.log(game.id, durationLeft);

		if (durationLeft < 0) {
			clearInterval(intervalId);

			console.log("game timer end : ", game);

			// update game //
			gameOver(socket, game);
		}
	}, intervalDuration);
}

module.exports = gameTimer;
