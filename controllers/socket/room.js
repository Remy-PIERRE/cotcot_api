function joinRoom(socket, gameId) {
	socket.join(`game_id=${gameId}`);
}

function leaveRoom(socket, gameId) {
	socket.leave(`game_id=${gameId}`);
}

function clearRoom(socket, gameId) {
	socket.in(`game_id=${gameId}`).socketsLeave(`game_id=${gameId}`);
}

module.exports = { joinRoom, leaveRoom, clearRoom };
