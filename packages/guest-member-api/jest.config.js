// Copyright 2019 Prescryptive Health, Inc.

module.exports = {
  cacheDirectory: '.jest/cache',
  // collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!**/*.d.ts'],
  // coverageReporters: ['json', 'text', 'lcov', 'clover', 'cobertura'],
  // coverageThreshold: {
  //   global: {
  //     statements: 96,
  //     branches: 81,
  //     functions: 95,
  //     lines: 96,
  //   },
  // },
  // coveragePathIgnorePatterns: [
  //   "models"
  // ],
  moduleFileExtensions: ['ts', 'js'],
  modulePaths: ['<rootDir>/node_modules/'],
  reporters: [
    'default',
    [
      'jest-trx-results-processor',
      {
        outputFile: '.jest/jest-test-results-api.trx',
      },
    ],
  ],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/lib/',
    '<rootDir>/.jest/',
  ],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testURL: 'http://localhost',
  transform: { '\\.(ts|tsx)$': 'ts-jest' },
  verbose: true,
};
