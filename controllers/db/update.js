const { db } = require("../../config/database");

async function updateGameIntoDB(id, game) {
	return new Promise(async (resolve) => {
		try {
			await db
				.collection("in_progress")
				.doc(id)
				.update({
					...game,
				});
			resolve();
		} catch (error) {
			console.log("error : ", error.message);
			resolve();
		}
	});
}

async function updateGamePlayersIntoDB(id, players) {
	return new Promise(async (resolve) => {
		try {
			await db.collection("in_progress").doc(id).update({
				players,
			});

			resolve();
		} catch (error) {
			resolve();
		}
	});
}

async function updateGamePlayersAndKickedIntoDB(id, game) {
	return new Promise(async (resolve) => {
		await db.collection("in_progress").doc(id).update({
			players: game.players,
			kicked: game.kicked,
		});

		resolve();
	});
}

module.exports = {
	updateGameIntoDB,
	updateGamePlayersIntoDB,
	updateGamePlayersAndKickedIntoDB,
};
