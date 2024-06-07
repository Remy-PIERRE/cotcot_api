const { db } = require("../../config/database");

async function deleteGameFromDb(id, collection) {
	return new Promise(async (resolve) => {
		await db.collection(collection).doc(id).delete();
		resolve();
	});
}

module.exports = { deleteGameFromDb };
