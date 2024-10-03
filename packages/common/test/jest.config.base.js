const path = require('path');
const cssMockSetup = path.resolve(__dirname, 'jest.css-mock.js');
const fileMockSetup = path.resolve(__dirname, 'jest.file-mock.js');
const falseFlagSetup = path.resolve(__dirname, 'jest.false-flag.js');
const enzymeSetup = path.resolve(__dirname, 'jest.enzyme.js');
// const testResultsProcessor = path.resolve(__dirname, 'jest.trx-processor.js');

const DefaultOptions = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/*.stories.tsx',
  ],
  coverageReporters: ['json', 'text', 'lcov', 'clover', 'cobertura'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  preset: 'jest-expo',
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__'],
  moduleNameMapper: {
    '\\.(png|jpg|gif|ttf|eot|svg)$': fileMockSetup,
    '\\.(css|less|sass|scss)$': cssMockSetup,
  },
  modulePaths: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.css$': cssMockSetup,
    '^(?!.*\\.(css|json)$)': fileMockSetup,
  },
  transformIgnorePatterns: [
    '^.+\\.module\\.(css|sass|scss)$',
    '[/\\\\]node_modules[/\\\\](?!(react-native.*?|native-base.*?|react-navigation.*?))/.+\\.(js|jsx|ts|tsx)$',
  ],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js|jsx)$',
  testPathIgnorePatterns: [
    '\\.snap$',
    '/node_modules/',
    '/lib/',
    '/build/',
    '/.jest/',
  ],
  testEnvironment: 'jsdom',
  // testResultsProcessor,
  testURL: 'http://localhost',
  cacheDirectory: '.jest/cache',
  setupFiles: [falseFlagSetup, 'react-app-polyfill/jsdom', 'jest-canvas-mock'],
  //   "snapshotSerializers": [
  //     "enzyme-to-json/serializer"
  //   ]
};

function buildConfigNative(options) {
  return buildConfig({
    preset: 'react-native',
    ...options,
  });
}

function buildConfigWeb(options) {
  options = options || {};

  options.moduleNameMapper = {
    ...(options.moduleNameMapper || {}),
    '^react-native$': 'react-native-web',
    '^react-navigation$': fileMockSetup,
    '^react-native-gifted-chat$': fileMockSetup,
    'react-native-web-swiper': fileMockSetup,
    'native-base': fileMockSetup,
  };

  options.setupFiles = options.setupFiles || [];
  options.setupFiles.push('react-native-web');
  options.setupFiles.push(enzymeSetup);

  options.transformIgnorePatterns = options.transformIgnorePatterns || [];
  options.transformIgnorePatterns.push(
    'node_modules/(?!(react-native|react-navigation|native-base-.*|react-native-.*)/)'
  );

  return buildConfig(options);
}

function buildConfig(options) {
  options = options || {};

  options.setupFiles = DefaultOptions.setupFiles.concat(
    options.setupFiles || []
  );

  options.moduleNameMapper = {
    ...DefaultOptions.moduleNameMapper,
    ...(options.moduleNameMapper || {}),
  };

  options.transformIgnorePatterns = (
    options.transformIgnorePatterns || []
  ).concat(DefaultOptions.transformIgnorePatterns);

  const config = {
    ...DefaultOptions,
    ...options,
  };

  return config;
}

module.exports = {
  buildConfigNative,
  buildConfigWeb,
};
