// Copyright 2022 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { assertHasPatient } from '../../assertions/assert-has-patient';
import { assertHasPatientAccount } from '../../assertions/assert-has-patient-account';
import { mockPatient } from '../../mock-data/fhir-patient.mock';
import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithPatientMock,
} from '../../mock-data/patient-account.mock';
import { IPatientAccount } from '../../models/platform/patient-account/patient-account';
import { buildFirstName, getHumanName } from '../fhir/human-name.helper';
import { IPinKeyValues } from '../redis/redis.helper';
import { getPinDetails, IPinDetails } from './get-pin-details';
import { getPinKeyValuesFromPatientAccount } from './get-pin-key-values-from-patient-account';

jest.mock('./get-pin-details');
const getPinDetailsMock = getPinDetails as jest.Mock;

jest.mock('../../assertions/assert-has-patient-account');
const assertHasPatientAccountMock = assertHasPatientAccount as jest.Mock;

jest.mock('../../assertions/assert-has-patient');
const assertHasPatientMock = assertHasPatient as jest.Mock;

describe('getPinKeyValuesFromPatientAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('asserts patient account exists', () => {
    const patientAccountMock = patientAccountPrimaryMock;
    getPinKeyValuesFromPatientAccount(patientAccountMock);

    expectToHaveBeenCalledOnceOnlyWith(
      assertHasPatientAccountMock,
      patientAccountMock
    );
  });

  it('returns undefined if no pin details', () => {
    getPinDetailsMock.mockReturnValue(undefined);

    const pinKeyValues = getPinKeyValuesFromPatientAccount(
      patientAccountPrimaryMock
    );
    expect(pinKeyValues).toBeUndefined();
  });

  it('asserts patient exists in patient account', () => {
    const pinDetailsMock: IPinDetails = {
      accountKey: 'account-key',
      pinHash: 'pin-hash',
    };
    getPinDetailsMock.mockReturnValue(pinDetailsMock);

    const patientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryMock,
      patient: mockPatient,
    };

    getPinKeyValuesFromPatientAccount(patientAccountMock);

    expectToHaveBeenCalledOnceOnlyWith(assertHasPatientMock, mockPatient);
  });

  it('gets PIN key values', () => {
    const pinDetailsMock: IPinDetails = {
      accountKey: 'account-key',
      pinHash: 'pin-hash',
    };
    getPinDetailsMock.mockReturnValue(pinDetailsMock);

    const pinKeyValues = getPinKeyValuesFromPatientAccount(
      patientAccountPrimaryWithPatientMock
    );

    const expectedPatient = patientAccountPrimaryWithPatientMock.patient;
    const expectedNames = getHumanName(expectedPatient?.name, 'official');

    const expectedPinKeyValues: IPinKeyValues = {
      accountKey: pinDetailsMock.accountKey,
      pinHash: pinDetailsMock.pinHash,
      dateOfBirth: expectedPatient?.birthDate,
      lastName: expectedNames?.family,
      firstName: buildFirstName(expectedNames),
    };
    expect(pinKeyValues).toEqual(expectedPinKeyValues);
  });
});
