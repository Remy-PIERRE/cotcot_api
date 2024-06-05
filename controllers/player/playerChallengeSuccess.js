const { db } = require("../../config/database");
const games = require("../../model/game");
const turnStart = require("../turn/turnStart");

async function playerChallengeSuccess(socket, payload) {
	const { player, gameId } = payload;

	try {
		// check data //
		if (!player || !gameId) {
			throw new Error("Player ready : data are incomplete");
		}

		// get game //
		const [gameDbId, game] = Object.entries(games).find(([key, value]) => {
			if (value.id === gameId) {
				return [key, value];
			}
		});

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

		if (
			["challenge_success", "challenge_failure"].includes(duo.state) &&
			["challenge_success", "challenge_failure"].includes(playerCurrent.state)
		) {
			if (duo.state === playerCurrent.state) {
				playerCurrent.state = "ready";
				duo.state = "ready";

				console.log(game.players.map((p) => p.points));

				// update db //
				// await db.collection("in_progress").doc(gameDbId).set(game);

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
				playerCurrent.points =
					playerCurrent.state === "challenge_success"
						? playerCurrent.points + 1
						: playerCurrent.points;
				duo.points =
					duo.state === "challenge_success" ? duo.points + 1 : duo.points;

				playerCurrent.state = "ready";
				duo.state = "ready";

				console.log(game.players.map((p) => p.points));

				// update db //
				// await db.collection("in_progress").doc(gameDbId).set(game);

				socket.emit("game:updated", {
					success: true,
					data: game,
				});

				socket.to(`game_id=${game.id}`).emit("game:updated", {
					success: true,
					data: game,
				});
			}

			if (
				game.players.filter((playerInGame) => playerInGame.state === "ready")
					.length === game.players.length
			) {
				turnStart(socket, game);
			}
		}
	} catch (error) {
		console.log("success error : ", error);
	}
}

module.exports = playerChallengeSuccess;
