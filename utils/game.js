const games = require("../model/game");

function getGameById(gameId) {
	return Object.values(games).find((g) => g.id === gameId);
}

module.exports = { getGameById };
