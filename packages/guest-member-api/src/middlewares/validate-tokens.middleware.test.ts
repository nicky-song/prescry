// Copyright 2020 Prescryptive Health, Inc.

import { validateTokensMiddleware } from './validate-tokens.middleware';
import { Request, Response } from 'express';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { ErrorAccountTokenInvalid } from '@phx/common/src/errors/error-account-token-invalid';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { IConfiguration } from '../configuration';
import {
  getDeviceDataFromRedis,
  getIdentityVerificationAttemptsDataFromRedis,
  getPinVerificationDataFromRedis,
} from '../databases/redis/redis-query-helper';
import { verifyJsonWebToken } from '../utils/jwt-device-helper';
import {
  verifyAccountToken,
  generateAccountToken,
} from '../utils/account-token.helper';
import { searchAccountByPhoneNumber } from '../databases/mongo-database/v1/query-helper/account-collection-helper';
import { getAllRecordsForLoggedInPerson } from '../utils/person/get-logged-in-person.helper';
import { SuccessResponseWithInternalResponseCode } from '../utils/response-helper';
import {
  getDeviceToken,
  decodeCachedToken,
  isTooManyAttempts,
  updateRequestWithValidatedDeviceToken,
  isTooManyIdentityVerificationAttempts,
} from './device-token.middleware';
import {
  accountNotFoundResponse,
  updateRequestWithValidatedToken,
} from './account-token.middleware';
import {
  getAccessToken,
  getPinStatus,
  keysMatch,
  getPatientAccountById,
  updatePatientAccountLocals,
} from './middleware.helper';
import { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';
import { getAllAllowedFamilyMembersForFamily } from '../utils/person/get-dependent-person.helper';
import { generateDeviceTokenV2 } from '../utils/verify-device-helper-v2';
import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithOutAuthMock,
  patientAccountPrimaryWithPatientMock,
} from '../mock-data/patient-account.mock';
import { getPatientAccountByPhoneNumber } from '../utils/patient-account/get-patient-account-by-phone-number';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { getPatientByMasterId } from '../utils/external-api/identity/get-patient-by-master-id';
import { mockPatientWithEmail } from '../mock-data/fhir-patient.mock';

jest.mock('../databases/redis/redis-query-helper');
jest.mock('../utils/jwt-device-helper');
jest.mock('../utils/account-token.helper');

jest.mock(
  '../databases/mongo-database/v1/query-helper/account-collection-helper'
);
const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;

jest.mock('../utils/person/get-logged-in-person.helper');
jest.mock('../utils/response-helper');
jest.mock('./device-token.middleware');
jest.mock('./account-token.middleware');

jest.mock('./middleware.helper');
const getAccessTokenMock = getAccessToken as jest.Mock;
const getPinStatusMock = getPinStatus as jest.Mock;
const keysMatchMock = keysMatch as jest.Mock;
const getPatientAccountByIdMock = getPatientAccountById as jest.Mock;
const updatePatientAccountLocalsMock = updatePatientAccountLocals as jest.Mock;

jest.mock('../utils/person/get-dependent-person.helper');
jest.mock('../utils/verify-device-helper-v2');

jest.mock('../utils/external-api/identity/get-patient-by-master-id');
const getPatientByMasterIdMock = getPatientByMasterId as jest.Mock;

const getDeviceDataFromRedisMock = getDeviceDataFromRedis as jest.Mock;
const getPinVerificationDataFromRedisMock =
  getPinVerificationDataFromRedis as jest.Mock;
const verifyJsonWebTokenMock = verifyJsonWebToken as jest.Mock;
const verifyAccountTokenMock = verifyAccountToken as jest.Mock;
const generateAccountTokenMock = generateAccountToken as jest.Mock;
const getAllRecordsForLoggedInPersonMock =
  getAllRecordsForLoggedInPerson as jest.Mock;
const successResponseWithInternalResponseCodeMock =
  SuccessResponseWithInternalResponseCode as jest.Mock;
const getDeviceTokenMock = getDeviceToken as jest.Mock;
const decodeCachedTokenMock = decodeCachedToken as jest.Mock;
const isTooManyAttemptsMock = isTooManyAttempts as jest.Mock;
const updateRequestWithValidatedDeviceTokenMock =
  updateRequestWithValidatedDeviceToken as jest.Mock;
const accountNotFoundResponseMock = accountNotFoundResponse as jest.Mock;
const updateRequestWithValidatedTokenMock =
  updateRequestWithValidatedToken as jest.Mock;
const getAllAllowedFamilyMembersForFamilyMock =
  getAllAllowedFamilyMembersForFamily as jest.Mock;
const getIdentityVerificationAttemptsDataFromRedisMock =
  getIdentityVerificationAttemptsDataFromRedis as jest.Mock;
const isTooManyIdentityVerificationAttemptsMock =
  isTooManyIdentityVerificationAttempts as jest.Mock;
const generateDeviceTokenV2Mock = generateDeviceTokenV2 as jest.Mock;

jest.mock('../utils/patient-account/get-patient-account-by-phone-number');
const getPatientAccountByPhoneNumberMock =
  getPatientAccountByPhoneNumber as jest.Mock;

describe('validateTokensMiddleware', () => {
  const configurationMock = {
    jwtTokenSecretKey:
      'LF0RA4WB9w8HuxGFaYKXu1I4EKNplXW8LF0RA4WB9w8HuxGFaYKXu1I4EKNplXW8',
    maxPinVerificationAttempts: 5,
    childMemberAgeLimit: 13,
  } as IConfiguration;

  const requestMock = {
    headers: {},
    originalUrl: '/api/pin/verify',
  } as unknown as Request;

  const requestAccountMock = {
    headers: {},
    originalUrl: '/api/pin/verify',
  } as unknown as Request;

  const requestAccountMockV2 = {
    headers: {
      [RequestHeaders.apiVersion]: 'v2'
    },
    originalUrl: '/api/pin/verify',
  } as unknown as Request;

  const databaseMock = {} as IDatabase;
  const encryptedDeviceTokenMock = 'encrypted-device-token';
  const deviceTokenMock = {
    device: 'fake-phone',
    deviceIdentifier: 'fake-identifier',
    deviceKey: 'fake-key',
    deviceType: 'phone',
  };
  const accountTokenMock = {
    identifier: 'account-identifier',
    phoneNumber: 'fake-phone',
  };
  const nextFunctionMock = jest.fn();
  const appendFunctionMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    nextFunctionMock.mockReset();

    getDeviceDataFromRedisMock.mockResolvedValue({
      deviceToken: encryptedDeviceTokenMock,
    });

    getIdentityVerificationAttemptsDataFromRedisMock.mockResolvedValue({
      identityVerificationAttempt: 0,
    });

    verifyJsonWebTokenMock.mockReturnValue(deviceTokenMock);
    verifyAccountTokenMock.mockReturnValue(accountTokenMock);
    generateAccountTokenMock.mockReturnValue('refresh-token');

    searchAccountByPhoneNumberMock.mockResolvedValue(undefined);

    getAllRecordsForLoggedInPersonMock.mockReturnValue({
      identifier: 'person-id',
    });

    getDeviceTokenMock.mockReturnValue(encryptedDeviceTokenMock);
    decodeCachedTokenMock.mockReturnValue(deviceTokenMock);
    isTooManyAttemptsMock.mockReturnValue(false);

    getAccessTokenMock.mockReturnValue('accessToken');
    keysMatchMock.mockReturnValue(true);
    getPinVerificationDataFromRedisMock.mockResolvedValue({
      pinVerificationAttempt: 0,
    });
    generateDeviceTokenV2Mock.mockReturnValue({
      account: patientAccountPrimaryMock,
      accountKey: 'account-key',
      token: 'new-device-token',
      recoveryEmailExists: true,
    });
    isTooManyIdentityVerificationAttemptsMock.mockReturnValue(false);
    getPatientAccountByIdMock.mockReturnValue(
      patientAccountPrimaryWithPatientMock
    );
    getPatientAccountByPhoneNumberMock.mockResolvedValue(undefined);
  });

  describe('verifyDeviceToken', () => {
    it('should return success response with internal response code DEVICE_TOKEN_MISSING if device token is missing in the header', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      getDeviceTokenMock.mockReturnValue(undefined);
      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );
      expect(SuccessResponseWithInternalResponseCode).toHaveBeenCalledWith(
        responseMock,
        'DEVICE_TOKEN_MISSING',
        { recoveryEmailExists: false },
        HttpStatusCodes.SUCCESS,
        'DEVICE_TOKEN_MISSING'
      );
      expect(getAccessTokenMock).not.toHaveBeenCalled();
    });

    it('should return success response with internal response code INVALID_DEVICE_TOKEN if device token is invalid or expired', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      const verifyTokenMockError = new ErrorJsonWebTokenExpired();
      verifyJsonWebTokenMock.mockImplementation(() => {
        throw verifyTokenMockError;
      });

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expect(verifyJsonWebTokenMock).toHaveBeenCalledWith(
        encryptedDeviceTokenMock,
        configurationMock.jwtTokenSecretKey
      );
      expect(SuccessResponseWithInternalResponseCode).toHaveBeenCalledWith(
        responseMock,
        verifyTokenMockError.message,
        { recoveryEmailExists: false },
        HttpStatusCodes.SUCCESS,
        'INVALID_DEVICE_TOKEN'
      );
      expect(getAccessTokenMock).not.toHaveBeenCalled();
    });

    it('return success response with internal response code INVALID_DEVICE_TOKEN if device token is not in Redis', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;

      getDeviceDataFromRedisMock.mockResolvedValue(undefined);

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );
      expect(getDeviceDataFromRedisMock).toHaveBeenCalledWith(
        'fake-phone',
        'fake-identifier'
      );
      expect(successResponseWithInternalResponseCodeMock).toHaveBeenCalledWith(
        responseMock,
        'INVALID_DEVICE_TOKEN',
        { recoveryEmailExists: false },
        HttpStatusCodes.SUCCESS,
        'INVALID_DEVICE_TOKEN'
      );
      expect(getAccessTokenMock).not.toHaveBeenCalled();
    });

    it('should return success response with internal response code INVALID_DEVICE_TOKEN if redis cached device token is invalid', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;

      decodeCachedTokenMock.mockReturnValue(undefined);
      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expect(successResponseWithInternalResponseCodeMock).toHaveBeenCalledWith(
        responseMock,
        'INVALID_DEVICE_TOKEN',
        { recoveryEmailExists: false },
        HttpStatusCodes.SUCCESS,
        'INVALID_DEVICE_TOKEN'
      );
      expect(getAccessTokenMock).not.toHaveBeenCalled();
    });

    it('should return success response with internal response code SHOW_FORGET_PIN if user has tried the pin too many times', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      searchAccountByPhoneNumberMock.mockResolvedValue({
        accountKey: 'account-Key',
        phoneNumber: 'fake-phone',
        recoveryEmail: 'abc@test.com',
      });
      getPinVerificationDataFromRedisMock.mockResolvedValue({
        pinVerificationAttempt: 5,
      });
      isTooManyAttemptsMock.mockReturnValue(true);

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expect(successResponseWithInternalResponseCodeMock).toHaveBeenCalledWith(
        responseMock,
        'SHOW_FORGET_PIN',
        { recoveryEmailExists: true },
        HttpStatusCodes.SUCCESS,
        'SHOW_FORGET_PIN'
      );
    });

    it('should return success response with internal response code SHOW_ACCOUNT_LOCKED if user tried to verify his identity too many times', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;

      searchAccountByPhoneNumberMock.mockResolvedValue({
        accountKey: 'account-Key',
        phoneNumber: 'fake-phone',
        recoveryEmail: 'abc@test.com',
      });

      getIdentityVerificationAttemptsDataFromRedisMock.mockResolvedValue({
        identityVerificationAttempt: 5,
      });
      isTooManyIdentityVerificationAttemptsMock.mockReturnValue(true);

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expect(successResponseWithInternalResponseCodeMock).toHaveBeenCalledWith(
        responseMock,
        'SHOW_ACCOUNT_LOCKED',
        { recoveryEmailExists: true },
        HttpStatusCodes.SUCCESS,
        'SHOW_ACCOUNT_LOCKED'
      );
    });

    it('should return success response with internal response code INVALID_PIN_KEY if the deviceKey of redis does not match with header token', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;

      keysMatchMock.mockReturnValue(false);

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expect(successResponseWithInternalResponseCodeMock).toHaveBeenCalledWith(
        responseMock,
        'INVALID_PIN_KEY',
        { recoveryEmailExists: false },
        HttpStatusCodes.SUCCESS,
        'INVALID_PIN_KEY'
      );
      expect(getAccessTokenMock).not.toHaveBeenCalled();
    });

    it('v2: should update refreshDeviceToken if patientAccount exists but not in validated device token', async () => {
      const responseMock = {
        append: appendFunctionMock,
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMockV2,
        responseMock,
        nextFunctionMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        getPatientAccountByPhoneNumberMock,
        configurationMock,
        deviceTokenMock.device
      );

      expect(getAccessTokenMock).toHaveBeenCalled();
    });

    it('v2: should call getPatientAccountById if token has patientAccountId', async () => {
      const responseMock = {
        append: appendFunctionMock,
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      const deviceTokenWithPatientAccount = {
        ...deviceTokenMock,
        patientAccountId: 'account-id1',
      };

      verifyJsonWebTokenMock.mockReturnValue(deviceTokenWithPatientAccount);

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMockV2,
        responseMock,
        nextFunctionMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        getPatientAccountByIdMock,
        responseMock,
        configurationMock,
        deviceTokenWithPatientAccount.patientAccountId
      );

      expect(getPatientAccountByPhoneNumberMock).not.toBeCalled();

      expect(getAccessTokenMock).toHaveBeenCalled();
    });

    it('v2: should call getPatientByMasterId if patientAccount does not have patient details', async () => {
      const responseMock = {
        append: appendFunctionMock,
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      const deviceTokenWithPatientAccount = {
        ...deviceTokenMock,
        patientAccountId: 'account-id1',
      };

      verifyJsonWebTokenMock.mockReturnValue(deviceTokenWithPatientAccount);

      getPatientAccountByIdMock.mockResolvedValue(patientAccountPrimaryMock);

      getPatientByMasterIdMock.mockResolvedValue(mockPatientWithEmail);

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMockV2,
        responseMock,
        nextFunctionMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        getPatientByMasterIdMock,
        mockPatientWithEmail.id,
        configurationMock
      );

      expect(getPatientAccountByPhoneNumberMock).not.toBeCalled();

      expect(getAccessTokenMock).toHaveBeenCalled();
    });

    it('should update request with validated device token from cache and call verifyAccountToken if device token is valid', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMock,
        responseMock,
        nextFunctionMock
      );
      expect(updateRequestWithValidatedDeviceTokenMock).toHaveBeenCalledWith(
        deviceTokenMock,
        responseMock
      );
      expect(getAccessTokenMock).toHaveBeenCalled();
    });
  });

  describe('verifyAccountTokenFromRequest', () => {
    it('should send proper response code based on account status in DB (Required registration) if account token is not there in request headers', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      getAccessTokenMock.mockReturnValue(undefined);
      getPinStatusMock.mockResolvedValue(
        InternalResponseCode.REQUIRE_USER_REGISTRATION
      );
      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMock,
        responseMock,
        nextFunctionMock
      );
      expect(getAccessTokenMock).toHaveBeenCalledWith(requestAccountMock);
      expect(getPinStatusMock).toHaveBeenCalledWith(
        databaseMock,
        'fake-phone',
        'v1',
        undefined
      );
      expect(successResponseWithInternalResponseCodeMock).toHaveBeenCalledWith(
        responseMock,
        'REQUIRE_USER_REGISTRATION',
        { recoveryEmailExists: false },
        HttpStatusCodes.SUCCESS,
        'REQUIRE_USER_REGISTRATION'
      );
    });

    it('should send proper response code based on account status in DB (Set Pin) if account token is not there in request headers', async () => {
      const responseMock = {
        append: appendFunctionMock,
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      getAccessTokenMock.mockReturnValue(undefined);
      getPinStatusMock.mockResolvedValue(
        InternalResponseCode.REQUIRE_USER_SET_PIN
      );
      getPatientAccountByPhoneNumberMock.mockResolvedValue(
        patientAccountPrimaryWithOutAuthMock
      );

      updatePatientAccountLocalsMock.mockImplementation(() => {
        responseMock.locals.patientAccount =
          patientAccountPrimaryWithOutAuthMock;
      });

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMockV2,
        responseMock,
        nextFunctionMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        updatePatientAccountLocalsMock,
        responseMock.locals,
        patientAccountPrimaryWithOutAuthMock,
        deviceTokenMock
      );

      expect(getAccessTokenMock).toHaveBeenCalledWith(requestAccountMockV2);
      expect(getPinStatusMock).toHaveBeenCalledWith(
        databaseMock,
        'fake-phone',
        'v2',
        patientAccountPrimaryWithOutAuthMock
      );
      expect(successResponseWithInternalResponseCodeMock).toHaveBeenCalledWith(
        responseMock,
        'REQUIRE_USER_SET_PIN',
        { recoveryEmailExists: false },
        HttpStatusCodes.SUCCESS,
        'REQUIRE_USER_SET_PIN'
      );
    });

    it('sends proper response code based on account status in DB (Verify Pin) if account token not in request headers', async () => {
      const responseMock = {
        append: appendFunctionMock,
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      getAccessTokenMock.mockReturnValue(undefined);
      getPinStatusMock.mockResolvedValue(
        InternalResponseCode.REQUIRE_USER_VERIFY_PIN
      );
      searchAccountByPhoneNumberMock.mockResolvedValue({
        accountKey: 'account-Key',
        phoneNumber: 'fake-phone',
        recoveryEmail: 'abc@test.com',
      });
      getPatientAccountByPhoneNumberMock.mockResolvedValue(
        patientAccountPrimaryWithPatientMock
      );

      updatePatientAccountLocalsMock.mockImplementation(() => {
        responseMock.locals.patientAccount =
          patientAccountPrimaryWithPatientMock;
      });

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMockV2,
        responseMock,
        nextFunctionMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        searchAccountByPhoneNumberMock,
        databaseMock,
        'fake-phone',
        'retryIfNotFound'
      );

      expectToHaveBeenCalledOnceOnlyWith(
        updatePatientAccountLocalsMock,
        responseMock.locals,
        patientAccountPrimaryWithPatientMock,
        deviceTokenMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        getAccessTokenMock,
        requestAccountMockV2
      );
      expectToHaveBeenCalledOnceOnlyWith(
        getPinStatusMock,
        databaseMock,
        'fake-phone',
        'v2',
        patientAccountPrimaryWithPatientMock
      );
      expectToHaveBeenCalledOnceOnlyWith(
        successResponseWithInternalResponseCodeMock,
        responseMock,
        'REQUIRE_USER_VERIFY_PIN',
        { recoveryEmailExists: false },
        HttpStatusCodes.SUCCESS,
        'REQUIRE_USER_VERIFY_PIN'
      );
    });

    it('should send response code based on pin status if account token is expired', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      getPinStatusMock.mockResolvedValue(
        InternalResponseCode.REQUIRE_USER_VERIFY_PIN
      );
      verifyAccountTokenMock.mockImplementation(() => {
        throw new ErrorJsonWebTokenExpired();
      });
      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMock,
        responseMock,
        nextFunctionMock
      );
      expect(successResponseWithInternalResponseCodeMock).toHaveBeenCalledWith(
        responseMock,
        'Token is expired',
        { recoveryEmailExists: false },
        HttpStatusCodes.SUCCESS,
        'REQUIRE_USER_VERIFY_PIN'
      );
    });

    it('should send response code based on pin status if account token is invalid', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      getPinStatusMock.mockResolvedValue(
        InternalResponseCode.REQUIRE_USER_SET_PIN
      );
      verifyAccountTokenMock.mockImplementation(() => {
        throw new ErrorAccountTokenInvalid();
      });
      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMock,
        responseMock,
        nextFunctionMock
      );
      expect(successResponseWithInternalResponseCodeMock).toHaveBeenCalledWith(
        responseMock,
        'Token is invalid',
        { recoveryEmailExists: false },
        HttpStatusCodes.SUCCESS,
        'REQUIRE_USER_SET_PIN'
      );
    });

    it('should send phoneNumber mismatched response if account token phone number does not match device token', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      getPinStatusMock.mockResolvedValue(
        InternalResponseCode.REQUIRE_USER_SET_PIN
      );
      verifyAccountTokenMock.mockReturnValue({
        identifier: 'person-identifier',
        phoneNumber: 'fake-phone1',
      });

      keysMatchMock.mockReset();
      keysMatchMock.mockReturnValueOnce(true);
      keysMatchMock.mockReturnValueOnce(false);

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMock,
        responseMock,
        nextFunctionMock
      );
      expect(successResponseWithInternalResponseCodeMock).toHaveBeenCalledWith(
        responseMock,
        'PHONE_NUMBER_MISMATCHED',
        { recoveryEmailExists: false },
        HttpStatusCodes.SUCCESS,
        'PHONE_NUMBER_MISMATCHED'
      );
    });

    it('should send account not found response if account token account identifier does not exist in DB', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      getPinStatusMock.mockResolvedValue(
        InternalResponseCode.REQUIRE_USER_SET_PIN
      );
      verifyAccountTokenMock.mockReturnValue({
        identifier: 'account-identifier',
        phoneNumber: 'fake-phone',
      });
      searchAccountByPhoneNumberMock.mockResolvedValue(undefined);

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMock,
        responseMock,
        nextFunctionMock
      );
      expect(accountNotFoundResponseMock).toHaveBeenCalledWith(responseMock);
    });

    it('should add personList, account info, masterIds and payload to response.locals and refresh token to response header if token is successfully verified', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'phone-number',
          },
        },
      } as unknown as Response;
      const masterIdMock1 = 'master-id-1';
      const masterIdMock2 = 'master-id-2';
      const personMock = {
        identifier: 'person-identifier',
        phoneNumber: 'phone-number',
        personCode: '01',
        primaryMemberFamilyId: 'CAJY',
        primaryMemberRxId: 'CAJY01',
        isPrimary: true,
        masterId: masterIdMock1,
      };
      const personList = [
        personMock,
        {
          identifier: 'person-identifier2',
          phoneNumber: 'phone-number',
          personCode: '02',
          primaryMemberFamilyId: 'CAWY',
          primaryMemberRxId: 'CAWY02',
          isPrimary: false,
          masterId: masterIdMock2,
        },
      ];
      getAllRecordsForLoggedInPersonMock.mockResolvedValue(personList);

      const verifiedTokenMock = {
        identifier: 'person-identifier',
        phoneNumber: 'phone-number',
      };
      verifyAccountTokenMock.mockReturnValue(verifiedTokenMock);
      searchAccountByPhoneNumberMock.mockResolvedValue({
        _id: 'account-identifier',
        phoneNumber: 'phone-number',
      });
      const dependentsMock = [
        {
          identifier: 'child-identifier1',
          dateOfBirth: '2009-11-01',
          personCode: '02',
          primaryMemberFamilyId: 'CAJY',
          primaryMemberRxId: 'CAJY02',
        },
        {
          identifier: 'child-identifier2',
          dateOfBirth: '2010-12-11',
          personCode: '03',
          primaryMemberFamilyId: 'CAJY',
          primaryMemberRxId: 'CAJY03',
        },
        {
          identifier: 'child-identifier3',
          dateOfBirth: '2000-02-05',
          personCode: '04',
          primaryMemberFamilyId: 'CAJY',
          primaryMemberRxId: 'CAJY04',
        },
      ];
      getAllAllowedFamilyMembersForFamilyMock.mockResolvedValue(dependentsMock);

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMock,
        responseMock,
        nextFunctionMock
      );

      expect(responseMock.locals.dependents).toEqual(dependentsMock);
      expect(responseMock.locals.account).toEqual({
        _id: 'account-identifier',
        phoneNumber: 'phone-number',
      });
      expect(responseMock.locals.accountIdentifier).toEqual(
        'account-identifier'
      );
      expect(responseMock.locals.personList).toEqual(personList);
      expect(responseMock.locals.masterIds).toEqual([
        masterIdMock1,
        masterIdMock2,
      ]);
      expect(getAllAllowedFamilyMembersForFamilyMock).toHaveBeenCalledWith(
        databaseMock,
        personList,
        'phone-number',
        13
      );
      expect(updateRequestWithValidatedTokenMock).toHaveBeenCalledWith(
        verifiedTokenMock,
        configurationMock,
        responseMock
      );
    });

    it('should send success response if both device token and account tokens are valid', async () => {
      const responseMock = {
        locals: {
          device: {
            data: 'fake-phone',
          },
        },
      } as unknown as Response;
      getPinStatusMock.mockResolvedValue(
        InternalResponseCode.REQUIRE_USER_VERIFY_PIN
      );
      searchAccountByPhoneNumberMock.mockResolvedValue({
        _id: 'account-identifier',
        phoneNumber: 'fake-phone',
      });
      getAllRecordsForLoggedInPersonMock.mockResolvedValue([
        {
          identifier: 'person-identifier',
        },
      ]);

      await validateTokensMiddleware(configurationMock, databaseMock)(
        requestAccountMock,
        responseMock,
        nextFunctionMock
      );

      expect(
        successResponseWithInternalResponseCodeMock
      ).not.toHaveBeenCalled();
      expect(nextFunctionMock).toHaveBeenCalled();
    });
  });
});
