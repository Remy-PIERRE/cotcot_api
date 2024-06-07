function sendError(socket, event, payload) {
	socket.emit(event, payload);
}

module.exports = { sendError };
