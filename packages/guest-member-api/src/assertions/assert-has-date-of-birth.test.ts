// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../constants/response-messages';
import { assertHasDateOfBirth } from './assert-has-date-of-birth';

describe('assertHasDateOfBirth', () => {
  it.each([
    [undefined, true],
    ['', true],
    ['x', false],
  ])(
    'asserts that person date of birth (%p) is truthy',
    (personDobMock: string | undefined, isErrorExpected: boolean) => {
      try {
        assertHasDateOfBirth(personDobMock);

        if (isErrorExpected) {
          expect.assertions(1);
        }
      } catch (error) {
        if (!isErrorExpected) {
          expect.assertions(0);
        }

        const expectedError = new Error(ErrorConstants.PERSON_DOB_MISSING);
        expect(error).toEqual(expectedError);
      }
    }
  );
});
