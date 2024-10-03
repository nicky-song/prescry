// Copyright 2018 Prescryptive Health, Inc.

import { Response } from 'express';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../constants/error-codes';
import { ErrorConstants } from '../constants/response-messages';
import { searchAccountByPhoneNumber } from '../databases/mongo-database/v1/query-helper/account-collection-helper';
import { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';
import {
  getAccountCreationDataFromRedis,
  getPinDataFromRedis,
} from '../databases/redis/redis-query-helper';
import { KnownFailureResponse } from '../utils/response-helper';
import {
  getPatientAccountById,
  getPinStatus,
  personNotFoundResponse,
  updatePatientAccountLocals,
} from './middleware.helper';
import { getPatientAccountByAccountId } from '../utils/external-api/patient-account/get-patient-account-by-account-id';
import { configurationMock } from '../mock-data/configuration.mock';
import {
  patientAccountPrimaryWithOutAuthMock,
  patientAccountPrimaryWithPatientMock,
} from '../mock-data/patient-account.mock';
import { getPinDetails } from '../utils/patient-account/get-pin-details';
import { IDeviceTokenPayload } from '../utils/jwt-device-helper';
import { IAppLocals } from '../models/app-locals';
import { IPatientAccount } from '../models/platform/patient-account/patient-account';

jest.mock('../utils/response-helper');
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;

jest.mock(
  '../databases/mongo-database/v1/query-helper/account-collection-helper'
);
const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;

jest.mock('../databases/redis/redis-query-helper');
const getAccountCreationDataFromRedisMock =
  getAccountCreationDataFromRedis as jest.Mock;
const getPinDataFromRedisMock = getPinDataFromRedis as jest.Mock;

jest.mock(
  '../utils/external-api/patient-account/get-patient-account-by-account-id'
);
const getPatientAccountByAccountIdMock =
  getPatientAccountByAccountId as jest.Mock;

jest.mock('../utils/patient-account/get-pin-details');
const getPinDetailsMock = getPinDetails as jest.Mock;

describe('middlewareHelper', () => {
  const responseMock = {
    append: jest.fn(),
    locals: {},
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPinStatus', () => {
    const phoneNumber = 'mock-phoneNumber';

    const databaseMock = {
      Models: {
        PersonModel: {
          findOne: jest.fn(),
        },
        AccountModel: {
          findOne: jest.fn(),
        },
      },
    } as unknown as IDatabase;

    it('should return responseCode as REQUIRE_USER_VERIFY_PIN if accountKey is in the redis', async () => {
      getPinDataFromRedisMock.mockImplementation(() => {
        return { phoneNumber, accountKey: 'account-key' };
      });
      const code = await getPinStatus(databaseMock, phoneNumber);
      expect(getPinDataFromRedisMock).toHaveBeenCalledWith(phoneNumber);
      expect(code).toBe(InternalResponseCode.REQUIRE_USER_VERIFY_PIN);
    });

    it('should return responseCode as REQUIRE_USER_REGISTRATION if accountKey is not in the redis and phone number does not exists in account db', async () => {
      getPinDataFromRedisMock.mockImplementation(() => {
        return;
      });
      searchAccountByPhoneNumberMock.mockReturnValueOnce(null);
      const code = await getPinStatus(databaseMock, phoneNumber);
      expect(getPinDataFromRedisMock).toHaveBeenCalledWith(phoneNumber);
      expect(searchAccountByPhoneNumberMock).toHaveBeenNthCalledWith(
        1,
        databaseMock,
        phoneNumber
      );
      expect(code).toBe(InternalResponseCode.REQUIRE_USER_REGISTRATION);
    });

    it('should return responseCode as REQUIRE_USER_SET_PIN if accountKey is not in the redis and but registered phone number exists in the redis', async () => {
      getPinDataFromRedisMock.mockImplementation(() => {
        return;
      });
      getAccountCreationDataFromRedisMock.mockImplementationOnce(() => {
        return { phoneNumber, dateOfBirth: '01-01-2000' };
      });
      searchAccountByPhoneNumberMock.mockReturnValueOnce(null);
      const code = await getPinStatus(databaseMock, phoneNumber);
      expect(getPinDataFromRedisMock).toHaveBeenCalledWith(phoneNumber);
      expect(getAccountCreationDataFromRedis).toHaveBeenCalledWith(phoneNumber);
      expect(searchAccountByPhoneNumberMock).toHaveBeenNthCalledWith(
        1,
        databaseMock,
        phoneNumber
      );
      expect(code).toBe(InternalResponseCode.REQUIRE_USER_SET_PIN);
    });

    it('should return responseCode as REQUIRE_USER_VERIFY_PIN if account key and pin hash are in the account db but not in redis', async () => {
      getPinDataFromRedisMock.mockImplementation(() => {
        return;
      });
      searchAccountByPhoneNumberMock.mockReturnValueOnce({
        accountKey: 'account-key',
        phoneNumber,
        pinHash: 'pin-hash',
        dateOfBirth: '01-01-2000',
      });

      const code = await getPinStatus(databaseMock, phoneNumber);
      expect(getPinDataFromRedisMock).toHaveBeenCalledWith(phoneNumber);
      expect(searchAccountByPhoneNumberMock).toHaveBeenNthCalledWith(
        1,
        databaseMock,
        phoneNumber
      );
      expect(code).toBe(InternalResponseCode.REQUIRE_USER_VERIFY_PIN);
    });

    it('should return responseCode as REQUIRE_USER_REGISTRATION if account exists but accountKey is not in the account db', async () => {
      getPinDataFromRedisMock.mockImplementation(() => {
        return;
      });
      searchAccountByPhoneNumberMock.mockImplementation(() => {
        return { phoneNumber };
      });
      const code = await getPinStatus(databaseMock, phoneNumber);
      expect(getPinDataFromRedisMock).toHaveBeenCalledWith(phoneNumber);
      expect(searchAccountByPhoneNumberMock).toHaveBeenNthCalledWith(
        1,
        databaseMock,
        phoneNumber
      );
      expect(code).toBe(InternalResponseCode.REQUIRE_USER_REGISTRATION);
    });

    it('should return responseCode as REQUIRE_USER_SET_PIN if accountKey is not in the account db but user info is entered', async () => {
      getPinDataFromRedisMock.mockImplementation(() => {
        return;
      });
      searchAccountByPhoneNumberMock.mockImplementation(() => {
        return { phoneNumber, dateOfBirth: '01-01-2000' };
      });
      const code = await getPinStatus(databaseMock, phoneNumber);
      expect(getPinDataFromRedisMock).toHaveBeenCalledWith(phoneNumber);
      expect(searchAccountByPhoneNumberMock).toHaveBeenNthCalledWith(
        1,
        databaseMock,
        phoneNumber
      );
      expect(code).toBe(InternalResponseCode.REQUIRE_USER_SET_PIN);
    });

    it('v2: should return REQUIRE_USER_REGISTRATION if patientAccount is not passed', async () => {
      const status = await getPinStatus(databaseMock, phoneNumber, 'v2');
      expect(status).toBe(InternalResponseCode.REQUIRE_USER_REGISTRATION);
    });

    it('v2: should return REQUIRE_USER_SET_PIN if patientAccount is passed but patientAccount does not have pin details', async () => {
      const status = await getPinStatus(
        databaseMock,
        phoneNumber,
        'v2',
        patientAccountPrimaryWithOutAuthMock
      );
      expect(status).toBe(InternalResponseCode.REQUIRE_USER_SET_PIN);
    });

    it('v2: should return REQUIRE_USER_VERIFY_PIN if patientAccount is passed and has pin details', async () => {
      getPinDetailsMock.mockReturnValueOnce({
        accountKey: 'account-key',
        pinHash: 'pin-hash',
      });
      const status = await getPinStatus(
        databaseMock,
        phoneNumber,
        'v2',
        patientAccountPrimaryWithPatientMock
      );
      expect(status).toBe(InternalResponseCode.REQUIRE_USER_VERIFY_PIN);
    });
  });

  describe('personNotFoundResponse', () => {
    it('should return KnownFailureResponse with UNAUTHORIZED_REQUEST as status code and INVALID_MEMBER_RXID as error message', () => {
      personNotFoundResponse(responseMock);
      expect(KnownFailureResponseMock).toHaveBeenNthCalledWith(
        1,
        responseMock,
        HttpStatusCodes.UNAUTHORIZED_REQUEST,
        ErrorConstants.INVALID_MEMBER_RXID
      );
    });
  });

  describe('getPatientAccountById', () => {
    it('should return undefined if patientAccount is not passed', async () => {
      const actual = await getPatientAccountById(
        responseMock,
        configurationMock
      );
      expect(actual).toBe(undefined);
      expect(getPatientAccountByAccountIdMock).not.toBeCalled();
    });

    it('should call getPatientAccountByAccountId if patientAccount is passed', async () => {
      const patientAccountId = 'account-id1';
      const actual = await getPatientAccountById(
        responseMock,
        configurationMock,
        patientAccountId
      );
      expect(actual).toBe(undefined);
      expect(getPatientAccountByAccountIdMock).toBeCalledWith(
        configurationMock,
        patientAccountId,
        true,
        true
      );
    });

    it('should return patientAccount if getPatientAccountByAccountId returns patientAccount', async () => {
      const patientAccountId = 'account-id1';
      getPatientAccountByAccountIdMock.mockReturnValueOnce(
        patientAccountPrimaryWithPatientMock
      );
      const actual = await getPatientAccountById(
        responseMock,
        configurationMock,
        patientAccountId
      );
      expect(actual).toEqual(patientAccountPrimaryWithPatientMock);
      expect(getPatientAccountByAccountIdMock).toBeCalledWith(
        configurationMock,
        patientAccountId,
        true,
        true
      );
    });
  });

  describe('updatePatientAccountLocals', () => {
    it.each([[undefined], ['patient-account-id']])(
      'updates locals (tokenPatientAccountId: %p)',
      (tokenPatientAccountIdMock: string | undefined) => {
        const tokenMock: Partial<IDeviceTokenPayload> = {
          patientAccountId: tokenPatientAccountIdMock,
        };

        const accountIdMock = 'account-id';
        const patientAccountMock: IPatientAccount = {
          ...patientAccountPrimaryWithPatientMock,
          accountId: accountIdMock,
        };

        const localsMock: Partial<IAppLocals> = {};
        updatePatientAccountLocals(
          localsMock as IAppLocals,
          patientAccountMock,
          tokenMock as IDeviceTokenPayload
        );

        const expectedAccountId = tokenPatientAccountIdMock ?? accountIdMock;
        expect(localsMock.patientAccount).toEqual(patientAccountMock);
        expect(localsMock.patient).toEqual(patientAccountMock.patient);
        expect(localsMock.patientAccountId).toEqual(expectedAccountId);
      }
    );
  });
});
