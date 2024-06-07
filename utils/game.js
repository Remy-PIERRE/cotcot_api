const games = require("../model/game");

function getGameById(gameId) {
	return Object.entries(games).find(([key, value]) => {
		if (value.id === gameId) {
			return [key, value];
		}
	});
}

module.exports = { getGameById };
