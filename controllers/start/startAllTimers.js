const { io } = require("../../config/server");
const games = require("../../model/game");
const gameTimer = require("../timer/gameTimer");

async function startAllTimers() {
	Object.values(games).map((game) => {
		console.log("gameId : ", game.id);
		gameTimer(io, game);
	});
}

module.exports = startAllTimers;
