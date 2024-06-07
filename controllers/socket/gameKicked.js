function gameKicked(socket, game) {
	socket.emit("game:kick:response", {
		success: true,
		data: game,
	});
}

module.exports = { gameKicked };
