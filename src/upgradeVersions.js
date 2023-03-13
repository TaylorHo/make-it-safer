import { readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import { log, styles as sh, showUpdated } from './styles.js';
import getVersionBy from './getVersions.js';

async function upgradeVersions(args) {
  const path = `${process.cwd()}/package.json`;
  const packageFile = readFileSync(path, "utf-8");
  const packageJSON = JSON.parse(packageFile);
  const { dependencies, devDependencies } = packageJSON;
  const totalDependencies =
    (dependencies ? Object?.keys(dependencies)?.length || 0 : 0) +
      (devDependencies ? Object?.keys(devDependencies)?.length || 0 : 0) || 0;
  const hasUpdate = [];
  const hasError = [];

  let largestPackageName = "";
  let count = 0;

  if (!totalDependencies || totalDependencies === 0) {
    log("No dependencies in package.json 👾");

    return;
  }

  const option =
    args?.[0] && getVersionBy?.[args?.[0]?.replace(/^--/, "")]
      ? args?.[0]?.replace(/^--/, "")
      : "latest";

  const compareVersions = async (dependency) => {
    const dependencyType = dependencies?.[dependency]
      ? dependencies
      : devDependencies;
    const currentVersion = dependencyType[dependency];
    const operators = currentVersion.replace(/[^^><=~]+/g, "");

    if (dependency.length > largestPackageName.length)
      largestPackageName = dependency;

    process.stdout.write(
      `\x1b[0G🔎 ${String(++count).padStart(
        String(totalDependencies).length,
        " "
      )}/${totalDependencies}   ${dependency.padEnd(
        largestPackageName.length,
        " "
      )}`
    );

    if (/-/g.test(currentVersion)) {
      log(
        `${sh.bold}${dependency}${sh.dim}:${sh.reset} \t${sh.dim}Ignoring tag version (${sh.yellow}${currentVersion}${sh.reset}${sh.dim})${sh.reset}`
      );
      return;
    }

    const latestVersion = await getVersionBy[option](
      dependency,
      currentVersion
    );

    if (!latestVersion) {
      hasError.push(latestVersion);
      return;
    }

    const newVersion = `${operators}${latestVersion}`;

    if (currentVersion !== newVersion) {
      dependencyType[dependency] = newVersion;

      hasUpdate.push({
        packageName: dependency,
        previousVersion: currentVersion,
        newVersion: newVersion,
      });
    }
  };

  log(`\n📦 Looking for ${sh.bold}${option}${sh.reset} versions...\n`);

  for (const dependency in dependencies) await compareVersions(dependency);
  for (const dependency in devDependencies) await compareVersions(dependency);

  process.stdout.write(
    `\x1b[0G🔎 ${String(count).padStart(
      String(totalDependencies).length,
      " "
    )}/${totalDependencies} ✅${"".padEnd(largestPackageName.length, " ")}`
  );
  log("\n");

  writeFileSync(path, `${JSON.stringify(packageJSON, null, 2)}${EOL}`);

  hasError.length > 0 && hasUpdate.length > 0 && log();
  hasUpdate.length > 0
    ? showUpdated(hasUpdate)
    : log(`Nothing to be updated ✅\n`);

  process.exit(hasError.length > 0 ? 1 : 0);
}

export default upgradeVersions;