const { getChallenges } = require("../controllers/start/getChallenges");
const {
	setupTeamBattle,
	setupDuos,
	setupChallenges,
	setupBluff,
} = require("../controllers/turn/turnStart");
const {
	getRandomTeamForPlayer,
	getTeamChallengePlayers,
	getMixedPlayers,
} = require("../model/Games");
const { mixPlayers } = require("./player");

const game = {
	teams: ["Oies", "Dindons", "Coqs"],
	players: [
		{
			id: 1,
			team: "Oies",
		},
		{
			id: 2,
			team: "Oies",
		},
		{
			id: 3,
			team: "Oies",
		},
		{
			id: 4,
			team: "Oies",
		},
		{
			id: 5,
			team: "Coqs",
		},
		{
			id: 6,
			team: "Coqs",
		},
		{
			id: 7,
			team: "Coqs",
		},
		{
			id: 8,
			team: "Dindons",
		},
		{
			id: 9,
			team: "Dindons",
		},
		{
			id: 10,
			team: "Dindons",
		},
	],
	bluffChances: 50,
};

// getRandomTeamForPlayer //
// function test() {
// 	game.players.map((p) => {
// 		p.team = getRandomTeamForPlayer(game);
// 		console.log("player : ", p.id, p.team);
// 	});

// 	const count = {};
// 	game.players.map((p) => {
// 		if (p.team) {
// 			if (!count.hasOwnProperty(p.team)) {
// 				count[p.team] = 1;
// 			} else {
// 				count[p.team] += 1;
// 			}
// 		}
// 	});
// 	console.log("count : ", count);
// }

// getTeamChallengePlayers //
// function test() {
// 	const teams = getTeamChallengePlayers(game);
// 	console.log(teams);
// }

// seteupTeamBattle //
// function test() {
// 	getChallenges();
// 	let mixedPlayers = getMixedPlayers(game.players);
// 	console.log(mixedPlayers.map((p) => p.id));
// 	setupTeamBattle(game, mixedPlayers);
// 	mixedPlayers = mixedPlayers.filter((p) => !p.teamChallenge);

// 	console.log(game.players.map((p) => [p.id, p.teamChallenge, p.teamCaptain]));
// 	console.log(mixedPlayers.map((p) => p.id));
// }

function test() {
	let mixedPlayers = getMixedPlayers(game.players);
	console.log(
		"mixedPlayers : ",
		mixedPlayers.map((p) => p.id)
	);
	getChallenges();
	setupDuos(mixedPlayers);
	console.log(
		"duos : ",
		game.players.map((p) => [p.id, p.duo])
	);
	setupChallenges(mixedPlayers);
	setupBluff(game, mixedPlayers);

	console.log(
		game.players.map((p) => {
			if (p.doBluff) {
				return ["do", p.id, p.duo, p.doBluff];
			}
			if (p.beBluff) {
				return ["be", p.id, p.duo, p.beBluff];
			}
		})
	);
}

module.exports = test;
