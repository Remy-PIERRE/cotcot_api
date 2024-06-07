const gameOptions = require("../assets/json/gameOptions.json");

const games = {};

function getGames() {
	return games;
}

function getGameById(gameId) {
	const game = Object.entries(games).find(([key, value]) => {
		if (value.id === gameId) {
			return [key, value];
		}
	});

	if (game) {
		return game;
	}

	return [];
}

function getGameIdDb(id) {
	return Object.entries(games).find(([key, value]) => {
		if (value.id === id) {
			return key;
		}
	})[0];
}

function addNewGame(id, game) {
	games[id] = game;

	// DEV  //
	// console.log(games[id].id);
}

function deleteGame(id) {
	delete games[id];
}

function getPlayerById(game, playerId) {
	if (game.players) {
		return game.players.find((p) => p.id === playerId);
	}

	return null;
}

function addPlayerIntoGame(game, player) {
	if (!game.players) {
		game.players = [player];
	} else {
		game.players.push(player);
	}
}

function removePlayerFromGame(game, player) {
	if (game.players) {
		game.players = game.players.filter((p) => p.id !== player.id);
	}
}

function kickPlayerFromGame(game, target) {
	if (game.players) {
		removePlayerFromGame(game, target);

		game["kicked"] = game["kicked"]
			? [...game["kicked"], target.id]
			: [target.id];
	}
}

function getMixedPlayers(players) {
	return players.sort(() => 0.5 - Math.random());
}

function getRandomTeamForPlayer(game) {
	// get teams current members count //
	let teamsCount = getTeamsMembersNumber(game);

	// get smallest member count //
	let smallest = [];
	Object.entries(teamsCount).map(([key, value]) => {
		const result = {};
		result[key] = value;
		if (smallest.length === 0) {
			smallest = [result];
		} else if (Object.values(smallest[0])[0] > value) {
			smallest = [result];
		} else if (Object.values(smallest[0])[0] === value) {
			smallest = [...smallest, result];
		}
	});

	// multiple teams are smallest //
	if (smallest.length > 1) {
		const shuffled = smallest.sort(() => 0.5 - Math.random());
		return Object.keys(shuffled[0])[0];
	}

	// one team is smallest //
	return Object.keys(smallest[0])[0];
}

function isTeamBattlePossible(game) {
	// get teams current members count //
	const teamsCount = getTeamsMembersNumber(game);

	// if any team members < 2 => false //
	return Object.values(teamsCount).find((c) => c < 2) ? false : true;
}

function getTeamChallengePlayers(game) {
	// get teams count //
	let teamsCount = getTeamsMembersNumber(game);

	// select number of team members participating to team challenge //
	let min = 1000;
	Object.entries(teamsCount).map(([key, value]) => {
		const number = Math.round((value / 100) * gameOptions.teamBattleSize);
		if (number > 2) {
			teamsCount[key] = number;
			if (number < min) {
				min = number;
			}
		} else {
			teamsCount[key] = 2;
			if (min > 2) {
				min = 2;
			}
		}
	});
	Object.entries(teamsCount).map(([key, value]) => {
		if (value > min) {
			teamsCount[key] = min;
		}
	});

	// get teams members //
	const teams = getTeamsMembers(game);

	// mix && select teams members //
	Object.entries(teams).map(([key, value]) => {
		teams[key] = getMixedPlayers(value).slice(0, teamsCount[key]);
	});

	return teams;
}

function getTeamsMembers(game) {
	let teams = {};
	game.teams.map((t) => (teams[t] = []));
	game.players.map((p) => {
		teams[p.team].push(p);
	});

	return teams;
}

function getTeamsMembersNumber(game) {
	// get teams current members count //
	let teamsCount = {};
	game.teams.map((t) => (teamsCount[t] = 0));
	game.players.map((p) => {
		if (p.team) {
			teamsCount[p.team] += 1;
		}
	});

	return teamsCount;
}

function getMixedTeams(teams) {
	return teams.sort(() => 0.5 - Math.random());
}

function getMixedChallenges(challenges) {
	return challenges.sort(() => 0.5 - Math.random());
}

module.exports = {
	getGames,
	getGameById,
	getGameIdDb,
	addNewGame,
	deleteGame,
	getPlayerById,
	addPlayerIntoGame,
	removePlayerFromGame,
	kickPlayerFromGame,
	getMixedPlayers,
	getRandomTeamForPlayer,
	isTeamBattlePossible,
	getTeamChallengePlayers,
	getMixedChallenges,
	getMixedTeams,
};
