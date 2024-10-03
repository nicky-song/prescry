// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../constants/response-messages';
import { mockPatient } from '../mock-data/fhir-patient.mock';
import { IPatient } from '../models/fhir/patient/patient';
import { assertHasPatient } from './assert-has-patient';

describe('assertHasPatient', () => {
  it.each([
    [undefined, true],
    [mockPatient, false],
  ])(
    'asserts that patient (%p) exists',
    (patientMock: IPatient | undefined, isErrorExpected: boolean) => {
      try {
        assertHasPatient(patientMock);

        if (isErrorExpected) {
          expect.assertions(1);
        }
      } catch (error) {
        if (!isErrorExpected) {
          expect.assertions(0);
        }

        const expectedError = new Error(ErrorConstants.PATIENT_RECORD_MISSING);
        expect(error).toEqual(expectedError);
      }
    }
  );
});
