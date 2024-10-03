// Copyright 2022 Prescryptive Health, Inc.

import { assertIsDefined } from '../assertions/assert-is-defined';
import { RxGroupTypesEnum } from '../models/member-profile/member-profile-info';
import { ILimitedPatient } from '../models/patient-profile/limited-patient';
import { IPatientProfileResponse } from '../models/patient-profile/patient-profile';
import { ErrorConstants } from '../theming/constants';
import { getPatientInfoByRxGroupType } from './patient.helper';

jest.mock('../assertions/assert-is-defined');
const assertIsDefinedMock = assertIsDefined as jest.Mock;

describe('getPatientInfoByRxGroupType', () => {
  it('throws an error if patient is undefined ', () => {
    try {
      getPatientInfoByRxGroupType([], RxGroupTypesEnum.CASH);

      expect(assertIsDefinedMock).toHaveBeenCalledWith(
        undefined,
        ErrorConstants.errorUndefinedPatient
      );
    } catch (error) {
      const expectedError = new Error(ErrorConstants.errorUndefinedPatient);
      expect(error).toEqual(expectedError);
    }
  });

  it('returns patient', () => {
    const patientMock = {
      firstName: 'first-name',
      lastName: 'last-name',
      dateOfBirth: '2000-01-01',
      phoneNumber: '+11111111111',
      recoveryEmail: 'email',
    } as ILimitedPatient;

    const patientResponseMock = {
      rxGroupType: RxGroupTypesEnum.CASH,
      primary: patientMock,
    } as IPatientProfileResponse;

    const actual = getPatientInfoByRxGroupType(
      [patientResponseMock],
      RxGroupTypesEnum.CASH
    );

    expect(assertIsDefinedMock).toHaveBeenCalledWith(
      patientMock,
      ErrorConstants.errorUndefinedPatient
    );
    expect(actual).toEqual(patientMock);
  });
});
