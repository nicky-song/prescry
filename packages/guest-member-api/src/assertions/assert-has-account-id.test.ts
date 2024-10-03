// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../constants/response-messages';
import { assertHasAccountId } from './assert-has-account-id';

describe('assertHasAccountId', () => {
  it.each([
    [undefined, true],
    ['', true],
    ['x', false],
  ])(
    'asserts that account id (%p) is truthy',
    (accountIdMock: string | undefined, isErrorExpected: boolean) => {
      try {
        assertHasAccountId(accountIdMock);

        if (isErrorExpected) {
          expect.assertions(1);
        }
      } catch (error) {
        if (!isErrorExpected) {
          expect.assertions(0);
        }

        const expectedError = new Error(ErrorConstants.ACCOUNT_ID_MISSING);
        expect(error).toEqual(expectedError);
      }
    }
  );
});
