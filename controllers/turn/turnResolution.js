async function turnResolution(socket, game) {
    try {
		

		// // update player //
		// playerCurrent.state = "challenge_success";

		// // get duo //
		// const duo = game.players.find(
		// 	(playerInGame) => playerInGame.id === player.duo
		// );

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

	game.players.map((playerInGame) => (playerInGame.state = "turn_resolution"));

	socket.emit("game:updated", {
		success: true,
		data: game,
	});
}

module.exports = turnResolution;
