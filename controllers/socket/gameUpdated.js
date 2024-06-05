function gameUpdatedToSender(socket, game) {
	socket.emit("game:updated", {
		success: true,
		data: game,
	});
}

function gameUpdatedToAll(socket, game) {
	socket.to(`game_id=${game.id}`).emit("game:updated", {
		success: true,
		data: game,
	});
}

module.exports = { gameUpdatedToSender, gameUpdatedToAll };
