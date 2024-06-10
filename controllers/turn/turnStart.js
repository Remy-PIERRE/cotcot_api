const {
	getMixedPlayers,
	isTeamBattlePossible,
	getTeamChallengePlayers,
	getMixedChallenges,
} = require("../../model/Games");
const { randomIntFromInterval } = require("../../utils/random");
const { updateGameIntoDB } = require("../db/update");
const {
	gameUpdatedToSender,
	gameUpdatedToAll,
} = require("../socket/gameUpdated");
const { challenges } = require("../start/getChallenges");
// const challenges = require("../../assets/json/challenges.json");
const turnTimer = require("../timer/turnTimer");

async function turnStart(socket, gameIdDb, game) {
	// reset players //
	resetPlayers(game);

	// update game //
	updateGameTurn(game);

	// mix players order //
	let mixedPlayers = getMixedPlayers(game.players);

	// if team battle //
	if (game.turn % game.challengeTeam === 0) {
		setupTeamBattle(game);
		mixedPlayers = mixedPlayers.filter((p) => !p.teamChallenge);
	}

	// set duos //
	setupDuos(mixedPlayers);

	// setup Challenges //
	setupChallenges(mixedPlayers);

	// setup bluff //
	setupBluff(game, mixedPlayers);

	// update players state //
	game.players.map((playerInGame) => (playerInGame.state = "challenge"));

	// start turn timer //
	game.turnStart = Date.now();
	turnTimer(socket, game);

	// update db //
	updateGameIntoDB(gameIdDb, game);

	// emit game updated to all //
	gameUpdatedToSender(socket, game);
	gameUpdatedToAll(socket, game);

	console.log("turn started : all challenge displayed");
}

function updateGameTurn(game) {
	game.turn += 1;
}

function resetPlayers(game) {
	game.players.map((p) => {
		delete p.challenge;
		delete p.battle;
		delete p.duo;
		delete p.doBluff;
		delete p.beBluff;
		delete p.solo;
		delete p.teamChallenge;
		delete p.teamCaptain;
	});
}

function setupTeamBattle(game) {
	// check if enought players //
	if (!isTeamBattlePossible(game)) {
		return;
	}

	// get teams players selected - 2 teams maximum //
	const teams = getTeamChallengePlayers(game);
	while (Object.keys(teams).length > 2) {
		const key = Object.keys(teams)[2];
		delete teams[key];
	}

	// select team challenge //
	const challengesCopy = JSON.parse(JSON.stringify(challenges));
	const challenge = getMixedChallenges(
		challengesCopy["team"][
			randomIntFromInterval(0, challengesCopy["team"].length - 1)
		]
	);

	// dispatch challenge to players //
	Object.values(teams).map((t, index) => {
		const captainIndex = randomIntFromInterval(0, t.length - 1);
		t.map((p, i) => {
			p.teamChallenge = challenge[index];
			if (i === captainIndex) {
				p.teamCaptain = true;
			}
		});
	});
}

function setupDuos(players) {
	players.map((p) => {
		if (p.duo) {
			return;
		}

		const others = players.filter((q) => !q.duo && q.team !== p.team);
		if (others.length > 0) {
			const index = randomIntFromInterval(0, others.length - 1);
			p.duo = others[index].id;
			others[index].duo = p.id;
		}
	});
}

function setupChallenges(players) {
	const challengesCopy = JSON.parse(JSON.stringify(challenges));
	const soloChallenges = challengesCopy["solo"];
	const duoChallenges = challengesCopy["battle"];

	players.map((p) => {
		if (!p.duo) {
			return setupSoloChallenge(p, soloChallenges);
		}

		if (!p.challenge) {
			setupDuoChallenge(players, p, duoChallenges);
		}
	});
}

function setupSoloChallenge(player, soloChallenges) {
	const index = randomIntFromInterval(0, soloChallenges.length - 1);
	player.solo = soloChallenges[index][0];
	soloChallenges.splice(index, 1);
}

function setupDuoChallenge(players, player, duoChallenges) {
	const duo = players.find((p) => p.id === player.duo);
	const index = randomIntFromInterval(0, duoChallenges.length - 1);
	const challenge = getMixedChallenges(duoChallenges[index]);
	player.battle = challenge[0];
	duo.battle = challenge[1];
	duoChallenges.splice(index, 1);
}

function setupBluff(game, players) {
	const bluffChallenges = challenges["bluff"];
	const passed = [];

	players.map((p) => {
		if (!p.duo || passed.includes(p.id)) {
			return;
		}
		passed.push(p.duo);

		if (randomIntFromInterval(0, 100) < game.bluffChances) {
			const duo = players.find((q) => q.id === p.duo);
			const index = randomIntFromInterval(0, bluffChallenges.length - 1);
			const challenge = bluffChallenges[index];

			const pIndex = randomIntFromInterval(0, 1);
			const qIndex = pIndex === 0 ? 1 : 0;
			const role = ["doBluff", "beBluff"];
			p[role[pIndex]] = challenge[pIndex];
			duo[role[qIndex]] = challenge[qIndex];

			bluffChallenges.splice(index, 1);
		}
	});
}

module.exports = turnStart;
// module.exports = { setupTeamBattle, setupDuos, setupChallenges, setupBluff };
