const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

// init server //
const app = express();
const server = http.createServer(app);

// Initialisation de Socket.IO //
// TODO - cors origin !!! //
const io = socketIo(server, {
	cors: {
		origin: "*",
		credentials: true,
		optionSuccessStatus: 200,
		methods: ["GET", "POST"],
	},
});

app.use(cors());

module.exports = { io, server };
