function gameStarted(socket, game) {
	socket.emit("game:start:response", {
		success: true,
		data: game,
	});
}

module.exports = { gameStarted };
