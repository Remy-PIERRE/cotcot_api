const { db } = require("../../config/database");
const games = require("../../model/game");

async function gameOver(socket, gameData) {
	// get game //
	if (games) {
		const [gameDbId, game] = Object.entries(games).find(([key, value]) => {
			if (value.id === gameData.id) {
				return [key, value];
			}
		});

		game.state = "over";

		// const teamsPoints = game.teams.map((team) => {
		// 	const points = game.players
		// 		.filter((player) => player.teams === team)
		// 		.reduce((a, b) => a + b.points, 0);
		// 	return {
		// 		team,
		// 		points,
		// 	};
		// });

		const teamsPoints = {};
		game.players.map((player) => {
			if (player.team in teamsPoints) {
				teamsPoints[player.team] += player.points;
			} else {
				teamsPoints[player.team] = player.points;
			}
		});

		const winner = Object.entries(teamsPoints).sort(
			([teamA, pointsA], [teamB, pointsB]) => {
				if (pointsA < pointsB) return 1;
				else if (pointsB < pointsA) return -1;
				else return 0;
			}
		)[0][0];

		console.log(teamsPoints);
		console.log(winner);

		game.winner = winner;
		game.teamsPoints = teamsPoints;

		game.players.map((player) => {
			delete player.challenge;
			delete player.duo;
			delete player.state;
		});

		delete game.gameStart;
		delete game.resolutionDuration;
		delete game.resolutionStart;
		delete game.turnDuration;
		delete game.turnStart;

		// send to db //
		await db.collection("over").add(game);
		await db.collection("in_progress").doc(gameDbId).delete();

		// update games object //
		delete games[gameDbId];

		// send event to sender //
		socket.emit("game:updated", {
			success: true,
			data: game,
		});

		// send event to all in room //
		socket.to(`game_id=${game.id}`).emit("game:updated", {
			success: true,
			data: game,
		});
	}
}

module.exports = gameOver;
