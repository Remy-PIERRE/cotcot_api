const {
	getGameById,
	getPlayerById,
	addPlayerIntoGame,
} = require("../../model/Games.js");
const { updateGamePlayersIntoDB } = require("../db/update.js");
const { sendError } = require("../socket/error.js");
const { gameJoined } = require("../socket/gameJoined.js");
const { gameUpdatedToAll } = require("../socket/gameUpdated.js");
const { joinRoom } = require("../socket/room.js");

async function gameJoin(socket, payload) {
	try {
		// check payload //
		const { player, gameId } = payload;
		if (!player || !gameId) {
			throw new Error("Data are missing");
		}

		// DEV //
		console.log("player joining : ", payload.player.name, payload.gameId);

		// get game //
		const [gameIdDb, game] = getGameById(gameId);
		if (!game) {
			throw new Error("Game does not exists");
		}

		// if player is already registered into game //
		const playerCurrent = getPlayerById(game, player.id);
		if (playerCurrent) {
			console.log("already in room : ", player.name);
			joinRoom(socket, gameId);
			gameJoined(socket, game);
			return;
		}

		// forbid joining if party is full //
		if (game.players && game.players.length >= game.maxPlayers) {
			throw new Error("Game is full");
		}

		// forbid joining is player was kicked //
		if (game.kicked && game.kicked.find((kicked) => kicked === player.id)) {
			throw new Error("Entering game denied");
		}

		// add player to game //
		setupPlayer(player);
		addPlayerIntoGame(game, player);

		// update db //
		await updateGamePlayersIntoDB(gameIdDb, game.players);

		// add player to room && send response //
		joinRoom(socket, gameId);
		gameJoined(socket, game);
		gameUpdatedToAll(socket, game);

		console.log("Game joined : ", game.id, player.name);
	} catch (error) {
		// send response to sender //
		const event = "game:join:response";
		const message = error.message;
		console.log("game joined error : ", message);
		sendError(socket, event, {
			success: false,
			message,
		});
	}
}

function setupPlayer(player) {
	player.state = "";
	player.points = 0;
}

module.exports = gameJoin;
