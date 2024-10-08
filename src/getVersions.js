import { EOL } from "node:os";
import cmd from "./cmd.js";

const getAllVersions = async (packageName) => {
	try {
		return JSON.parse(
			await cmd(
				`npm view ${packageName?.trim()?.toLowerCase()} versions --json`,
			),
		);
	} catch (error) {
		console.error(
			`❌ ${packageName}:`,
			error.message?.split(EOL)[0] || error?.message || error,
		);
		return null;
	}
};

const getLatestPatch = async (packageName, currentVersion) => {
	const [major, minor] = currentVersion.replace(/[^a-z0-9.]/gi, "").split(".");
	const versions = await getAllVersions(packageName);
	const regex = new RegExp(`^${major}\\.${minor}`);

	if (!versions) return null;

	let latestPatch = "";

	for (const version of versions) {
		if (regex.test(version)) {
			latestPatch = version;
		}
	}

	return latestPatch || currentVersion;
};

const getLatestMinor = async (packageName, currentVersion) => {
	const [major] = currentVersion.replace(/[^a-z0-9.]/gi, "").split(".");
	const versions = await getAllVersions(packageName);
	const regex = new RegExp(`^${major}\\.`);

	if (!versions) return null;

	let latestMinor = "";

	for (const version of versions) {
		if (regex.test(version) && !/-/.test(version)) {
			latestMinor = version;
		}
	}

	return latestMinor || currentVersion;
};

const getLatestMajor = async (packageName, currentVersion) => {
	const versions = await getAllVersions(packageName);

	if (!versions) return null;

	let latestMajor = "";

	for (const version of versions) {
		if (!/-/.test(version)) {
			latestMajor = version;
		}
	}

	return latestMajor || currentVersion;
};

const getLatestVersion = async (packageName) => {
	try {
		const versions = await getAllVersions(packageName);
		return versions.pop();
	} catch (error) {
		console.error(
			`❌ ${packageName}:`,
			error.message?.split(EOL)[0] || error?.message || error,
		);
		return null;
	}
};

export default {
	latest: getLatestVersion,
	major: getLatestMajor,
	minor: getLatestMinor,
	patch: getLatestPatch,
};
