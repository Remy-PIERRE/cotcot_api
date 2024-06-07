const { io, server } = require("./config/server");
const beBluffConfirm = require("./controllers/bluff/beBluffConfirm.js");
const doBluffconfirm = require("./controllers/bluff/doBluffConfirm.js");
const gameCancel = require("./controllers/game/gameCancel");
const gameCreate = require("./controllers/game/gameCreate");
const gameGet = require("./controllers/game/gameGet");
const gameJoin = require("./controllers/game/gameJoin");
const gamekick = require("./controllers/game/gameKick");
const gameLeave = require("./controllers/game/gameLeave");
const gameOverGet = require("./controllers/game/gameOverGet.js");
const gameStart = require("./controllers/game/gameStart");
const playerChallengeFailure = require("./controllers/player/playerChallengeFailure.js");
const playerChallengeOver = require("./controllers/player/playerChallengeOver");
const playerChallengeSuccess = require("./controllers/player/playerChallengeSuccess.js");
const playerReady = require("./controllers/player/playerReady");
const getAllGamesInProgress = require("./controllers/start/getAllGamesInProgress");
const { getChallenges } = require("./controllers/start/getChallenges.js");
const test = require("./utils/test.js");

// test();
// return;

// get all games in progress at server start //
getAllGamesInProgress();
getChallenges();

// io routing //
io.on("connection", (socket) => {
	console.log("Un utilisateur s'est connecté");

	// game get //
	socket.on("game:get", (payload) => {
		gameGet(socket, payload);
	});

	// game create //
	socket.on("game:create", (payload) => {
		gameCreate(socket, payload);
	});

	// game cancel //
	socket.on("game:cancel", (payload) => {
		gameCancel(socket, payload);
	});

	// game join //
	socket.on("game:join", (payload) => {
		gameJoin(socket, payload);
	});

	// game leave //
	socket.on("game:leave", (payload) => {
		gameLeave(socket, payload);
	});

	socket.on("disconnect", () => {
		console.log("Un utilisateur s'est déconnecté");
	});

	// game kick //
	socket.on("game:kick", (payload) => {
		gamekick(socket, payload);
	});

	// game start //
	socket.on("game:start", (payload) => {
		gameStart(socket, payload);
	});

	// players ready to challenge //
	socket.on("player:ready", (payload) => {
		playerReady(socket, payload);
	});

	// challenge clear //
	socket.on("player:challengeOver", (payload) => {
		playerChallengeOver(socket, payload);
	});

	// challenge success //
	socket.on("player:challengeSuccess", (payload) => {
		playerChallengeSuccess(socket, payload);
	});

	// challenge failure //
	socket.on("player:challengeFailure", (payload) => {
		playerChallengeFailure(socket, payload);
	});

	socket.on("gameOver:get", (payload) => {
		gameOverGet(socket, payload);
	});

	// do bluff confirm //
	socket.on("doBluff:confirm", (payload) => {
		doBluffconfirm(socket, payload);
	});

	// be bluff confirm //
	socket.on("beBluff:confirm", (payload) => {
		beBluffConfirm(socket, payload);
	});
});

// starting server //
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
