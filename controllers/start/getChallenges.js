// Importer les modules nécessaires
const xlsx = require("node-xlsx");
const appRoot = process.cwd();

const challenges = {};

function getChallenges() {
	const battleData = xlsx.parse(`${appRoot}/assets/challenges/battle.xlsx`)[0]
		.data;
	challenges["battle"] = battleData.filter((data) => data.length === 2);

	const bluffData = xlsx.parse(`${appRoot}/assets/challenges/bluff.xlsx`)[0]
		.data;
	challenges["bluff"] = bluffData.filter((data) => data.length === 2);

	const teamData = xlsx.parse(`${appRoot}/assets/challenges/team.xlsx`)[0].data;
	challenges["team"] = teamData.filter((data) => data.length === 2);

	const soloData = xlsx.parse(`${appRoot}/assets/challenges/solo.xlsx`)[0].data;
	challenges["solo"] = soloData.filter(
		(data) => data.length === 1 && data !== ""
	);
}

module.exports = { getChallenges, challenges };
