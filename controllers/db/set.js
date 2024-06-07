const { db } = require("../../config/database");

async function setIntoDb(game, collection) {
	return new Promise(async (resolve) => {
		const response = await db.collection(collection).add(game);

		if (response.id) {
			resolve({ id: response.id });
		} else {
			const message = "Error setting data into DB";
			resolve({ message });
		}
	});
}

module.exports = { setIntoDb };
