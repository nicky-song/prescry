// Copyright 2022 Prescryptive Health, Inc.

import { translateCoordinateHelper } from './translate-coordinate.helper';

describe('translateCoordinateHelper', () => {
  it.each([
    [123.123456789, 123.123457],
    [123.12345678, 123.123457],
    [123.1234567, 123.123457],
    [123.123456, 123.123456],
    [123.12345, 123.12345],
    [123.1234, 123.1234],
    [123.123, 123.123],
    [123.12, 123.12],
    [123.1, 123.1],
    [123, 123],
    [undefined, undefined],
  ])(
    'translates coordinate %d as expected to %d',
    (initialCoordinate?: number, expectedCoordinate?: number) => {
      const translatedCoordinate = translateCoordinateHelper(initialCoordinate);
      expect(translatedCoordinate).toEqual(expectedCoordinate);
    }
  );
});
