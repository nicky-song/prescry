// Copyright 2020 Prescryptive Health, Inc.

import { convertUnits, LengthUnit } from './unit-conversion.helper';

describe('convertUnits', () => {
  it.each([
    ['miles', 'meters', 5, 5 * 1609.34],
    ['meters', 'miles', 7, 7 / 1609.34],
    ['miles', 'miles', 7, 7],
  ])(
    'convertsUnits (%p,%p)',
    (unit1: string, unit2: string, length: number, expected: number) => {
      expect(
        convertUnits(length, unit1 as LengthUnit, unit2 as LengthUnit)
      ).toEqual(expected);
    }
  );
});
