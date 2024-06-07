function gameLeaved(socket) {
	socket.emit("game:leave:response", {
		success: true,
	});
}

module.exports = { gameLeaved };
