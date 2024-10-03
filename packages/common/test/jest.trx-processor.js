var builder = require('jest-trx-results-processor');

var processor = builder({
  outputFile: './.jest/jest-test-results-common.trx',
});

module.exports = processor;
