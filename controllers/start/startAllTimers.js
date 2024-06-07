const { io } = require("../../config/server");
const { getGames } = require("../../model/Games");
const gameTimer = require("../timer/gameTimer");

async function startAllTimers() {
	Object.values(getGames()).map((game) => {
		gameTimer(io, game);
	});
}

module.exports = startAllTimers;
