const { mixPlayers } = require("../../utils/player");
const {
	randomIntFromIntervalWitout,
	randomIntFromInterval,
} = require("../../utils/random");
const { getTeamsAndPlayers } = require("../../utils/team");
const {
	gameUpdatedToSender,
	gameUpdatedToAll,
} = require("../socket/gameUpdated");
const { challenges } = require("../start/getChallenges");
// const challenges = require("../../assets/json/challenges.json");
const turnTimer = require("../timer/turnTimer");

async function turnStart(socket, game) {
	// reset player //
	game.players.map((player) => {
		player.duo = null;
		player.challenge = null;
		player.doBluff = null;
		player.beBluff = null;
		player.solo = null;
		player.teamChallenge = null;
	});

	// update game turn //
	game.turn += 1;

	// mix players order //
	let mixedPlayers = mixPlayers(game.players);

	// team challenge //
	if (game.turn % game.challengeTeam === 0) {
		// check if team challenge possible - min players / team >= 2 //
		const teams = getTeamsAndPlayers(game);
		if (!Object.values(teams).find((t) => t.length < 2)) {
			// select 20% players in each team, min 2 //
			Object.entries(teams).map(([key, value]) => {
				const selectionNumber =
					(value.length * 20) / 100 > 2
						? Math.round((value.length * 20) / 100)
						: 2;
				teams[key] = value.slice(0, selectionNumber);
			});

			// select team challenge //
			const challenge =
				challenges["team"][
					randomIntFromInterval(0, challenges.team.length - 1)
				];

			// dispatch challenge to players //
			const teamAIndex = randomIntFromInterval(0, 1);
			const teamBIndex = teamAIndex === 0 ? 1 : 0;
			Object.values(teams).map((t, index) =>
				t.map((p) => {
					p.teamChallenge =
						index === 0 ? challenge[teamAIndex] : challenge[teamBIndex];
				})
			);

			game.players.map((p) => {
				if (p.teamChallenge) {
					p.duo = game.players
						.filter((q) => q.teamChallenge && q.team !== p.team)
						.map((q) => q.id);
				}
			});

			// remove team challenge players from player list //
			let removedPlayers = [];
			Object.values(teams).map(
				(t) => (removedPlayers = removedPlayers.concat(...t))
			);

			mixedPlayers = mixedPlayers.filter(
				(p) => !removedPlayers.map((p) => p.id).includes(p.id)
			);
		}
	}

	// set duo //
	const duos = [];
	mixedPlayers.map((player, index) => {
		if (!player.duo) {
			if (
				mixedPlayers.filter((p) => p.team !== player.team && !p.duo).length ===
				0
			) {
				duos.push([player, null]);
			} else {
				const randIndex = randomIntFromInterval(
					0,
					mixedPlayers.filter((p) => p.team !== player.team && !p.duo).length -
						1
				);

				player.duo = mixedPlayers.filter(
					(p) => p.team !== player.team && !p.duo
				)[randIndex].id;
				player.state = "challenge";

				const duo = mixedPlayers.filter(
					(p) => p.team !== player.team && !p.duo
				)[randIndex];
				duo.duo = player.id;
				duo.state = "challenge";

				duos.push([player, duo]);
			}
		}
	});

	// console.log(
	// 	duos.map((duo) =>
	// 		duo.map((p) => {
	// 			if (p) {
	// 				return p.name;
	// 			}
	// 			return null;
	// 		})
	// 	)
	// );

	// créer un liste de "battles" à distribuer à tous les duos //
	const challengesCopy = JSON.parse(JSON.stringify(challenges["battle"]));

	// distribution des battles && bluff si besoin //
	duos.map((duo) => {
		// if solo //
		if (duo.includes(null)) {
			const soloIndex = randomIntFromInterval(0, challenges["solo"].length - 1);
			duo.find((p) => !null).solo = challenges["solo"][soloIndex][0];
		} else {
			// déterminer s'il y a bluff ou non //
			const haveBluff = randomIntFromInterval(0, 100);
			if (haveBluff <= game.bluffChances) {
				// séléctionner un bluff dans la liste //
				const bluffIndex = randomIntFromInterval(
					0,
					challenges["bluff"].length - 1
				);
				const bluff = challenges["bluff"][bluffIndex];

				// distribuer le bluff aux joueurs du duo //
				const doBluffIndex = randomIntFromInterval(0, 1);
				const beBluffIndex = doBluffIndex === 0 ? 1 : 0;
				duo[doBluffIndex]["doBluff"] = bluff[0];
				duo[beBluffIndex]["beBluff"] = bluff[1];
			}

			// séléctionner la battle dans la liste //
			const challengesIndex = randomIntFromInterval(
				0,
				challengesCopy.length - 1
			);
			const challenge = challengesCopy[challengesIndex];
			challengesCopy.splice(challengesIndex, 1);

			// distribuer la battle aux joueurs du duo //
			const challengeIndex_1 = randomIntFromInterval(0, 1);
			duo[0].challenge = challenge[challengeIndex_1];
			const challengeIndex_2 = challengeIndex_1 === 0 ? 1 : 0;
			duo[1].challenge = challenge[challengeIndex_2];
		}
	});

	// update players state //
	game.players.map((playerInGame) => (playerInGame.state = "challenge"));

	// start turn timer //
	game.turnStart = Date.now();
	turnTimer(socket, game);

	// emit game updated to all //
	gameUpdatedToSender(socket, game);
	gameUpdatedToAll(socket, game);
}

module.exports = turnStart;
