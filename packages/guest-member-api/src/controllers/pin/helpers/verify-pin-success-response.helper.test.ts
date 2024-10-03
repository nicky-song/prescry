// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPinKeyValues } from '../../../utils/redis/redis.helper';
import { SuccessConstants } from '../../../constants/response-messages';
import { addPinVerificationKeyInRedis } from '../../../databases/redis/redis-query-helper';
import { SuccessResponse } from '../../../utils/response-helper';
import { getPersonIdentifiers } from './get-person-identifiers.helper';
import { generateAccountToken } from '../../../utils/account-token.helper';
import { verifyPinSuccessResponse } from './verify-pin-success-response.helper';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { databaseMock } from '../../../mock-data/database.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithPatientMock,
} from '../../../mock-data/patient-account.mock';
import { IPatientAccount } from '../../../models/platform/patient-account/patient-account';
import { IAccountTokenPayloadV2 } from '../../../models/account-token-payload';
import { getMasterId } from '../../../utils/patient-account/patient-account.helper';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';
import { assertHasAccountId } from '../../../assertions/assert-has-account-id';

jest.mock('../../../databases/redis/redis-query-helper');
const addPinVerificationKeyInRedisMock =
  addPinVerificationKeyInRedis as jest.Mock;

jest.mock('../../../utils/account-token.helper');
const generateAccountTokenMock = generateAccountToken as jest.Mock;

jest.mock('../../../utils/response-helper');
const successResponseMock = SuccessResponse as jest.Mock;

jest.mock('./get-person-identifiers.helper');
const getPersonIdentifiersMock = getPersonIdentifiers as jest.Mock;

jest.mock('../../../assertions/assert-has-patient-account');
const assertHasPatientAccountMock = assertHasPatientAccount as jest.Mock;

jest.mock('../../../assertions/assert-has-account-id');
const assertHasAccountIdMock = assertHasAccountId as jest.Mock;

describe('verifyPinSuccessResponse', () => {
  const mockPhoneNumber = 'fake-phone';
  const mockDeviceIdentifier = 'id-1';
  const routerResponseMock = {} as Response;
  const pinKeyValues: IPinKeyValues = {
    dateOfBirth: 'dob',
    firstName: 'first-name',
    lastName: 'last-name',
    pinHash: 'hash',
    accountKey: 'account-key',
    _id: 'id',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('adds person identifiers in the token if provided', async () => {
    getPersonIdentifiersMock.mockReturnValue(['id1']);
    generateAccountTokenMock.mockReturnValue('token');

    await verifyPinSuccessResponse(
      routerResponseMock,
      mockPhoneNumber,
      mockDeviceIdentifier,
      pinKeyValues,
      configurationMock,
      databaseMock,
      'v1'
    );

    expectToHaveBeenCalledOnceOnlyWith(
      addPinVerificationKeyInRedisMock,
      mockPhoneNumber,
      configurationMock.redisPinVerificationKeyExpiryTime,
      mockDeviceIdentifier
    );
    expectToHaveBeenCalledOnceOnlyWith(
      generateAccountTokenMock,
      {
        firstName: 'first-name',
        identifier: 'id',
        lastName: 'last-name',
        phoneNumber: mockPhoneNumber,
        membershipIdentifiers: ['id1'],
      },
      configurationMock.jwtTokenSecretKey,
      configurationMock.accountTokenExpiryTime
    );
    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      routerResponseMock,
      SuccessConstants.VERIFY_PIN_SUCCESS,
      {
        accountToken: 'token',
      }
    );
  });

  it('does not add person identifiers in the token if not provided', async () => {
    getPersonIdentifiersMock.mockReturnValue(null);
    generateAccountTokenMock.mockReturnValue('token');

    await verifyPinSuccessResponse(
      routerResponseMock,
      mockPhoneNumber,
      mockDeviceIdentifier,
      pinKeyValues,
      configurationMock,
      databaseMock,
      'v1'
    );

    expectToHaveBeenCalledOnceOnlyWith(
      generateAccountTokenMock,
      {
        firstName: 'first-name',
        identifier: 'id',
        lastName: 'last-name',
        phoneNumber: mockPhoneNumber,
        membershipIdentifiers: null,
      },
      configurationMock.jwtTokenSecretKey,
      configurationMock.accountTokenExpiryTime
    );
  });

  it('asserts patient account exists (v2)', async () => {
    await verifyPinSuccessResponse(
      routerResponseMock,
      mockPhoneNumber,
      mockDeviceIdentifier,
      pinKeyValues,
      configurationMock,
      databaseMock,
      'v2',
      patientAccountPrimaryMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      assertHasPatientAccountMock,
      patientAccountPrimaryMock
    );
  });

  it('asserts account id exists in patient account (v2)', async () => {
    const accountIdMock = 'account-id';
    const patientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryWithPatientMock,
      accountId: accountIdMock,
    };

    await verifyPinSuccessResponse(
      routerResponseMock,
      mockPhoneNumber,
      mockDeviceIdentifier,
      pinKeyValues,
      configurationMock,
      databaseMock,
      'v2',
      patientAccountMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      assertHasAccountIdMock,
      patientAccountMock.accountId
    );
  });

  it('generates account token (v2)', async () => {
    const tokenMock = 'token';
    generateAccountTokenMock.mockReturnValue(tokenMock);

    const accountIdMock = 'account-id';
    const patientAccountMock: IPatientAccount = {
      ...patientAccountPrimaryWithPatientMock,
      accountId: accountIdMock,
      patientProfile: `http://somewhere.com/master-id`,
    };

    await verifyPinSuccessResponse(
      routerResponseMock,
      mockPhoneNumber,
      mockDeviceIdentifier,
      pinKeyValues,
      configurationMock,
      databaseMock,
      'v2',
      patientAccountMock
    );

    const expectedPayload: IAccountTokenPayloadV2 = {
      patientAccountId: accountIdMock,
      phoneNumber: mockPhoneNumber,
      cashMasterId: getMasterId(patientAccountMock),
    };
    expectToHaveBeenCalledOnceOnlyWith(
      generateAccountTokenMock,
      expectedPayload,
      configurationMock.jwtTokenSecretKey,
      configurationMock.accountTokenExpiryTime
    );
    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      routerResponseMock,
      SuccessConstants.VERIFY_PIN_SUCCESS,
      {
        accountToken: tokenMock,
      }
    );
  });
});
