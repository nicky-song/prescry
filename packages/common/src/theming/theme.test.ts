// Copyright 2018 Prescryptive Health, Inc.

import { getDimension } from './theme';

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn().mockImplementation(() => {
      return { fontScale: 1, height: 640, scale: 1, width: 320 };
    }),
  },
  Platform: {
    select: jest.fn().mockImplementation((platform) => {
      return platform.web;
    }),
  },
}));

describe('getDimension', () => {
  it('should return actual device width when it is greater than default specified width', () => {
    expect(getDimension(1100, 'width')).toBe(320);
  });
  it('should return passed width when it is lower than  default specified width', () => {
    expect(getDimension(100, 'width')).toBe(100);
  });
  it('should return scaled width upto 0.85 of actual device width', () => {
    expect(getDimension(100, 'width', 0.85)).toBe(85);
  });
  it('should return actual device height when it is greater than default device height', () => {
    expect(getDimension(1100, 'height')).toBe(640);
  });
  it('should return passed height when it is lower than default device height', () => {
    expect(getDimension(100, 'height')).toBe(100);
  });
  it('should return scaled height upto 0.85 of actual device height', () => {
    expect(getDimension(100, 'height', 0.85)).toBe(85);
  });
});
