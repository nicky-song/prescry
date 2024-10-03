// Copyright 2018 Prescryptive Health, Inc.

import { Config } from '@jest/types';

// By default, all files inside `node_modules` are not transformed. But some 3rd party
// modules are published as untranspiled, Jest will not understand the code in these modules.
// To overcome this, exclude these modules in the ignore pattern.
const untranspiledModulePatterns = [
  '(jest-)?react-native',
  '@react-native(.*)',
  'expo(nent)?',
  '@expo(nent)?/.*',
  'react-navigation',
  '@react-navigation/.*',
  '@unimodules/.*',
  'unimodules',
  'sentry-expo',
  'native-base',
  'react-native-svg',
];

const cssMockSetup = '<rootDir>/test/jest.css-mock.js';

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
  transform: {
    '^.+\\.js$': '../../node_modules/react-native/jest/preprocessor.js',
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/*.stories.tsx'],
  coveragePathIgnorePatterns: ['/node_modules/', 'storybook', 'src/testing'],
  coverageThreshold: {
    global: {
      statements: 94,
      branches: 83,
      functions: 90,
      lines: 94,
    },
  },
  coverageReporters: ['json-summary', 'text', 'lcov'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    'swiper/swiper.min.css': cssMockSetup,
    'swiper/modules/pagination/pagination.min.css': cssMockSetup,
  },
  modulePathIgnorePatterns: ['<rootDir>/lib'],
  testPathIgnorePatterns: ['\\.snap$', '/node_modules/', '/lib/', '/.jest/'],
  transformIgnorePatterns: [
    `node_modules/(?!${untranspiledModulePatterns.join('|')})`,
  ],
  resetMocks: false,
  setupFiles: [
    'jest-localstorage-mock',
    './test/jest.enzyme.js',
    'core-js',
    'whatwg-fetch',
  ],
};

export default config;
