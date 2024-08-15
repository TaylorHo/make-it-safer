import { exec } from "node:child_process";

const cmd = (command) =>
	new Promise((resolve, reject) =>
		exec(command, (error, stdout) => (error ? reject(error) : resolve(stdout))),
	);

export default cmd;
