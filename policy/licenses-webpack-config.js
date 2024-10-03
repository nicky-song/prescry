// Copyright 2018 Prescryptive Health, Inc.

'use strict';

const path = require('path');
const { accepted, overrides } = require('./licenses-allowed');

const terser = {
  extractComments: {
    condition: /^\**!|@preserve|@license|@cc_on/i,
    filename: (fileData) => `${fileData}.notices.txt`,
    banner: (licenseFile) =>
      `License information can be found in ${licenseFile}`,
  },
};

const common = {
  stats: {
    warnings: false,
    errors: true,
  },
  excludedPackageTest: (packageName) => /^@phx/.test(packageName),
  handleUnacceptableLicense: (packageName, licenseType) => {
    throw Error(
      `Invalid license type "${licenseType}" in package "${packageName}"`
    );
  },
  unacceptableLicenseTest: (licenseType) => !accepted.test(licenseType),
  addBanner: true,
  outputFilename: 'third-party-notices.txt',
  licenseTypeOverrides: overrides,
};

const txt = {
  ...common,
  outputFilename: 'third-party-notices.txt',
};

const json = {
  ...common,
  renderLicenses,
  outputFilename: 'third-party-notices.json',
};

module.exports = {
  terser,
  plugins: (Plugin) => [new Plugin(txt), new Plugin(json)],
};

function renderLicenses(modules) {
  return JSON.stringify(
    modules.map((m) => ({
      name: m.name,
      licenseId: m.licenseId,
      repository: m.packageJson.repository,
      licenseText: m.licenseText,
    })),
    null,
    2
  );
}
