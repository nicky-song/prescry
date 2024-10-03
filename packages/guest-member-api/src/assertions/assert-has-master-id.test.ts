// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../constants/response-messages';
import { assertHasMasterId } from './assert-has-master-id';

describe('assertHasMasterId', () => {
  it.each([
    [undefined, true],
    ['', true],
    ['x', false],
  ])(
    'asserts that master id (%p) is truthy',
    (masterIdMock: string | undefined, isErrorExpected: boolean) => {
      const phoneNumberMock = '+11234567890';

      try {
        assertHasMasterId(masterIdMock, phoneNumberMock);

        if (isErrorExpected) {
          expect.assertions(1);
        }
      } catch (error) {
        if (!isErrorExpected) {
          expect.assertions(0);
        }

        const expectedError = new Error(
          ErrorConstants.PATIENT_MASTER_ID_MISSING(phoneNumberMock)
        );
        expect(error).toEqual(expectedError);
      }
    }
  );
});
