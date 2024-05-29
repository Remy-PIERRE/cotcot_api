const {
	randomIntFromIntervalWitout,
	randomIntFromInterval,
} = require("../../utils/random");
const challenges = require("../../assets/json/challenges.json");
const turnTimer = require("../timer/turnTimer");

async function turnStart(socket, game) {
	// reset duo //
	game.players.map((player) => (player.duo = null));

	// set duo //
	const duos = [];
	game.players.map((player, index) => {
		if (!player.duo) {
			const randIndex = randomIntFromIntervalWitout(
				0,
				game.players.length - 1,
				index
			);

			player.duo = game.players[randIndex].id;
			player.state = "challenge";
			game.players[randIndex].duo = player.id;
			game.players[randIndex].state = "challenge";

			duos.push([index, randIndex]);
		}
	});

	// set challenges //
	const challengesCopy = JSON.parse(JSON.stringify(challenges));
	duos.map((duo) => {
		const challengesIndex = randomIntFromInterval(0, challengesCopy.length - 1);
		const challenges = challengesCopy[challengesIndex];
		challengesCopy.splice(challengesIndex, 1);

		const challengeIndex_1 = randomIntFromInterval(0, 1);
		const challengeIndex_2 = challengeIndex_1 === 0 ? 1 : 0;
		game.players[duo[0]].challenge = challenges[challengeIndex_1];
		game.players[duo[1]].challenge = challenges[challengeIndex_2];
	});

	game.players.map((playerInGame) => (playerInGame.state = "challenge"));

	game.turnStart = Date.now();

	// start turn timer //
	turnTimer(socket, game);

	// send response to sender //
	socket.emit("game:updated", {
		success: true,
		data: {
			...game,
		},
	});

	// send info to all players in room //
	socket.to(`game_id=${game.id}`).emit("game:updated", {
		success: true,
		data: game,
	});
}

module.exports = turnStart;
