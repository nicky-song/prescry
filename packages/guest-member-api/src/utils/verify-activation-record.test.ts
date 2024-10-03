// Copyright 2022 Prescryptive Health, Inc.

import {
  verifyActivationRecord,
  ActivationRecord,
} from './verify-activation-record';
import { searchPersonByActivationPhoneNumber } from '../databases/mongo-database/v1/query-helper/person-collection-helper';
import { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';
import { IPerson } from '@phx/common/src/models/person';
import { configurationMock } from '../mock-data/configuration.mock';
import { verifyPatientsByPhoneNumberAndOrMemberId } from './patient/verify-patients-by-phone-number';
import { ErrorConstants } from '../constants/response-messages';

jest.mock(
  '../databases/mongo-database/v1/query-helper/person-collection-helper'
);
const searchPersonByActivationPhoneNumberMock =
  searchPersonByActivationPhoneNumber as jest.Mock;

jest.mock('./patient/verify-patients-by-phone-number');
const verifyPatientsByPhoneNumberAndOrMemberIdMock =
  verifyPatientsByPhoneNumberAndOrMemberId as jest.Mock;

const databaseMock = {} as IDatabase;
const phoneNumberMock = 'mock-phone';
const firstNameMock = 'FIRST';
const dateOfBirthMock = '2000-11-05';
const primaryMemberRxIdMock = 'primary-id';
const primaryMemberFamilyIdMock = 'family-id';
const activationRecordMock: IPerson = {
  identifier: 'identifier-1',
  rxGroupType: 'SIE',
  firstName: firstNameMock,
  lastName: 'lastName',
  dateOfBirth: dateOfBirthMock,
  primaryMemberRxId: primaryMemberRxIdMock,
  primaryMemberFamilyId: primaryMemberFamilyIdMock,
  activationPhoneNumber: phoneNumberMock,
  phoneNumber: '',
  isPhoneNumberVerified: false,
  primaryMemberPersonCode: '01',
  isPrimary: true,
  rxBin: 'bin',
  rxGroup: 'rx-group',
  carrierPCN: 'PH',
  email: 'test@test.com',
};

describe('verifyActivationRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Returns isValid true if there is only cash patient for the phone number', async () => {
    const masterIdMock = 'master-id-mock';

    const verifyPatientsResponseMock = {
      activationPatientMasterId: masterIdMock,
      isValid: true,
    };

    verifyPatientsByPhoneNumberAndOrMemberIdMock.mockReturnValue(
      verifyPatientsResponseMock
    );

    const expected: ActivationRecord = {
      activationPatientMasterId: masterIdMock,
      isValid: true,
    };
    const actual = await verifyActivationRecord(
      databaseMock,

      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      primaryMemberFamilyIdMock,
      configurationMock,

      'v2'
    );
    expect(actual).toEqual(expected);
  });

  it('Returns isValid true if there is pbm patient record for the phone number but not an activation record(without rank:1)', async () => {
    const masterIdMock = 'master-id-mock';
    const memberIdMock = 'member-id-mock';

    const verifyPatientsResponseMock = {
      activationPatientMasterId: masterIdMock,
      activationPatientMemberId: memberIdMock,
      isValid: true,
    };

    verifyPatientsByPhoneNumberAndOrMemberIdMock.mockReturnValue(
      verifyPatientsResponseMock
    );

    const expected: ActivationRecord = {
      isValid: true,
      activationPatientMasterId: masterIdMock,
      activationPatientMemberId: memberIdMock,
    };
    const actual = await verifyActivationRecord(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      primaryMemberFamilyIdMock,
      configurationMock,

      'v2'
    );
    expect(actual).toEqual(expected);
  });

  it('Returns isValid true if there is an activation pbm patient record for the phone number but coverage is not active', async () => {
    const masterIdMock = 'master-id-mock';
    const memberIdMock = 'member-id-mock';

    const verifyPatientsResponseMock = {
      activationPatientMasterId: masterIdMock,
      activationPatientMemberId: memberIdMock,
      isValid: true,
    };

    verifyPatientsByPhoneNumberAndOrMemberIdMock.mockReturnValue(
      verifyPatientsResponseMock
    );

    const expected: ActivationRecord = {
      isValid: true,
      activationPatientMasterId: masterIdMock,
      activationPatientMemberId: memberIdMock,
    };
    const actual = await verifyActivationRecord(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      primaryMemberFamilyIdMock,
      configurationMock,

      'v2'
    );
    expect(actual).toEqual(expected);
  });

  it('Returns isValid false if there is an active activation pbm patient record for the phone number but firstName is not matching', async () => {
    const masterIdMock = 'master-id-mock';

    const verifyPatientsResponseMock = {
      activationPatientMasterId: masterIdMock,
      errorDetails: ErrorConstants.ACTIVATION_PATIENT_USER_DATA_MISMATCH,
      isValid: false,
    };

    verifyPatientsByPhoneNumberAndOrMemberIdMock.mockReturnValue(
      verifyPatientsResponseMock
    );

    const expected: ActivationRecord = {
      isValid: false,
      activationPatientMasterId: masterIdMock,
    };
    const actual = await verifyActivationRecord(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      undefined,
      configurationMock,
      'v2'
    );

    expect(actual).toEqual(expected);
  });

  it('Returns isValid false if there is an active activation pbm patient record for the phone number but date of birth is not matching', async () => {
    const masterIdMock = 'master-id-mock';

    const verifyPatientsResponseMock = {
      activationPatientMasterId: masterIdMock,
      errorDetails: ErrorConstants.ACTIVATION_PATIENT_USER_DATA_MISMATCH,
      isValid: false,
    };

    verifyPatientsByPhoneNumberAndOrMemberIdMock.mockReturnValue(
      verifyPatientsResponseMock
    );

    const expected: ActivationRecord = {
      isValid: false,
      activationPatientMasterId: masterIdMock,
    };

    const actual = await verifyActivationRecord(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      undefined,
      configurationMock,
      'v2'
    );

    expect(actual).toEqual(expected);
  });

  it('Returns isValid false if there is an active activation pbm patient record for the phone number but memberId is not matching', async () => {
    const masterIdMock = 'master-id-mock';

    const verifyPatientsResponseMock = {
      activationPatientMasterId: masterIdMock,
      errorDetails: ErrorConstants.ACTIVATION_PATIENT_USER_DATA_MISMATCH,
      isValid: false,
    };

    verifyPatientsByPhoneNumberAndOrMemberIdMock.mockReturnValue(
      verifyPatientsResponseMock
    );

    const expected: ActivationRecord = {
      isValid: false,
      activationPatientMasterId: masterIdMock,
    };

    const actual = await verifyActivationRecord(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      'some-member-id',
      configurationMock,
      'v2'
    );

    expect(actual).toEqual(expected);
  });

  it('Returns isValid true if there is an active activation pbm patient record for the phone number and memberId matches', async () => {
    const masterIdMock = 'master-id-mock';
    const memberIdMock = 'member-id-mock';

    const verifyPatientsResponseMock = {
      activationPatientMasterId: masterIdMock,
      activationPatientMemberId: memberIdMock,
      isValid: true,
    };

    verifyPatientsByPhoneNumberAndOrMemberIdMock.mockReturnValue(
      verifyPatientsResponseMock
    );

    const expected: ActivationRecord = {
      isValid: true,
      activationPatientMasterId: masterIdMock,
      activationPatientMemberId: memberIdMock,
    };
    const actual = await verifyActivationRecord(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      primaryMemberFamilyIdMock,
      configurationMock,
      'v2'
    );

    expect(actual).toEqual(expected);
  });

  it('V1: Returns isValid true if there is no activation record for the phone number', async () => {
    searchPersonByActivationPhoneNumberMock.mockReturnValueOnce(undefined);
    const expected: ActivationRecord = { isValid: true };
    const actual = await verifyActivationRecord(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      primaryMemberFamilyIdMock,
      configurationMock
    );
    expect(searchPersonByActivationPhoneNumberMock).toHaveBeenCalled();
    expect(actual).toEqual(expected);
  });
  it('V1: Returns isValid false if the user entered firstName does not match with activation record', async () => {
    const activationRecordFirstNameMismatchMock = {
      ...activationRecordMock,
      firstName: 'FIRST2',
    };
    searchPersonByActivationPhoneNumberMock.mockReturnValueOnce(
      activationRecordFirstNameMismatchMock
    );

    const expected: ActivationRecord = {
      isValid: false,
      activationRecord: activationRecordFirstNameMismatchMock,
    };
    const actual = await verifyActivationRecord(
      databaseMock,

      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      primaryMemberFamilyIdMock,
      configurationMock
    );
    expect(actual).toEqual(expected);
  });
  it('V1: Returns isValid false if the user entered date of birth does not match with activation record', async () => {
    const activationRecordDobMismatchMock = {
      ...activationRecordMock,
      dateOfBirth: '2000-12-01',
    };
    searchPersonByActivationPhoneNumberMock.mockReturnValueOnce(
      activationRecordDobMismatchMock
    );

    const expected: ActivationRecord = {
      isValid: false,
      activationRecord: activationRecordDobMismatchMock,
    };

    const actual = await verifyActivationRecord(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      primaryMemberFamilyIdMock,
      configurationMock
    );
    expect(actual).toEqual(expected);
  });
  it('V1: Returns isValid false if the user entered memberId does not match with activation record familyid as well as primary memberRx id', async () => {
    searchPersonByActivationPhoneNumberMock.mockReturnValueOnce(
      activationRecordMock
    );
    const expected: ActivationRecord = {
      isValid: false,
      activationRecord: activationRecordMock,
    };
    const actual = await verifyActivationRecord(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      'some-id',
      configurationMock
    );
    expect(actual).toEqual(expected);
  });
  it('Returns isValid true if the user entered memberId with activation record familyid', async () => {
    searchPersonByActivationPhoneNumberMock.mockReturnValueOnce(
      activationRecordMock
    );
    const expected: ActivationRecord = {
      isValid: true,
      activationRecord: activationRecordMock,
    };
    const actual = await verifyActivationRecord(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      primaryMemberFamilyIdMock,
      configurationMock
    );
    expect(actual).toEqual(expected);
  });
  it('Returns isValid true if the user entered memberId with activation record primaryMemberRxId', async () => {
    searchPersonByActivationPhoneNumberMock.mockReturnValueOnce(
      activationRecordMock
    );
    const expected: ActivationRecord = {
      isValid: true,
      activationRecord: activationRecordMock,
    };
    const actual = await verifyActivationRecord(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      primaryMemberRxIdMock,
      configurationMock
    );
    expect(actual).toEqual(expected);
  });
  it('Returns isValid true if the user entered info matched with activation record and no memberId is passed', async () => {
    searchPersonByActivationPhoneNumberMock.mockReturnValueOnce(
      activationRecordMock
    );
    const expected: ActivationRecord = {
      isValid: true,
      activationRecord: activationRecordMock,
    };
    const actual = await verifyActivationRecord(
      databaseMock,
      phoneNumberMock,
      firstNameMock,
      dateOfBirthMock,
      undefined,
      configurationMock
    );
    expect(actual).toEqual(expected);
  });
});
