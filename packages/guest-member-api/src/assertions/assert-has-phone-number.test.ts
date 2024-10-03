// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../constants/response-messages';
import { assertHasPhoneNumber } from './assert-has-phone-number';

describe('assertHasPhoneNumber', () => {
  it.each([
    [undefined, true],
    ['', true],
    ['x', false],
  ])(
    'asserts that phone number (%p) is truthy',
    (phoneNumberMock: string | undefined, isErrorExpected: boolean) => {
      try {
        assertHasPhoneNumber(phoneNumberMock);

        if (isErrorExpected) {
          expect.assertions(1);
        }
      } catch (error) {
        if (!isErrorExpected) {
          expect.assertions(0);
        }

        const expectedError = new Error(ErrorConstants.PHONE_NUMBER_MISSING);
        expect(error).toEqual(expectedError);
      }
    }
  );
});
