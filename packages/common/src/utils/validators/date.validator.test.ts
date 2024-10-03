// Copyright 2020 Prescryptive Health, Inc.

import DateValidator, { DateItemValue } from './date.validator';

describe('DateValidator', () => {
  it.each([
    [NaN, false],
    [0, false],
    ['0', false],
    [1, true],
    ['1', true],
    [1.1, false],
    ['1.1', false],
    [31, true],
    ['31', true],
    [32, false],
    ['32', false],
  ])(`validates day (%p)`, (day: DateItemValue, isValid: boolean) => {
    expect(DateValidator.isDayValid(day)).toEqual(isValid);
  });

  it.each([
    [NaN, false],
    [0, false],
    ['0', false],
    [1, true],
    ['1', true],
    [1.1, false],
    ['1.1', false],
    [12, true],
    ['12', true],
    [13, false],
    ['13', false],
  ])('validates month (%p)', (month: DateItemValue, isValid: boolean) => {
    expect(DateValidator.isMonthValid(month)).toEqual(isValid);
  });

  it.each([
    [NaN, undefined, false],
    [0, undefined, false],
    ['0', undefined, false],
    [1, undefined, true],
    ['1', undefined, true],
    [1899, 1900, false],
    ['1899', 1900, false],
    [1900, 1900, true],
    ['1900', 1900, true],
    [1.1, undefined, false],
    ['1.1', undefined, false],
    [2020, undefined, true],
    ['2020', undefined, true],
  ])(
    'validates year (%p, %p)',
    (
      year: DateItemValue,
      minimumYear: number | undefined,
      isValid: boolean
    ) => {
      expect(DateValidator.isYearValid(year, minimumYear)).toEqual(isValid);
    }
  );

  it.each([
    [NaN, NaN, NaN, false],
    [1, NaN, NaN, false],
    [1, 1, NaN, false],
    [0, 0, 0, false],
    [1, 0, 0, false],
    [1, 1, 0, false],
    [1, 1, 1, true],
    ['1', '1', '1', true],
    [1.1, 1, 1, false],
    [1, 1.1, 1, false],
    [1, 1, 1.1, false],
    [1, 13, 1, false],
    [1, 1, 32, false],

    [2000, 2, 29, true],
    ['2000', '2', '29', true],
    [2000, 2, 30, false],
    [2001, 2, 29, false],
    [2001, 2, 28, true],
    ['2001', '2', '28', true],
    [2020, 2, 29, true],
    ['2020', '2', '29', true],

    [2001, 4, 30, true],
    ['2001', '4', '30', true],
    [2001, 4, 31, false],
    [2001, 6, 30, true],
    ['2001', '6', '30', true],
    [2001, 6, 31, false],
    [2001, 9, 30, true],
    ['2001', '9', '30', true],
    [2001, 9, 31, false],
    [2001, 11, 30, true],
    ['2001', '11', '30', true],
    [2001, 11, 31, false],
  ])(
    'validates date (%p, %p, %p)',
    (
      year: DateItemValue,
      month: DateItemValue,
      day: DateItemValue,
      isValid: boolean
    ) => {
      expect(DateValidator.isDateValid(year, month, day)).toEqual(isValid);
    }
  );

  it.each([
    ['07-27-2019', true],
    ['July-27-2019', true],
    ['mm-27-2019', false],
    ['07-dd-2019', false],
    ['07-27-yyyy', false],
    ['mm-dd-yyyy', false],
  ])('validates date (%p)', (date: string, isValid: boolean) => {
    expect(DateValidator.isDateOfBirthValid(date)).toEqual(isValid);
  });
});
