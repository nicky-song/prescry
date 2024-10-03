// Copyright 2022 Prescryptive Health, Inc.

import { convertToNumber } from './helpers';

describe('convertToNumber', () => {
  test('It can convert a string', () => {
    const result = convertToNumber('11.5');
    expect(result).toBe(11.5);
  });
  test('It can pass a number', () => {
    const result = convertToNumber(11.5);
    expect(result).toBe(11.5);
  });
  test.each([
    [undefined, 0],
    [null, 0],
  ])('It defaults to %i when provided', (item, expected) => {
    const result = convertToNumber(item);
    expect(result).toBe(expected);
  });
});
