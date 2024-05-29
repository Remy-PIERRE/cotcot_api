const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// init server //
const app = express();
const server = http.createServer(app);

// Initialisation de Socket.IO //
// TODO - cors origin !!! //
const io = socketIo(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

module.exports = { io, server };
