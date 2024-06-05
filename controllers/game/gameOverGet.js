const { db } = require("../../config/database");
const gamesOver = require("../../model/gamesOver");

async function gameOverGet(socket, payload) {
	const { gameId } = payload;

	try {
		if (!gameId) {
			throw new Error("Game over get : data are incomplete");
		}

		if (gamesOver.length === 0) {
			const data = await db.collection("over").get();
			data.forEach((doc) => {
				gamesOver.push(doc.data());
			});
		}

		const game = gamesOver.find((gameOver) => gameOver.id === gameId);

		if (!game) {
			throw new Error("Game over get : this game doesnot exists");
		}

		socket.emit("gameOver:updated", {
			success: true,
			data: game,
		});
	} catch (error) {
		socket.emit("gameOver:updated", {
			success: false,
			message: error.message,
		});
	}
}

module.exports = gameOverGet;
