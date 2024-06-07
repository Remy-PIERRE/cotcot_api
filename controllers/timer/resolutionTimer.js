const timerOptions = require("../../assets/json/timers.json");
const { getGameIdDb } = require("../../model/Games.js");
const turnResolution = require("../turn/turnResolution.js");

async function resolutionTimer(socket, game) {
	const intervalDuration = timerOptions.find((o) => o.name === "turn").interval;
	const gameIdDb = getGameIdDb(game.id);

	const intervalId = setInterval(() => {
		// get duration left //
		const durationLeft =
			game.resolutionStart + game.resolutionDuration - Date.now();

		// clear timer when all players finish challenge phase //
		if (
			game.players.filter((p) => p.state === "challenge").length ===
			game.players.length
		) {
			clearInterval(intervalId);
		}

		if (durationLeft < 0) {
			clearInterval(intervalId);

			// update players
			game.players.map((p) => {
				if (p.beBluff && p.beBluff !== "bluff_failure") {
					p.beBluff = "bluff_success";
				}

				if (p.doBluff && p.doBluff !== "bluff_success") {
					p.doBluff = "bluff_failure";
				}

				if (p.state !== "challenge_success") {
					p.state = "challenge_failure";
				}
			});

			// resolve all players turn //
			while (game.players.find((p) => p.state !== "")) {
				turnResolution(socket, game);
			}
		}
	}, intervalDuration);
}

module.exports = resolutionTimer;
