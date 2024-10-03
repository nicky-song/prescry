// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../constants/response-messages';
import { assertHasPersonCode } from './assert-has-person-code';

describe('assertHasPersonCode', () => {
  it.each([
    [undefined, true],
    ['', true],
    ['x', false],
  ])(
    'asserts that person code (%p) is truthy',
    (personCodeMock: string | undefined, isErrorExpected: boolean) => {
      try {
        assertHasPersonCode(personCodeMock);

        if (isErrorExpected) {
          expect.assertions(1);
        }
      } catch (error) {
        if (!isErrorExpected) {
          expect.assertions(0);
        }

        const expectedError = new Error(ErrorConstants.PERSON_CODE_MISSING);
        expect(error).toEqual(expectedError);
      }
    }
  );
});
