const games = require("../../model/game");

async function playerChallengeSuccess(socket, payload) {
	const { player, gameId } = payload;

	try {
		// check data //
		if (!player || !gameId) {
			throw new Error("Player ready : data are incomplete");
		}

		// get game //
		const game = Object.values(games).find((game) => game.id === gameId);

		// check if game exists //
		if (!game) {
			throw new Error("Player ready : game does not exists");
		}

		// check if player in game //
		const playerCurrent = game.players.find(
			(playerInGame) => playerInGame.id === player.id
		);
		if (!playerCurrent) {
			throw new Error("Player ready : player does not exists");
		}

		// update player //
		playerCurrent.state = "challenge_success";

		// get duo //
		const duo = game.players.find(
			(playerInGame) => playerInGame.id === player.duo
		);

		if (duo.state === playerCurrent.state) {
			playerCurrent.state = "ready";
			duo.state = "ready";

			socket.emit("game:updated", {
				success: true,
				data: game,
			});

			socket.to(`game_id=${game.id}`).emit("game:updated", {
				success: true,
				data: game,
			});
		}

		if (duo.state !== playerCurrent.state) {
			playerCurrent.state = "ready";
			duo.state = "ready";

			playerCurrent.points =
				playerCurrent.state === "challenge_success"
					? playerCurrent.points + 1
					: playerCurrent.points;
			duo.points =
				duo.state === "challenge_success" ? duo.points + 1 : duo.points;

			socket.emit("game:updated", {
				success: true,
				data: game,
			});

			socket.to(`game_id=${game.id}`).emit("game:updated", {
				success: true,
				data: game,
			});
		}
	} catch (error) {}
}

module.exports = playerChallengeSuccess;
