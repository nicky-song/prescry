// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../constants/response-messages';
import { patientAccountPrimaryMock } from '../mock-data/patient-account.mock';
import { IPatientAccount } from '../models/platform/patient-account/patient-account';
import { assertHasPatientAccount } from './assert-has-patient-account';

describe('assertHasPatientAccount', () => {
  it.each([
    [undefined, true],
    [patientAccountPrimaryMock, false],
  ])(
    'asserts that patient account (%p) exists',
    (
      patientAccountMock: IPatientAccount | undefined,
      isErrorExpected: boolean
    ) => {
      try {
        assertHasPatientAccount(patientAccountMock);

        if (isErrorExpected) {
          expect.assertions(1);
        }
      } catch (error) {
        if (!isErrorExpected) {
          expect.assertions(0);
        }

        const expectedError = new Error(ErrorConstants.PATIENT_ACCOUNT_MISSING);
        expect(error).toEqual(expectedError);
      }
    }
  );
});
