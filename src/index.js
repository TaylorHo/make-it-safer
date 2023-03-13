#! /usr/bin/env node

import auditFix from './auditFix.js';
import upgradeVersions from './upgradeVersions.js';

(async () => {
  const [, , ...args] = process.argv;

  if (args?.[0]) {
    upgradeVersions(args);
  } else {
    auditFix();
  }
})();
