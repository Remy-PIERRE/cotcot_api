const { getGameIdDb, deleteGame } = require("../../model/Games");
const { deleteGameFromDb } = require("../db/delete");
const { setIntoDb } = require("../db/set");
const {
	gameUpdatedToSender,
	gameUpdatedToAll,
} = require("../socket/gameUpdated");
const { clearRoom } = require("../socket/room");

async function gameOver(socket, game) {
	const gameIdDb = getGameIdDb(game.id);

	game.state = "over";

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

	game.winner = winner;
	game.teamsPoints = teamsPoints;

	game.players.map((p) => {
		delete p.state;
		delete p.challenge;
		delete p.battle;
		delete p.duo;
		delete p.doBluff;
		delete p.beBluff;
		delete p.solo;
		delete p.teamChallenge;
		delete p.teamCaptain;
	});

	// send response && clear room //
	gameUpdatedToSender(socket, game);
	gameUpdatedToAll(socket, game);
	clearRoom(socket, game.id);

	delete game.gameStart;
	delete game.resolutionDuration;
	delete game.resolutionStart;
	delete game.turnDuration;
	delete game.turnStart;
	delete game.maxPlayers;
	delete game.minPlayers;
	delete game.state;

	// send to db //
	await setIntoDb(game, "over");
	await deleteGameFromDb(gameIdDb, "in_progress");

	// update games object //
	deleteGame(game.id);
}

module.exports = gameOver;
