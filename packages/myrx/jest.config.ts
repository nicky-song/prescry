// Copyright 2022 Prescryptive Health, Inc.

import type { Config } from '@jest/types';

const untranspiledModulePatterns = [
  '(jest-)?react-native',
  '@react-native(.*)',
  'expo(nent)?',
  '@expo(nent)?/.*',
  '@expo-google-fonts/.*',
  'react-navigation',
  '@react-navigation/.*',
  '@unimodules/.*',
  'unimodules',
  'sentry-expo',
  'native-base',
  'react-native-svg',
  'nanoid',
];

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    `node_modules/(?!${untranspiledModulePatterns.join('|')})`,
  ],
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/jest.config.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/types',
    'end-to-end-tests',
    'playwright.config.ts',
    'playwright.global.setup.ts',
    'service-worker.js',
    'service-worker-registration.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 99,
      branches: 74,
      functions: 97,
      lines: 99,
    },
  },
  modulePathIgnorePatterns: ['end-to-end-tests'],
};

export default config;
