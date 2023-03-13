import cmd from './cmd.js';
import { log, styles as sh, showFixed } from './styles.js';
import { EOL } from 'os';

async function auditFix() {
  const hasError = [];

  const runAuditScan = async (type) => {
    try {
      return JSON.parse(await cmd(`npm audit ${type} --no-progress --audit-level=none --json`));
    } catch (error) {
      hasError.push(error);
      console.error(`❌ Error on executing audit fix:`, error.summary?.split(EOL)[0] || error?.summary || error?.message || error);
      return null;
    }
  }

  log(`\n📦 Executing ${sh.bold}packages audit${sh.reset}...\n`);

  const auditResultJSON = await runAuditScan('--silent'); // scan for all vulnerabilities

  if (hasError.length > 0) {
    process.exit(1);
  } else {
    const auditRemanescentJSON = await runAuditScan('fix'); // remanescent vulnerabilities after fix
    showFixed(auditResultJSON.vulnerabilities, auditRemanescentJSON.audit.vulnerabilities);
  }

}

export default auditFix;