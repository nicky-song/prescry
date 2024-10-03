// Copyright 2022 Prescryptive Health, Inc.

import { isDateInBetween } from './is-date-in-between.helper';

describe('isDateInBetween', () => {
  it('returns false if date is not in between', () => {
    const fromDateMock = '2022-01-01';
    const toDateMock = '2022-03-01';
    const checkDateMock = new Date('2022-04-01T11:01:58.135Z');

    const result = isDateInBetween(fromDateMock, toDateMock, checkDateMock);

    const expected = false;

    expect(result).toEqual(expected);
  });

  it('returns false if date is not in valid format', () => {
    const fromDateMock = '2022-01-01';
    const toDateMock = '2022-14-01';
    const checkDateMock = new Date('2022-02-01T11:01:58.135Z');

    const result = isDateInBetween(fromDateMock, toDateMock, checkDateMock);

    const expected = false;

    expect(result).toEqual(expected);
  });

  it('returns true if date is in between', () => {
    const fromDateMock = '2022-01-01';
    const toDateMock = '2022-03-01';
    const checkDateMock = new Date('2022-02-01T11:01:58.135Z');

    const result = isDateInBetween(fromDateMock, toDateMock, checkDateMock);

    const expected = true;

    expect(result).toEqual(expected);
  });

  it('returns true if date is in between and is same day', () => {
    const fromDateMock = '2022-01-01';
    const toDateMock = '2022-03-01';
    const checkDateMock = new Date('2022-01-01T11:01:58.135Z');

    const result = isDateInBetween(fromDateMock, toDateMock, checkDateMock);

    const expected = true;

    expect(result).toEqual(expected);
  });
});
