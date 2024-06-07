function gameDeletedToSender(socket) {
	socket.emit("game:deleted:response", {
		success: true,
	});
}

function gameDeletedToAll(socket, gameId) {
	socket.to(`game_id=${gameId}`).emit("game:canceled", {
		success: true,
	});
}

module.exports = { gameDeletedToSender, gameDeletedToAll };
