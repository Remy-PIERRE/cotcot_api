function getPlayerById(game, playerId) {
	if (game.players) {
		return game.players.find((p) => p.id === playerId);
	}

	return null;
}

function mixPlayers(players) {
	return players.sort(() => 0.5 - Math.random());
}

module.exports = { getPlayerById, mixPlayers };
