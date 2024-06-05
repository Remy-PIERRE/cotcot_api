function getTeamsAndPlayers(game) {
	const teams = {};

	game.players.map((p) => {
		if (!teams.hasOwnProperty(p.team)) {
			teams[p.team] = [p];
		} else {
			teams[p.team].push(p);
		}
	});

	return teams;
}

module.exports = { getTeamsAndPlayers };
