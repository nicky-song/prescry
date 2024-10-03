// Copyright 2022 Prescryptive Health, Inc.

import { isValidYear } from './year.validator';

describe('isValidYear', () => {
  it.each([
    ['2022', true],
    ['1950', true],
    ['1000', true],
    ['0001', true],
    ['20 22', false],
    ['2a2e', false],
    ['19.50', false],
    [' 1950 ', false],
    ['abcdfg', false],
  ])(
    'when value passed is %p return %p',
    (yearMock: string, expectedResult: boolean) => {
      const result = isValidYear(yearMock);

      expect(result).toEqual(expectedResult);
    }
  );
});
