const gameOptions = require("../../assets/json/gameOptions.json");
const { getGameIdDb } = require("../../model/Games");
const { updateGameIntoDB } = require("../db/update");
const {
	gameUpdatedToSender,
	gameUpdatedToAll,
} = require("../socket/gameUpdated");

async function turnResolution(socket, game) {
	// bluff challenge //
	if (game.players.find((p) => p.doBluff || p.beBluff)) {
		resolveBluffChallenge(game);
	}

	// team challenge //
	if (
		game.players.find(
			(p) =>
				p.teamChallenge &&
				["challenge_success", "challenge_failure"].includes(p.state)
		)
	) {
		resolveTeamChallenge(game);
	}

	// solo challenge //
	if (
		game.players.find(
			(p) =>
				p.solo && ["challenge_success", "challenge_failure"].includes(p.state)
		)
	) {
		resolveSoloChallenge(game);
	}

	// battle challenge //
	if (
		game.players.find(
			(p) =>
				p.battle && ["challenge_success", "challenge_failure"].includes(p.state)
		)
	) {
		resolveBattleChallenge(game);
	}

	console.log(
		"turn resolution : ",
		game.players.map((p) => p.state)
	);

	if (!game.players.find((p) => p.state !== "")) {
		game.players.map((p) => (p.state = ""));

		// update db //
		const gameIdDb = getGameIdDb(game.id);
		console.log("gameIdDb : turnResolution : ", gameIdDb);
		updateGameIntoDB(gameIdDb, game);

		// emit game updated to all //
		gameUpdatedToSender(socket, game);
		gameUpdatedToAll(socket, game);

		console.log("turn over", game.id);
	}
}

function resolveTeamChallenge(game) {
	const captains = game.players.filter((p) => p.teamCaptain);
	if (captains.length !== 2) {
		// dev //
		console.log("Captin error => ", captains);

		return;
	}

	if (
		captains.filter((c) =>
			["challenge_success", "challenge_failure"].includes(c.state)
		).length !== captains.length
	) {
		// dev //
		console.log("All captains are not ready");

		return;
	}

	const players = game.players.filter((p) => p.teamChallenge);
	if (captains[0].state === captains[1].state) {
		// dev //
		console.log("Captains disagree");

		resetPlayers(players);
		players.map((p) => (p.state = ""));
		return;
	}

	const winner = captains.find((p) => p.state === "challenge_success").team;
	players.map((p) => {
		if (p.team === winner) {
			p.points += gameOptions.teamChallengePoints;
		}
	});

	resetPlayers(players);
	players.map((p) => (p.state = ""));
}

function resolveSoloChallenge(game) {
	const player = game.players.find(
		(p) =>
			p.solo && ["challenge_success", "challenge_failure"].includes(p.state)
	);

	if (player.state === "challenge_success") {
		player.points += gameOptions.soloChallengePoints;
	}

	resetPlayers([player]);
	player.state = "";
}

function resolveBattleChallenge(game) {
	const player = game.players.find(
		(p) =>
			p.battle && ["challenge_success", "challenge_failure"].includes(p.state)
	);

	const duo = game.players.find(
		(p) =>
			p.battle &&
			p.duo === player.id &&
			["challenge_success", "challenge_failure"].includes(p.state)
	);

	if (!player || !duo) {
		// dev //
		console.log("player in battle is not ready");

		return;
	}

	if (player.state === duo.state) {
		// dev //
		console.log("Battlers disagree");

		resetPlayers([player, duo]);
		player.state === "";
		duo.state === "";
		return;
	}

	if (player.state === "challenge_success") {
		player.points += duo.points === 0 ? 1 : duo.points;
	} else {
		duo.points += player.points === 0 ? 1 : player.points;
	}

	resetPlayers([player, duo]);
	player.state === "";
	duo.state === "";
}

function resolveBluffChallenge(game) {
	const player = game.players.find(
		(p) => p.doBluff && ["bluff_success", "bluff_failure"].includes(p.doBluff)
	);
	if (!player) {
		// dev //
		console.log("bluff not validated");

		return;
	}

	const duo = game.players.find(
		(p) =>
			p.beBluff &&
			p.duo === player.id &&
			["bluff_success", "bluff_failure"].includes(p.beBluff)
	);
	if (!duo) {
		// dev //
		console.log("bluff : no duo");

		return;
	}

	if (player.doBluff === "bluff_success" && duo.beBluff === "bluff_success") {
		player.points += gameOptions.bluffChallengePoints || 1;
	}

	delete player.doBluff;
	delete duo.beBluff;
}

function resetPlayers(players) {
	players.map((p) => {
		delete p.challenge;
		delete p.battle;
		delete p.duo;
		delete p.doBluff;
		delete p.beBluff;
		delete p.solo;
		delete p.teamChallenge;
		delete p.teamCaptain;
		p.state = "";
	});
}

module.exports = turnResolution;
