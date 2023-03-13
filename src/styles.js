const log = console.log.bind(console)

const styles = {
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  purple: '\x1b[35m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

const personalizeVersion = (fullVersion) => {
  const operators = fullVersion.replace(/[^^><=~\s]+/g, '')
  const version = fullVersion.replace(/[^a-z0-9.-]/gim, '')

  return [operators, version]
}

const showUpdated = (packages) => {
  const { bold, dim, reset, yellow, green, blue } = styles

  const largestPackageName = packages.reduce(
    (acc, cur) => (acc?.length > cur?.packageName?.length ? acc : cur.packageName),
    ''
  )

  const largestPackagePreviousVersion = packages.reduce(
    (acc, cur) => (acc?.length > cur?.previousVersion?.length ? acc : cur.previousVersion),
    ''
  )

  const largestPackageNewVersion = packages.reduce(
    (acc, cur) => (acc?.length > cur?.newVersion?.length ? acc : cur.newVersion),
    ''
  )

  const formattedPackages = packages.map((currentPackage) => {
    return {
      packageName: currentPackage.packageName.padEnd(largestPackageName.length, ' '),
      previousVersion: currentPackage.previousVersion.padStart(largestPackagePreviousVersion.length, ' '),
      newVersion: currentPackage.newVersion.padStart(largestPackageNewVersion.length, ' ')
    }
  })

  formattedPackages.forEach((currentPackage) => {
    const { packageName, previousVersion: previousFullVersion, newVersion: newFullVersion } = currentPackage
    const [previousOperator, previousVersion] = personalizeVersion(previousFullVersion)
    const [newOperator, newVersion] = personalizeVersion(newFullVersion)

    log(
      `${bold}${packageName}${reset}    ${reset}${yellow}${dim}${previousOperator}${reset}${yellow}${bold}${previousVersion}${reset}  ${dim}➜${reset}  ${green}${dim}${newOperator}${reset}${green}${bold}${newVersion}${reset}`
    )
  })

  log(`\nRun ${bold}${blue}npm i${reset} to install new versions 🚀\n`)
}

const showFixed = (previousVulns, afterVulns) => {
  const { bold, dim, reset, yellow, green, blue } = styles
  let largestPackageName = 0
  let largestSeverityName = 0

  if (Object.keys(previousVulns).length === 0) {
    log('No vulnerabilities were found ✅\n')
    process.exit(0)
  }

  Object.keys(previousVulns).forEach((vulnerablePackage) => {
    if (previousVulns[vulnerablePackage].name.length > largestPackageName) {
      largestPackageName = previousVulns[vulnerablePackage].name.length
    }
    if (previousVulns[vulnerablePackage].severity.length > largestSeverityName) {
      largestSeverityName = previousVulns[vulnerablePackage].severity.length
    }
  })

  Object.keys(previousVulns).forEach((vulnerablePackage) => {
    if (previousVulns[vulnerablePackage].fixAvailable === true) {
      // check if it's true because it can be an object
      const vulnerablePackageName = previousVulns[vulnerablePackage].name
      const vulnerabilitySeverity = getSeverity(previousVulns[vulnerablePackage].severity, largestSeverityName)

      log(
        `Package ${bold}${`${vulnerablePackageName}${' '.repeat(
          largestPackageName - vulnerablePackageName.length
        )}`}${reset}    ${reset}${vulnerabilitySeverity}${reset}  ${dim}➜${reset}  ${green}Fixed ✅${reset}${reset}`
      )
    }
  })

  Object.keys(afterVulns).forEach((vulnerablePackage) => {
    if (typeof afterVulns[vulnerablePackage].fixAvailable === 'object') {
      const vulnerablePackageName = afterVulns[vulnerablePackage].name
      const vulnerabilitySeverity = getSeverity(afterVulns[vulnerablePackage].severity, largestSeverityName)
      const fixAvailablePackage = afterVulns[vulnerablePackage].fixAvailable.name

      log(
        `\nPackage ${bold}${`${vulnerablePackageName}${' '.repeat(
          largestPackageName - vulnerablePackageName.length
        )}`}${reset}    ${reset}${vulnerabilitySeverity}${reset}  ${dim}➜${reset}  ${green}Breaking Change ⛔${reset}${reset}`
      )
      log(
        `   └─> Fix ${bold}Available${reset} through ${reset}${yellow}${bold}${fixAvailablePackage}${reset} Breaking Change!${reset}`
      )
    }
  })

  log(`\nRun ${bold}${blue}npm i${reset} to install the fixed packages 🚀\n`)
}

function getSeverity (vulnerabilitySeverity, largestSeverityName) {
  const { bold, yellow, blue, red, purple } = styles
  switch (vulnerabilitySeverity) {
    case 'critical':
      return `${red}${bold}${vulnerabilitySeverity}${' '.repeat(largestSeverityName - vulnerabilitySeverity.length)}`
    case 'high':
      return `${yellow}${bold}${vulnerabilitySeverity}${' '.repeat(
        largestSeverityName - vulnerabilitySeverity.length
      )}`
    case 'moderate':
      return `${purple}${bold}${vulnerabilitySeverity}${' '.repeat(
        largestSeverityName - vulnerabilitySeverity.length
      )}`
    case 'low':
      return `${blue}${bold}${vulnerabilitySeverity}${' '.repeat(largestSeverityName - vulnerabilitySeverity.length)}`
    default:
      return `${yellow}${bold}${vulnerabilitySeverity}${' '.repeat(
        largestSeverityName - vulnerabilitySeverity.length
      )}`
  }
}

export { log, styles, showUpdated, showFixed }
