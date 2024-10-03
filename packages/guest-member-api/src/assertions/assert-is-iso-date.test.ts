// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../constants/response-messages';
import { assertIsIsoDate } from './assert-is-iso-date';

describe('assertIsIsoDate', () => {
  it.each([
    [undefined, true],
    ['', true],
    ['x', true],
    ['22-01-01', true],
    ['2022-00-01', true],
    ['2022-00-01', true],
    ['2022-01-00', true],
    ['2022-1-1', true],
    ['2022-01-01', false],
    ['2022-01-31', false],
    ['2022-01-32', true],
    ['2022-02-28', false],
    ['2022-02-29', true],
    ['2024-02-29', false],
    ['2022-04-30', false],
    ['2022-04-31', true],
    ['2022-13-01', true],
  ])(
    'asserts that %p is a valid ISO date string (yyyy-mm-dd)',
    (dateStringMock: string | undefined, isErrorExpected: boolean) => {
      try {
        assertIsIsoDate(dateStringMock);

        if (isErrorExpected) {
          expect.assertions(1);
        }
      } catch (error) {
        if (!isErrorExpected) {
          expect.assertions(0);
        }

        const expectedError = new Error(
          ErrorConstants.INVALID_ISO_DATE(dateStringMock)
        );
        expect(error).toEqual(expectedError);
      }
    }
  );
});
