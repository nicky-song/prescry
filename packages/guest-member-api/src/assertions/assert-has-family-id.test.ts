// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../constants/response-messages';
import { assertHasFamilyId } from './assert-has-family-id';

describe('assertHasFamilyId', () => {
  it.each([
    [undefined, true],
    ['', true],
    ['x', false],
  ])(
    'asserts that family id (%p) is truthy',
    (familyIdMock: string | undefined, isErrorExpected: boolean) => {
      try {
        assertHasFamilyId(familyIdMock);

        if (isErrorExpected) {
          expect.assertions(1);
        }
      } catch (error) {
        if (!isErrorExpected) {
          expect.assertions(0);
        }

        const expectedError = new Error(ErrorConstants.FAMILY_ID_MISSING);
        expect(error).toEqual(expectedError);
      }
    }
  );
});
