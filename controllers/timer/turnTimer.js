const timerOptions = require("../../assets/json/timers.json");
const resolutionTimer = require("./resolutionTimer.js");
const { getGameIdDb } = require("../../model/Games.js");
const { updateGamePlayersIntoDB } = require("../db/update.js");
const {
	gameUpdatedToSender,
	gameUpdatedToAll,
} = require("../socket/gameUpdated.js");

async function turnTimer(socket, game) {
	const intervalDuration = timerOptions.find((o) => o.name === "turn").interval;
	const gameIdDb = getGameIdDb(game.id);

	let intervalId = setInterval(async () => {
		// get duration left //
		const durationLeft = game.turnStart + game.turnDuration - Date.now();

		// clear timer when all players finish challenge phase //
		if (
			!game.players.find(
				(p) => !["waiting", "turn_resolution"].includes(p.state)
			)
		) {
			clearInterval(intervalId);
		}

		if (durationLeft < 0) {
			clearInterval(intervalId);

			// update game //
			game.players.map((p) => (p.state = "turn_resolution"));
			game.resolutionStart = Date.now();

			resolutionTimer(socket, game);

			// update DB //
			await updateGamePlayersIntoDB(gameIdDb, game.players);

			// emit game updated to all //
			gameUpdatedToSender(socket, game);
			gameUpdatedToAll(socket, game);
		}
	}, intervalDuration);
}

module.exports = turnTimer;
