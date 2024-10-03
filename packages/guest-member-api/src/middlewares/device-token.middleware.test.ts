// Copyright 2018 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { IConfiguration } from '../configuration';
import {
  HttpStatusCodes,
  InternalErrorCode,
  InternalResponseCode,
} from '../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../constants/response-messages';
import { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';
import {
  getDeviceDataFromRedis,
  getIdentityVerificationAttemptsDataFromRedis,
  getPinVerificationDataFromRedis,
} from '../databases/redis/redis-query-helper';
import { verifyJwtToken } from '../utils/jwt-account-helper';
import { verifyJsonWebToken } from '../utils/jwt-device-helper';
import {
  ErrorFailureResponse,
  KnownFailureResponse,
  SuccessResponse,
} from '../utils/response-helper';
import { publishAccountUpdateMessage } from '../utils/service-bus/account-update-helper';
import { generateDeviceToken } from '../utils/verify-device-helper';
import {
  createDeviceTokenResponse,
  isUnAuthenticatedRoute,
  unVerifiedTokenResponse,
  validateDeviceTokenMiddleware,
} from './device-token.middleware';
import {
  CREATE_ACCOUNT_ROUTE,
  CREATE_ACCOUNT_ROUTE_OBSOLETE,
} from '../constants/routes';

jest.mock('../utils/response-helper');

jest.mock('jsonwebtoken');
jest.mock('../utils/jwt-device-helper', () => ({
  ...(jest.requireActual('../utils/jwt-device-helper') as object),
  verifyJsonWebToken: jest.fn(),
}));

jest.mock('../databases/redis/redis-query-helper');

jest.mock('../utils/jwt-account-helper');

jest.mock('../utils/verify-device-helper', () => ({
  generateDeviceToken: jest.fn().mockReturnValue({
    account: {},
    accountKey: 'accountKey',
    token: 'deviceToken',
  }),
}));

jest.mock('../utils/service-bus/account-update-helper');

const configurationMock = {
  jwtTokenSecretKey:
    'LF0RA4WB9w8HuxGFaYKXu1I4EKNplXW8LF0RA4WB9w8HuxGFaYKXu1I4EKNplXW8',
  maxPinVerificationAttempts: 5,
} as IConfiguration;

const findOneMock = jest.fn();
const databaseMock = {
  Models: {
    PersonModel: {
      findOne: findOneMock,
    },
  },
} as unknown as IDatabase;

const nextFunctionMock = jest.fn();

const responseMock = { locals: {} } as unknown as Response;

const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const ErrorFailureResponseMock = ErrorFailureResponse as jest.Mock;
const verifyJsonWebTokenMock = verifyJsonWebToken as jest.Mock;
const getDeviceDataFromRedisMock = getDeviceDataFromRedis as jest.Mock;
const decodeMock = decode as jest.Mock;
const verifyJwtTokenMock = verifyJwtToken as jest.Mock;
const generateDeviceTokenMock = generateDeviceToken as jest.Mock;
const SuccessResponseMock = SuccessResponse as jest.Mock;
const publishAccountUpdateMessageMock =
  publishAccountUpdateMessage as jest.Mock;
const getPinVerificationDataFromRedisMock =
  getPinVerificationDataFromRedis as jest.Mock;
const getIdentityVerificationAttemptsDataFromRedisMock =
  getIdentityVerificationAttemptsDataFromRedis as jest.Mock;

beforeEach(() => {
  nextFunctionMock.mockReset();
  KnownFailureResponseMock.mockReset();
  decodeMock.mockReset();
  ErrorFailureResponseMock.mockReset();
  verifyJsonWebTokenMock.mockReset();
  getDeviceDataFromRedisMock.mockReset();
  getDeviceDataFromRedisMock.mockReturnValue({
    deviceToken: 'device-token',
  });
  getPinVerificationDataFromRedisMock.mockReset();
  getPinVerificationDataFromRedisMock.mockResolvedValue({
    pinVerificationAttempt: 0,
  });
  getIdentityVerificationAttemptsDataFromRedisMock.mockReset();
  getIdentityVerificationAttemptsDataFromRedisMock.mockResolvedValue({
    identityVerificationAttempt: 2,
  });
});

describe('validateDeviceTokenMiddleware', () => {
  it('should call next if route is UnAuthenticatedRoute', async () => {
    const requestMock = {
      headers: {},
      originalUrl: '/api/one-time-password',
    } as unknown as Request;

    await validateDeviceTokenMiddleware(configurationMock, databaseMock)(
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
    await validateDeviceTokenMiddleware(configurationMock, databaseMock)(
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
    await validateDeviceTokenMiddleware(configurationMock, databaseMock)(
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

  it('should call next with phone number in the request locals if token is valid', async () => {
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
    await validateDeviceTokenMiddleware(configurationMock, databaseMock)(
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

    await validateDeviceTokenMiddleware(configurationMock, databaseMock)(
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

    await validateDeviceTokenMiddleware(configurationMock, databaseMock)(
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

    await validateDeviceTokenMiddleware(configurationMock, databaseMock)(
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
});

describe('isUnAuthenticatedRoute %p', () => {
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

describe('createDeviceTokenResponse()', () => {
  it('should call verifyJwtToken to decode the token and return undefined if there is a error', async () => {
    verifyJwtTokenMock.mockReturnValue({ error: 'Invalid token' });
    const result = await createDeviceTokenResponse(
      responseMock,
      'authtoken',
      configurationMock,
      databaseMock
    );

    expect(result).toBeUndefined();
    expect(verifyJwtTokenMock).toHaveBeenCalledWith(
      'authtoken',
      configurationMock.jwtTokenSecretKey
    );
  });

  it('should return UNAUTHORIZED_REQUEST error if phone number was not verified', async () => {
    verifyJwtTokenMock.mockReturnValue({
      identifier: 'identifier',
      isPhoneNumberVerified: false,
      phoneNumber: 'mock-phoneNumber',
    });

    await createDeviceTokenResponse(
      responseMock,
      'authtoken',
      configurationMock,
      databaseMock
    );

    expect(KnownFailureResponse).toHaveBeenNthCalledWith(
      1,
      responseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.DEVICE_NOT_VERIFIED
    );
  });

  it('should return UNAUTHORIZED_REQUEST error if device was not verified', async () => {
    verifyJwtTokenMock.mockReturnValue({
      identifier: 'identifier',
      isPhoneNumberVerified: true,
      isTokenAuthenticated: false,
      phoneNumber: 'mock-phoneNumber',
    });

    await createDeviceTokenResponse(
      responseMock,
      'authtoken',
      configurationMock,
      databaseMock
    );

    expect(KnownFailureResponse).toHaveBeenNthCalledWith(
      1,
      responseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.DEVICE_NOT_VERIFIED
    );
  });

  it('should return UNAUTHORIZED_REQUEST error if device is verified but person is not found in DB', async () => {
    verifyJwtTokenMock.mockReturnValue({
      identifier: 'identifier',
      isPhoneNumberVerified: true,
      isTokenAuthenticated: true,
      phoneNumber: 'mock-phoneNumber',
    });

    findOneMock.mockReturnValue(null);

    await createDeviceTokenResponse(
      responseMock,
      'authtoken',
      configurationMock,
      databaseMock
    );

    expect(KnownFailureResponse).toHaveBeenNthCalledWith(
      1,
      responseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.INVALID_MEMBER_RXID
    );
  });

  it('should create device token and return success response with responseCode 2002 if Person found and device is verified', async () => {
    verifyJwtTokenMock.mockReturnValue({
      identifier: 'identifier',
      isPhoneNumberVerified: true,
      isTokenAuthenticated: true,
      phoneNumber: 'mock-phoneNumber',
    });
    findOneMock.mockReturnValue({
      dateOfBirth: 'dateOfBirth',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    await createDeviceTokenResponse(
      responseMock,
      'authtoken',
      configurationMock,
      databaseMock
    );
    expect(generateDeviceTokenMock).toHaveBeenCalledWith(
      'mock-phoneNumber',
      configurationMock,
      databaseMock
    );
    expect(SuccessResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.LOGIN_WITH_PIN,
      { deviceToken: 'deviceToken' },
      undefined,
      undefined,
      HttpStatusCodes.ACCEPTED,
      2002
    );
  });

  it('should add account if account not present and return responseCode 2011 if accountkey is not present', async () => {
    verifyJwtTokenMock.mockReturnValue({
      identifier: 'identifier',
      isPhoneNumberVerified: true,
      isTokenAuthenticated: true,
      phoneNumber: 'mock-phoneNumber',
    });
    findOneMock.mockReturnValue({
      dateOfBirth: 'dateOfBirth',
      firstName: 'firstName',
      lastName: 'lastName',
    });
    generateDeviceTokenMock.mockReturnValue({
      token: 'deviceToken',
    });

    await createDeviceTokenResponse(
      responseMock,
      'authtoken',
      configurationMock,
      databaseMock
    );

    expect(publishAccountUpdateMessageMock).toHaveBeenCalledWith({
      dateOfBirth: 'dateOfBirth',
      firstName: 'firstName',
      lastName: 'lastName',
      phoneNumber: 'mock-phoneNumber',
    });
    expect(SuccessResponseMock).toHaveBeenCalledWith(
      responseMock,
      SuccessConstants.CREATE_WITH_PIN,
      { deviceToken: 'deviceToken' },
      undefined,
      undefined,
      HttpStatusCodes.ACCEPTED,
      InternalResponseCode.REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN
    );
  });

  it('should call ErrorFailureResponse if there is a exception', async () => {
    const error = new Error('Invalid token');
    verifyJwtTokenMock.mockImplementation(() => {
      throw error;
    });

    await createDeviceTokenResponse(
      responseMock,
      'authtoken',
      configurationMock,
      databaseMock
    );

    expect(ErrorFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      error
    );
  });
});

describe('unVerifiedTokenResponse', () => {
  it('should return KnownFailureResponse with UNAUTHORIZED_REQUEST as status code and DEVICE_NOT_VERIFIED as error message', () => {
    unVerifiedTokenResponse(responseMock);
    expect(KnownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.DEVICE_NOT_VERIFIED
    );
  });
});
