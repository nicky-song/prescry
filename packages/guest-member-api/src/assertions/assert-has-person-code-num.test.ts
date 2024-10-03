// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../constants/response-messages';
import { assertHasPersonCodeNum } from './assert-has-person-code-num';

describe('assertHasPersonCodeNum', () => {
  it.each([
    [undefined, true],
    [1, false],
  ])(
    'asserts that person code num (%p) is truthy',
    (personCodeMock: number | undefined, isErrorExpected: boolean) => {
      try {
        assertHasPersonCodeNum(personCodeMock);

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
