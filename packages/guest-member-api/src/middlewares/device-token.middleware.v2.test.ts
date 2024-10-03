// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { IConfiguration } from '../configuration';
import { HttpStatusCodes, InternalErrorCode } from '../constants/error-codes';
import { ErrorConstants } from '../constants/response-messages';
import {
  getDeviceDataFromRedis,
  getIdentityVerificationAttemptsDataFromRedis,
  getPinVerificationDataFromRedis,
} from '../databases/redis/redis-query-helper';
import {
  IDeviceTokenPayload,
  verifyJsonWebToken,
} from '../utils/jwt-device-helper';
import {
  ErrorFailureResponse,
  KnownFailureResponse,
} from '../utils/response-helper';
import { generateDeviceTokenV2 } from '../utils/verify-device-helper-v2';
import {
  isUnAuthenticatedRoute,
  validateDeviceTokenMiddlewareV2,
} from './device-token.middleware.v2';
import {
  getPatientAccountById,
  updatePatientAccountLocals,
} from './middleware.helper';
import {
  patientAccountPrimaryMock,
  patientAccountPrimaryWithPatientMock,
} from '../mock-data/patient-account.mock';
import {
  CREATE_ACCOUNT_ROUTE,
  CREATE_ACCOUNT_ROUTE_OBSOLETE,
} from '../constants/routes';
import { getPatientAccountByPhoneNumber } from '../utils/patient-account/get-patient-account-by-phone-number';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';
import { getPatientByMasterId } from '../utils/external-api/identity/get-patient-by-master-id';
import { mockPatientWithEmail } from '../mock-data/fhir-patient.mock';

jest.mock('./middleware.helper', () => ({
  ...(jest.requireActual('./middleware.helper') as object),
  getPatientAccountById: jest.fn(),
  updatePatientAccountLocals: jest.fn(),
}));

jest.mock('../utils/external-api/identity/get-patient-by-master-id');
const getPatientByMasterIdMock = getPatientByMasterId as jest.Mock;

const getPatientAccountByIdMock = getPatientAccountById as jest.Mock;
const updatePatientAccountLocalsMock = updatePatientAccountLocals as jest.Mock;

jest.mock('../utils/response-helper');

jest.mock('jsonwebtoken');
jest.mock('../utils/jwt-device-helper', () => ({
  ...(jest.requireActual('../utils/jwt-device-helper') as object),
  verifyJsonWebToken: jest.fn(),
}));

jest.mock('../databases/redis/redis-query-helper');

jest.mock('../utils/verify-device-helper-v2', () => ({
  generateDeviceTokenV2: jest.fn().mockReturnValue({
    account: {},
    accountKey: 'accountKey',
    token: 'deviceToken',
    patientAccountId: 'account-id1',
    deviceHash: 'phone-hash',
  }),
}));

jest.mock('../utils/service-bus/account-update-helper');

const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const ErrorFailureResponseMock = ErrorFailureResponse as jest.Mock;
const verifyJsonWebTokenMock = verifyJsonWebToken as jest.Mock;
const getDeviceDataFromRedisMock = getDeviceDataFromRedis as jest.Mock;
const decodeMock = decode as jest.Mock;
const generateDeviceTokenV2Mock = generateDeviceTokenV2 as jest.Mock;
const getPinVerificationDataFromRedisMock =
  getPinVerificationDataFromRedis as jest.Mock;
const getIdentityVerificationAttemptsDataFromRedisMock =
  getIdentityVerificationAttemptsDataFromRedis as jest.Mock;

jest.mock('../utils/patient-account/get-patient-account-by-phone-number');
const getPatientAccountByPhoneNumberMock =
  getPatientAccountByPhoneNumber as jest.Mock;

describe('deviceTokenMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateDeviceTokenMiddlewareV2', () => {
    const configurationMock = {
      jwtTokenSecretKey:
        'LF0RA4WB9w8HuxGFaYKXu1I4EKNplXW8LF0RA4WB9w8HuxGFaYKXu1I4EKNplXW8',
      maxPinVerificationAttempts: 5,
    } as IConfiguration;

    const responseMock = {
      append: jest.fn(),
      locals: {},
    } as unknown as Response;

    const nextFunctionMock = jest.fn();

    beforeEach(() => {
      getDeviceDataFromRedisMock.mockReturnValue({
        deviceToken: 'device-token',
      });
      getPinVerificationDataFromRedisMock.mockResolvedValue({
        pinVerificationAttempt: 0,
      });
      getIdentityVerificationAttemptsDataFromRedisMock.mockResolvedValue({
        identityVerificationAttempt: 2,
      });
      getPatientAccountByIdMock.mockResolvedValue(undefined);
      getPatientAccountByPhoneNumberMock.mockResolvedValue(undefined);
    });

    it('should call next if route is UnAuthenticatedRoute', async () => {
      const requestMock = {
        headers: {},
        originalUrl: '/api/one-time-password',
      } as unknown as Request;

      await validateDeviceTokenMiddlewareV2(configurationMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );
      expect(nextFunctionMock).toHaveBeenCalledTimes(1);
    });

    it('should throw BAD_REQUEST error if route is not UnAuthenticatedRoute and device token is missing in the header', async () => {
      const requestMockWithoutHeader = {
        headers: {},
        originalUrl: '/api/pin/verify',
      } as unknown as Request;
      await validateDeviceTokenMiddlewareV2(configurationMock)(
        requestMockWithoutHeader,
        responseMock,
        nextFunctionMock
      );
      expect(KnownFailureResponseMock).toHaveBeenNthCalledWith(
        1,
        responseMock,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.DEVICE_TOKEN_MISSING
      );
    });

    it('should throw UNAUTHORIZED_REQUEST error if token is invalid or expired', async () => {
      const requestMock = {
        headers: { [RequestHeaders.deviceTokenRequestHeader]: 'token' },
        originalUrl: '/api/pin/verify',
      } as unknown as Request;

      const verifyTokenMockError = new ErrorJsonWebTokenExpired();
      verifyJsonWebTokenMock.mockImplementation(() => {
        throw verifyTokenMockError;
      });
      await validateDeviceTokenMiddlewareV2(configurationMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expect(verifyJsonWebTokenMock).toHaveBeenNthCalledWith(
        1,
        requestMock.headers[RequestHeaders.deviceTokenRequestHeader],
        configurationMock.jwtTokenSecretKey
      );
      expect(ErrorFailureResponseMock).toHaveBeenNthCalledWith(
        1,
        responseMock,
        HttpStatusCodes.UNAUTHORIZED_REQUEST,
        verifyTokenMockError
      );
    });

    it('should call next with phone number in the request locals if token is valid and patientAccount doesnt exist', async () => {
      const requestMock = {
        headers: { [RequestHeaders.deviceTokenRequestHeader]: 'token' },
        originalUrl: '/api/pin/verify',
      } as unknown as Request;
      verifyJsonWebTokenMock.mockReturnValueOnce({
        device: '+11111111111',
        deviceIdentifier: 'abc',
        deviceKey: 'XXXX',
        deviceType: 'phone',
      });
      decodeMock.mockReturnValue({
        device: 'KzExMTExMTExMTEx',
        deviceIdentifier: 'abc',
        deviceKey: 'XXXX',
        deviceType: 'phone',
      });
      await validateDeviceTokenMiddlewareV2(configurationMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expect(verifyJsonWebTokenMock).toHaveBeenNthCalledWith(
        1,
        requestMock.headers[RequestHeaders.deviceTokenRequestHeader],
        configurationMock.jwtTokenSecretKey
      );

      expect(responseMock.locals.device.data).toBe('+11111111111');
      expect(nextFunctionMock).toHaveBeenCalledTimes(1);
    });

    it('should return FORBIDDEN_ERROR if pinVerificationAttempt is greater or equal to 5', async () => {
      const requestMock = {
        headers: { [RequestHeaders.deviceTokenRequestHeader]: 'token' },
        originalUrl: '/api/pin/verify',
      } as unknown as Request;

      verifyJsonWebTokenMock.mockReturnValueOnce({
        device: 'KzExMTExMTExMTEx',
        deviceIdentifier: 'device-identifier',
      });

      getDeviceDataFromRedisMock.mockReturnValueOnce({
        deviceToken: 'device-token',
      });

      getPinVerificationDataFromRedisMock.mockReturnValueOnce({
        pinVerificationAttempt: 5,
      });
      decodeMock.mockReturnValueOnce({
        device: '+11111111111',
        deviceIdentifier: 'abc',
        deviceKey: 'XXXX',
        deviceType: 'phone',
      });

      await validateDeviceTokenMiddlewareV2(configurationMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expect(getPinVerificationDataFromRedisMock).toHaveBeenNthCalledWith(
        1,
        'KzExMTExMTExMTEx',
        'device-identifier'
      );
      expect(KnownFailureResponseMock).toHaveBeenNthCalledWith(
        1,
        responseMock,
        HttpStatusCodes.FORBIDDEN_ERROR,
        ErrorConstants.TOO_MANY_ATTEMPTS_FORGET_PIN,
        undefined,
        InternalErrorCode.SHOW_FORGET_PIN
      );
    });

    it('should return UNAUTHORIZED_REQUEST if device token is not in Redis', async () => {
      const requestMock = {
        headers: { [RequestHeaders.deviceTokenRequestHeader]: 'token' },
        originalUrl: '/api/pin/verify',
      } as unknown as Request;

      verifyJsonWebTokenMock.mockReturnValueOnce({
        device: 'KzExMTExMTExMTEx',
        deviceIdentifier: 'device-identifier',
      });

      getDeviceDataFromRedisMock.mockReturnValue(undefined);

      await validateDeviceTokenMiddlewareV2(configurationMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expect(KnownFailureResponse).toHaveBeenNthCalledWith(
        1,
        responseMock,
        HttpStatusCodes.UNAUTHORIZED_REQUEST,
        ErrorConstants.INVALID_TOKEN
      );
    });

    it('should return FORBIDDEN_ERROR if verificationIdentityAttempts are greater or equal to 5', async () => {
      const requestMock = {
        headers: { [RequestHeaders.deviceTokenRequestHeader]: 'token' },
        originalUrl: '/api/pin/verify',
      } as unknown as Request;

      verifyJsonWebTokenMock.mockReturnValueOnce({
        device: 'KzExMTExMTExMTEx',
        deviceIdentifier: 'device-identifier',
      });

      getDeviceDataFromRedisMock.mockReturnValueOnce({
        deviceToken: 'device-token',
      });

      getIdentityVerificationAttemptsDataFromRedisMock.mockReturnValueOnce({
        identityVerificationAttempt: 5,
      });

      decodeMock.mockReturnValueOnce({
        device: '+11111111111',
        deviceIdentifier: 'abc',
        deviceKey: 'XXXX',
        deviceType: 'phone',
      });

      await validateDeviceTokenMiddlewareV2(configurationMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expect(
        getIdentityVerificationAttemptsDataFromRedisMock
      ).toHaveBeenCalledWith('KzExMTExMTExMTEx');
      expect(KnownFailureResponseMock).toHaveBeenNthCalledWith(
        1,
        responseMock,
        HttpStatusCodes.FORBIDDEN_ERROR,
        ErrorConstants.IDENTITY_VERIFICATION_LOCKED,
        undefined,
        InternalErrorCode.SHOW_ACCOUNT_LOCKED
      );
    });

    it('should call getPatientAccountById if token has patientAccountId', async () => {
      const requestMock = {
        headers: { [RequestHeaders.deviceTokenRequestHeader]: 'token' },
        originalUrl: '/api/pin/verify',
      } as unknown as Request;

      const tokenMock: IDeviceTokenPayload = {
        device: '+11111111111',
        deviceIdentifier: 'abc',
        deviceKey: 'XXXX',
        deviceType: 'phone',
        patientAccountId: 'account-id1',
      };
      verifyJsonWebTokenMock.mockReturnValueOnce(tokenMock);

      decodeMock.mockReturnValueOnce({
        device: '+11111111111',
        deviceIdentifier: 'abc',
        deviceKey: 'XXXX',
        deviceType: 'phone',
        patientAccountId: 'account-id1',
        deviceHash: 'phone-hash',
      });

      getPatientAccountByIdMock.mockResolvedValue(
        patientAccountPrimaryWithPatientMock
      );

      await validateDeviceTokenMiddlewareV2(configurationMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expect(getPatientAccountByIdMock).toHaveBeenCalledWith(
        responseMock,
        configurationMock,
        tokenMock.patientAccountId
      );
      expect(generateDeviceTokenV2Mock).not.toBeCalled();

      expectToHaveBeenCalledOnceOnlyWith(
        updatePatientAccountLocalsMock,
        responseMock.locals,
        patientAccountPrimaryWithPatientMock,
        tokenMock
      );
    });

    it('should call getPatientAccountByPhoneNumber if token does not have patientAccountId', async () => {
      const requestMock = {
        headers: { [RequestHeaders.deviceTokenRequestHeader]: 'token' },
        originalUrl: '/api/pin/verify',
      } as unknown as Request;

      const deviceTokenMock: IDeviceTokenPayload = {
        device: '+11111111111',
        deviceIdentifier: 'abc',
        deviceKey: 'XXXX',
        deviceType: 'phone',
      };
      verifyJsonWebTokenMock.mockReturnValueOnce(deviceTokenMock);

      decodeMock.mockReturnValueOnce({
        device: '+11111111111',
        deviceIdentifier: 'abc',
        deviceKey: 'XXXX',
        deviceType: 'phone',
      });

      getPatientAccountByPhoneNumberMock.mockResolvedValue(
        patientAccountPrimaryWithPatientMock
      );

      await validateDeviceTokenMiddlewareV2(configurationMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expectToHaveBeenCalledOnceOnlyWith(
        getPatientAccountByPhoneNumberMock,
        configurationMock,
        deviceTokenMock.device
      );
      expect(getPatientAccountByIdMock).not.toBeCalled();

      expectToHaveBeenCalledOnceOnlyWith(
        updatePatientAccountLocalsMock,
        responseMock.locals,
        patientAccountPrimaryWithPatientMock,
        deviceTokenMock
      );
    });
    it('should get patient details using getPatientByMasterId if patientAccount doesnt have patient details', async () => {
      const requestMock = {
        headers: { [RequestHeaders.deviceTokenRequestHeader]: 'token' },
        originalUrl: '/api/',
      } as unknown as Request;

      const tokenMock: IDeviceTokenPayload = {
        device: '+11111111111',
        deviceIdentifier: 'abc',
        deviceKey: 'XXXX',
        deviceType: 'phone',
        patientAccountId: 'account-id1',
      };
      verifyJsonWebTokenMock.mockReturnValueOnce(tokenMock);

      decodeMock.mockReturnValueOnce({
        device: '+11111111111',
        deviceIdentifier: 'abc',
        deviceKey: 'XXXX',
        deviceType: 'phone',
        patientAccountId: 'account-id1',
        deviceHash: 'phone-hash',
      });

      getPatientAccountByIdMock.mockResolvedValue(patientAccountPrimaryMock);
      getPatientByMasterIdMock.mockReturnValue(mockPatientWithEmail);
      await validateDeviceTokenMiddlewareV2(configurationMock)(
        requestMock,
        responseMock,
        nextFunctionMock
      );

      expect(getPatientAccountByIdMock).toHaveBeenCalledWith(
        responseMock,
        configurationMock,
        tokenMock.patientAccountId
      );
      expect(generateDeviceTokenV2Mock).not.toBeCalled();

      expectToHaveBeenCalledOnceOnlyWith(
        updatePatientAccountLocalsMock,
        responseMock.locals,
        patientAccountPrimaryWithPatientMock,
        tokenMock
      );
    });
  });

  describe('isUnAuthenticatedRoute', () => {
    it('should return true for one time password route', () => {
      expect(
        isUnAuthenticatedRoute(`/api/one-time-password/send`)
      ).toBeTruthy();
      expect(
        isUnAuthenticatedRoute(`/api/one-time-password/verify`)
      ).toBeTruthy();
    });
    it('should return true for send registration text route', () => {
      expect(
        isUnAuthenticatedRoute(`/api/send-registration-text`)
      ).toBeTruthy();
    });
    it('should return true for smart price register route', () => {
      expect(
        isUnAuthenticatedRoute(`/api/smart-price/register`)
      ).toBeTruthy();
    });
    it('should return true for health ready route', () => {
      expect(
        isUnAuthenticatedRoute(`/api/health/ready`)
      ).toBeTruthy();
    });
    it('should return true for health live route', () => {
      expect(
        isUnAuthenticatedRoute(`/api/health/live`)
      ).toBeTruthy();
    });
    it('should return true for remove waitlist route', () => {
      expect(
        isUnAuthenticatedRoute(`/api/waitlist/remove`)
      ).toBeTruthy();
    });
    it('should return true for drug price search route', () => {
      expect(
        isUnAuthenticatedRoute(
          `/api/drug/search-price?zipcode=11753&ndc=00186077660&supply=5&quantity=50`
        )
      ).toBeTruthy();
    });
    it('should return false for drug price auth search route', () => {
      expect(
        isUnAuthenticatedRoute(
          `/api/drug/auth-search-price?zipcode=11753&ndc=00186077660&supply=5&quantity=50`
        )
      ).toBeFalsy();
    });
    it('should return true for geo location route', () => {
      expect(
        isUnAuthenticatedRoute(
          `/api/geolocation?latitude=11753&longitude=50`
        )
      ).toBeTruthy();
    });
    it('should return true for geolocation pharmacies route', () => {
      expect(
        isUnAuthenticatedRoute(
          `/api/geolocation/pharmacies?zipcode=11753`
        )
      ).toBeTruthy();
    });
    it('should return true for geolocation autocomplete route', () => {
      expect(
        isUnAuthenticatedRoute(
          `/api/geolocation/autocomplete?query=11753`
        )
      ).toBeTruthy();
    });
    it('should return true for pharmacy search route', () => {
      expect(
        isUnAuthenticatedRoute(
          `/api/pharmacy/search?zipcode=11753`
        )
      ).toBeTruthy();
    });
    it('should return true for create account route', () => {
      expect(
        isUnAuthenticatedRoute(`/api${CREATE_ACCOUNT_ROUTE}`)
      ).toBeTruthy();
      expect(
        isUnAuthenticatedRoute(
          `/api${CREATE_ACCOUNT_ROUTE_OBSOLETE}`
        )
      ).toBeTruthy();
    });
    it('should return true for verify membership for create account route', () => {
      expect(
        isUnAuthenticatedRoute(`/api/members/verify`)
      ).toBeTruthy();
    });
    it('should return true for user status check for prescription route', () => {
      expect(
        isUnAuthenticatedRoute(`/api/prescription/user-status/`)
      ).toBeTruthy();
    });
    it('should return true for prescription info check for prescription route', () => {
      expect(
        isUnAuthenticatedRoute(`/api/prescription/verify/`)
      ).toBeTruthy();
    });
    it('should return true for patient info check for prescription route', () => {
      expect(
        isUnAuthenticatedRoute(`/api/prescription/verify-patient/`)
      ).toBeTruthy();
    });
    it('should return false for other route', () => {
      expect(isUnAuthenticatedRoute(`/api/pin`)).toBeFalsy();
    });
    it('should return false for other route', () => {
      expect(
        isUnAuthenticatedRoute(
          `/api/prescription/send-prescription`
        )
      ).toBeFalsy();
    });
    it('should return false for pharmacy search auth route', () => {
      expect(
        isUnAuthenticatedRoute(
          `/api/pharmacy/auth-search?zipcode=11753`
        )
      ).toBeFalsy();
    });
    it('should return true for content route', () => {
      expect(
        isUnAuthenticatedRoute(
          `/api/content?groupKey=groupKey&language=language&version=1&experienceKey=experienceKey`
        )
      ).toBeTruthy();
    });
  });
});
