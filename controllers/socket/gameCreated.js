function gameCreated(socket, game) {
	socket.emit("game:create:response", {
		success: true,
		data: game,
	});
}

module.exports = { gameCreated };
