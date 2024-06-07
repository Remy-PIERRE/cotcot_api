function gameJoined(socket, game) {
	socket.emit("game:join:response", {
		success: true,
		data: game,
	});
}

module.exports = { gameJoined };
