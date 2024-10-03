// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '../../../constants/error-codes';
import { ErrorConstants } from '../../../constants/response-messages';
import { getPinDataFromRedis } from '../../../databases/redis/redis-query-helper';
import { compareHashValue } from '../../../utils/bcryptjs-helper';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { pinDetailsCreator } from '../helpers/pin-creator.helper';
import { invalidPinResponse } from '../helpers/invalid-pin-response.helper';
import { verifyPinSuccessResponse } from '../helpers/verify-pin-success-response.helper';
import { verifyPinHandler } from './verify-pin.handler';
import { databaseMock } from '../../../mock-data/database.mock';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { EndpointVersion } from '../../../models/endpoint-version';
import { getPinKeyValuesFromPatientAccount } from '../../../utils/patient-account/get-pin-key-values-from-patient-account';
import { IAppLocals } from '../../../models/app-locals';
import { patientAccountPrimaryMock } from '../../../mock-data/patient-account.mock';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';

jest.mock('../../../databases/redis/redis-query-helper');
const getPinDataFromRedisMock = getPinDataFromRedis as jest.Mock;

jest.mock('../../../utils/bcryptjs-helper');
const compareHashValueMock = compareHashValue as jest.Mock;

jest.mock('../../../utils/response-helper');
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const unknownResponseMock = UnknownFailureResponse as jest.Mock;

jest.mock('../helpers/pin-creator.helper');
const pinDetailsCreatorMock = pinDetailsCreator as jest.Mock;

jest.mock('../helpers/invalid-pin-response.helper');
const invalidPinResponseMock = invalidPinResponse as jest.Mock;

jest.mock('../helpers/verify-pin-success-response.helper');
const verifyPinSuccessResponseMock = verifyPinSuccessResponse as jest.Mock;

jest.mock(
  '../../../utils/patient-account/get-pin-key-values-from-patient-account'
);
const getPinKeyValuesFromPatientAccountMock =
  getPinKeyValuesFromPatientAccount as jest.Mock;

describe('verifyPinHandler', () => {
  const mockPhoneNumber = 'fake-phone';
  const requestMock = {
    body: {
      encryptedPin: 'encryptedPin',
    },
  } as Request;

  const routerResponseMock = {
    locals: {
      device: {
        data: mockPhoneNumber,
        identifier: 'id-1',
        type: 'phone',
      },
      deviceKeyRedis: 'deviceKey',
    } as IAppLocals,
  } as unknown as Response;

  const v1: EndpointVersion = 'v1';
  const v2: EndpointVersion = 'v2';
  const requestV2Mock = {
    ...requestMock,
    headers: {
      [RequestHeaders.apiVersion]: v2,
    },
  } as Request;

  beforeEach(() => {
    jest.clearAllMocks();

    getPinDataFromRedisMock.mockResolvedValue(undefined);
    compareHashValueMock.mockResolvedValue(undefined);
    pinDetailsCreatorMock.mockResolvedValue(undefined);
    invalidPinResponseMock.mockResolvedValue(undefined);
    verifyPinSuccessResponseMock.mockResolvedValue(undefined);
  });

  it('returns KnownFailureResponse if pin details not found from redis', async () => {
    getPinDataFromRedisMock.mockResolvedValue(undefined);

    await verifyPinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      routerResponseMock,
      HttpStatusCodes.FORBIDDEN_ERROR,
      ErrorConstants.PIN_MISSING,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });

  it('returns KnownFailureResponse if account is in redis but pinHash details not found from redis', async () => {
    getPinDataFromRedisMock.mockResolvedValue({ phoneNumber: mockPhoneNumber });

    await verifyPinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      knownFailureResponseMock,
      routerResponseMock,
      HttpStatusCodes.FORBIDDEN_ERROR,
      ErrorConstants.PIN_MISSING,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });

  it('calls invalidPinResponse if pin is invalid', async () => {
    compareHashValueMock.mockReturnValue(false);

    getPinDataFromRedisMock.mockResolvedValue({
      phoneNumber: mockPhoneNumber,
      pinHash: 'pinHash',
    });

    await verifyPinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      compareHashValueMock,
      'encryptedPin',
      'pinHash'
    );
    expectToHaveBeenCalledOnceOnlyWith(
      invalidPinResponseMock,
      routerResponseMock,
      mockPhoneNumber,
      'id-1',
      configurationMock,
      false
    );
  });

  it.each([[v1], [v2]])(
    'calls verifyPinSuccessResponse if pin is valid (version: %p)',
    async (versionMock: EndpointVersion) => {
      const mockRequest = versionMock === v1 ? requestMock : requestV2Mock;
      compareHashValueMock.mockReturnValueOnce(true);
      getPinDataFromRedisMock.mockResolvedValue({
        phoneNumber: mockPhoneNumber,
        pinHash: 'pinHash',
      });

      const responseMock = {
        ...routerResponseMock,
        locals: {
          ...routerResponseMock.locals,
          patientAccount: patientAccountPrimaryMock,
        } as IAppLocals,
      } as unknown as Response;

      await verifyPinHandler(
        mockRequest,
        responseMock,
        databaseMock,
        configurationMock,
      );

      expectToHaveBeenCalledOnceOnlyWith(
        getPinDataFromRedisMock,
        mockPhoneNumber,
        undefined,
        expect.any(Function),
        configurationMock.redisPinKeyExpiryTime
      );

      expectToHaveBeenCalledOnceOnlyWith(
        compareHashValueMock,
        'encryptedPin',
        'pinHash'
      );
      expectToHaveBeenCalledOnceOnlyWith(
        verifyPinSuccessResponseMock,
        responseMock,
        mockPhoneNumber,
        'id-1',
        {
          phoneNumber: mockPhoneNumber,
          pinHash: 'pinHash',
        },
        configurationMock,
        databaseMock,
        versionMock,
        patientAccountPrimaryMock
      );

      const getPinKeyValues = getPinDataFromRedisMock.mock.calls[0][2];
      await getPinKeyValues();

      if (versionMock === 'v2') {
        expectToHaveBeenCalledOnceOnlyWith(
          getPinKeyValuesFromPatientAccountMock,
          responseMock.locals.patientAccount
        );
      } else {
        expectToHaveBeenCalledOnceOnlyWith(
          pinDetailsCreatorMock,
          databaseMock,
          mockPhoneNumber
        );
      }
    }
  );

  it('returns UnknownFailureResponse in case of exception', async () => {
    const error = { message: 'internal error' };
    getPinDataFromRedisMock.mockImplementation(() => {
      throw error;
    });

    await verifyPinHandler(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );

    expectToHaveBeenCalledOnceOnlyWith(
      unknownResponseMock,
      routerResponseMock,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error
    );
  });
});
