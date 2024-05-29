const {
	randomIntFromInterval,
	randomTeamsFromTeamsList,
} = require("../../utils/random");
const { db } = require("../../config/database");
const games = require("../../model/game.js");

async function gameCreate(socket, payload) {
	try {
		const { player, game } = payload;

		// check data //
		if (
			!player.id ||
			!player.name ||
			!player.pseudo ||
			!game.type ||
			!game.duration ||
			!game.minPlayers ||
			!game.maxPlayers
		) {
			throw new Error("Game create : data are missing");
		}

		// create game //
		game.id = randomIntFromInterval(100000, 999999);
		game.state = "lobby";
		game.gameStart = Date.now();
		game.teams = randomTeamsFromTeamsList(2);
		// game.players = [{ ...player }];
		game.players = [];
		game.master = { id: player.id, name: player.name };

		// send to db //
		// const response = await db.collection("inProgress").add(game);

		// check response //
		// if (!response.id) {
		// 	throw new Error("Game create : server error");
		// }

		// add to games object //
		// games[response.id] = response.data;

		// send response to sender //
		// socket.emit("game:create:response", {
		// 	success: true,
		// 	data: games[response.id],
		// });

		// DEV //
		games[randomIntFromInterval(0, 100000)] = game;

		console.log("games : ", games);

		socket.emit("game:create:response", {
			success: true,
			data: game,
		});
	} catch (error) {
		// send response to sender //
		socket.emit("game:create:response", {
			message: error.message,
		});
	}
}

module.exports = gameCreate;
