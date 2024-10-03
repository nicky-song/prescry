// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { ErrorAccountTokenInvalid } from '@phx/common/src/errors/error-account-token-invalid';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { IConfiguration } from '../configuration';
import {
  HttpStatusCodes,
  InternalErrorCode,
  InternalResponseCode,
} from '../constants/error-codes';
import { ErrorConstants } from '../constants/response-messages';
import { LoginMessages as responseMessage } from '../constants/response-messages';
import { searchAccountByPhoneNumber } from '../databases/mongo-database/v1/query-helper/account-collection-helper';
import { getAllRecordsForLoggedInPerson } from '../utils/person/get-logged-in-person.helper';
import {
  generateAccountToken,
  verifyAccountToken,
} from '../utils/account-token.helper';
import {
  ErrorFailureResponse,
  KnownFailureResponse,
} from '../utils/response-helper';
import { getPinStatus } from './middleware.helper';
import {
  isAccountTokenRequiredRoute,
  validateAccountTokenMiddleware,
} from './account-token.middleware';
import { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';
import { getAllAllowedFamilyMembersForFamily } from '../utils/person/get-dependent-person.helper';
import {
  CREATE_ACCOUNT_ROUTE,
  CREATE_ACCOUNT_ROUTE_OBSOLETE,
} from '../constants/routes';

jest.mock('../utils/response-helper');
jest.mock(
  '../databases/mongo-database/v1/query-helper/account-collection-helper'
);
jest.mock('../utils/person/get-logged-in-person.helper');
jest.mock('../utils/account-token.helper');
jest.mock('../utils/person/get-dependent-person.helper');

const databaseMock = {} as IDatabase;

const configurationMock = {
  accountTokenExpiryTime: 'accountTokenExpiryTime',
  jwtTokenSecretKey: 'jwtTokenSecretKey',
  childMemberAgeLimit: 13,
} as unknown as IConfiguration;

const nextFunctionMock = jest.fn();
const appendFunctionMock = jest.fn();
const KnownFailureResponseMock = KnownFailureResponse as jest.Mock;
const ErrorFailureResponseMock = ErrorFailureResponse as jest.Mock;
const searchAccountByPhoneNumberMock = searchAccountByPhoneNumber as jest.Mock;
const getAllRecordsForLoggedInPersonMock =
  getAllRecordsForLoggedInPerson as jest.Mock;
const verifyAccountTokenMock = verifyAccountToken as jest.Mock;
const generateAccountTokenMock = generateAccountToken as jest.Mock;
const getAllAllowedFamilyMembersForFamilyMock =
  getAllAllowedFamilyMembersForFamily as jest.Mock;

beforeEach(() => {
  nextFunctionMock.mockReset();
  appendFunctionMock.mockReset();
  KnownFailureResponseMock.mockReset();
  ErrorFailureResponseMock.mockReset();
  searchAccountByPhoneNumberMock.mockReset();
  searchAccountByPhoneNumberMock.mockReturnValue({ _id: 'account-id' });
  getAllRecordsForLoggedInPersonMock.mockReset();
  verifyAccountTokenMock.mockReset();
  generateAccountTokenMock.mockReset();
  generateAccountTokenMock.mockReturnValue('refresh-token');
  getAllAllowedFamilyMembersForFamilyMock.mockReset();
});

describe('validateAccountTokenMiddleware', () => {
  it('should call next if route is DeviceTokenRoute', async () => {
    const deviceTokenRouteRequest = {
      headers: {},
      originalUrl: '/api/account/add',
    } as unknown as Request;
    const responseMock = {
      append: appendFunctionMock,
    } as unknown as Response;
    await validateAccountTokenMiddleware(configurationMock, databaseMock)(
      deviceTokenRouteRequest,
      responseMock,
      nextFunctionMock
    );
    expect(nextFunctionMock).toBeCalledTimes(1);
  });

  it('should throw UNAUTHORIZED_REQUEST error with ACCOUNT_TOKEN_MISSING message and account status if authorization token is not defined', async () => {
    const responseMock = {
      append: appendFunctionMock,
      locals: {
        device: {
          data: 'device-token-phone-number',
        },
      },
    } as unknown as Response;
    const requestMock = {
      headers: {},
      originalUrl: '/api/members',
    } as Request;

    const middlewareHelper = jest.requireActual('./middleware.helper');
    middlewareHelper.getPinStatus = jest
      .fn()
      .mockReturnValueOnce(InternalResponseCode.REQUIRE_USER_SET_PIN);

    await validateAccountTokenMiddleware(configurationMock, databaseMock)(
      requestMock,
      responseMock,
      nextFunctionMock
    );
    expect(getPinStatus).toHaveBeenCalledWith(
      databaseMock,
      responseMock.locals.device.data,
      'v1',
      undefined
    );

    expect(KnownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.ACCOUNT_TOKEN_MISSING,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });

  it('should throw UNAUTHORIZED_REQUEST error with INVALID_TOKEN message if authorization token is not valid', async () => {
    const responseMock = {
      locals: {
        device: {
          data: 'device-token-phone-number',
        },
      },
    } as unknown as Response;
    const requestMock = {
      headers: { authorization: 'invalid-token' },
      originalUrl: '/api/members',
    } as unknown as Request;

    const verifiedTokenMockError = new ErrorAccountTokenInvalid();
    verifyAccountTokenMock.mockImplementationOnce(() => {
      throw verifiedTokenMockError;
    });

    await validateAccountTokenMiddleware(configurationMock, databaseMock)(
      requestMock,
      responseMock,
      nextFunctionMock
    );

    expect(verifyAccountTokenMock).toHaveBeenCalledWith(
      requestMock.headers.authorization,
      configurationMock.jwtTokenSecretKey
    );
    expect(ErrorFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      verifiedTokenMockError
    );
  });

  it('should throw FORBIDDEN_ERROR error if authorization token expired and ask to verify pin', async () => {
    const responseMock = {
      locals: {
        device: {
          data: 'device-token-phone-number',
        },
      },
    } as unknown as Response;

    const requestMock = {
      headers: { authorization: 'token-expired' },
      originalUrl: '/api/members',
    } as unknown as Request;

    const verifiedTokenMockError = new ErrorJsonWebTokenExpired();
    verifyAccountTokenMock.mockImplementationOnce(() => {
      throw verifiedTokenMockError;
    });

    await validateAccountTokenMiddleware(configurationMock, databaseMock)(
      requestMock,
      responseMock,
      nextFunctionMock
    );

    expect(verifyAccountTokenMock).toHaveBeenCalledWith(
      requestMock.headers.authorization,
      configurationMock.jwtTokenSecretKey
    );

    expect(KnownFailureResponse).toHaveBeenNthCalledWith(
      1,
      responseMock,
      HttpStatusCodes.FORBIDDEN_ERROR,
      ErrorConstants.ACCOUNT_TOKEN_EXPIRED,
      verifiedTokenMockError,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN,
      { recoveryEmailExists: false }
    );
  });

  it('should throw FORBIDDEN_ERROR error with recoveryemailexists as true if email exists and authorization token expired and ask to verify pin', async () => {
    const responseMock = {
      locals: {
        device: {
          data: 'device-token-phone-number',
        },
      },
    } as unknown as Response;

    const requestMock = {
      headers: { authorization: 'token-expired' },
      originalUrl: '/api/members',
    } as unknown as Request;

    const verifiedTokenMockError = new ErrorJsonWebTokenExpired();
    verifyAccountTokenMock.mockImplementationOnce(() => {
      throw verifiedTokenMockError;
    });
    searchAccountByPhoneNumberMock.mockReturnValueOnce({
      _id: 'account-id',
      recoveryEmail: 'test@test.com',
    });
    await validateAccountTokenMiddleware(configurationMock, databaseMock)(
      requestMock,
      responseMock,
      nextFunctionMock
    );

    expect(verifyAccountTokenMock).toHaveBeenCalledWith(
      requestMock.headers.authorization,
      configurationMock.jwtTokenSecretKey
    );

    expect(KnownFailureResponse).toHaveBeenNthCalledWith(
      1,
      responseMock,
      HttpStatusCodes.FORBIDDEN_ERROR,
      ErrorConstants.ACCOUNT_TOKEN_EXPIRED,
      verifiedTokenMockError,
      InternalResponseCode.REQUIRE_USER_VERIFY_PIN,
      { recoveryEmailExists: true }
    );
  });

  it('should throw UNAUTHORIZED_REQUEST if phone number in device token is not same as of account token', async () => {
    const responseMock = {
      locals: {
        device: { data: 'device-token-phone-number' },
      },
    } as unknown as Response;

    const requestMock = {
      headers: { authorization: 'token' },
      originalUrl: '/api/members',
    } as unknown as Request;

    const verifiedTokenMock = {
      identifier: 'account-identifier',
      phoneNumber: 'account-token-phone-number',
      version: 'v2',
    };
    verifyAccountTokenMock.mockReturnValueOnce(verifiedTokenMock);

    await validateAccountTokenMiddleware(configurationMock, databaseMock)(
      requestMock,
      responseMock,
      nextFunctionMock
    );

    expect(KnownFailureResponseMock).toHaveBeenNthCalledWith(
      1,
      responseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      responseMessage.PHONE_NUMBER_MISMATCHED,
      undefined,
      InternalErrorCode.UNAUTHORIZED_ACCESS_PHONE_NUMBER_MISMATCHED
    );
  });

  it('should not return error if Person is not found in the database', async () => {
    getAllRecordsForLoggedInPersonMock.mockReturnValueOnce([]);
    const responseMock = {
      locals: {
        device: { data: 'phone-number' },
      },
    } as unknown as Response;
    const requestMock = {
      headers: { authorization: 'token' },
      originalUrl: '/api/members',
    } as unknown as Request;

    const verifiedTokenMock = {
      identifier: 'person-identifier',
      phoneNumber: 'phone-number',
      version: 'v2',
    };
    verifyAccountTokenMock.mockReturnValueOnce(verifiedTokenMock);

    await validateAccountTokenMiddleware(configurationMock, databaseMock)(
      requestMock,
      responseMock,
      nextFunctionMock
    );
    expect(KnownFailureResponseMock).not.toHaveBeenCalled();
    expect(responseMock.locals.personList).toEqual(undefined);
    expect(responseMock.locals.masterIds).toEqual(undefined);
    expect(generateAccountTokenMock).toHaveBeenCalledWith(
      verifiedTokenMock,
      configurationMock.jwtTokenSecretKey,
      configurationMock.accountTokenExpiryTime
    );
  });
  it('should return error if account is not found in DB for the phone number', async () => {
    searchAccountByPhoneNumberMock.mockReturnValueOnce(null);
    const responseMock = {
      locals: {
        device: { data: 'phone-number' },
      },
    } as unknown as Response;
    const requestMock = {
      headers: { authorization: 'token' },
      originalUrl: '/api/members',
    } as unknown as Request;

    const verifiedTokenMock = {
      identifier: 'person-identifier',
      phoneNumber: 'phone-number',
      version: 'v2',
    };
    verifyAccountTokenMock.mockReturnValueOnce(verifiedTokenMock);

    await validateAccountTokenMiddleware(configurationMock, databaseMock)(
      requestMock,
      responseMock,
      nextFunctionMock
    );
    expect(KnownFailureResponseMock).toHaveBeenCalledWith(
      responseMock,
      HttpStatusCodes.UNAUTHORIZED_REQUEST,
      ErrorConstants.PHONE_NUMBER_MISSING
    );
    expect(responseMock.locals.account).toEqual(undefined);
  });

  it('should add personList, account info, masterIds and payload to request.app.locals and refresh token to response header if token is successfully verified', async () => {
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
    getAllRecordsForLoggedInPersonMock.mockReturnValueOnce(personList);

    const responseMock = {
      append: appendFunctionMock,
      locals: {
        device: { data: 'phone-number' },
      },
    } as unknown as Response;
    const requestMock = {
      headers: { authorization: 'token' },
      originalUrl: '/api/members',
    } as unknown as Request;

    const verifiedTokenMock = {
      identifier: 'person-identifier',
      phoneNumber: 'phone-number',
      version: 'v2',
    };
    verifyAccountTokenMock.mockReturnValueOnce(verifiedTokenMock);
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
    ];
    getAllAllowedFamilyMembersForFamilyMock.mockReturnValueOnce(dependentsMock);
    await validateAccountTokenMiddleware(configurationMock, databaseMock)(
      requestMock,
      responseMock,
      nextFunctionMock
    );

    expect(generateAccountTokenMock).toHaveBeenCalledWith(
      verifiedTokenMock,
      configurationMock.jwtTokenSecretKey,
      configurationMock.accountTokenExpiryTime
    );

    expect(responseMock.locals.verifiedPayload).toEqual(verifiedTokenMock);
    expect(responseMock.locals.dependents).toEqual(dependentsMock);
    expect(responseMock.locals.account).toEqual({ _id: 'account-id' });
    expect(responseMock.locals.accountIdentifier).toEqual('account-id');
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
    expect(appendFunctionMock).toHaveBeenCalledWith(
      'x-prescryptive-refresh-account-token',
      'refresh-token'
    );
  });
});

describe('isAccountTokenRequiredRoute()', () => {
  it.each([
    ['/api/one-time-password/verify', false],
    ['/api/one-time-password/send', false],
    ['/api/health/ready', false],
    ['/api/account/pin/verify', false],
    ['/api/login', false],
    ['/api/smart-price/get-smartprice-member-info', false],
    ['/api/smart-price/verify-user', false],
    ['/api/send-registration-text', false],
    ['/api/waitlist/remove', false],
    [
      '/api/drug/search-price?zipcode=11753&ndc=00186077660&supply=5&quantity=50',
      false,
    ],
    ['/api/geolocation?latitude=11753&longitude=50', false],
    ['/api/geolocation/pharmacies?zipcode=11753', false],
    ['/api/geolocation/autocomplete?query=11753', false],
    ['/api/pharmacy/search?zipcode=11753', false],
    [`/api${CREATE_ACCOUNT_ROUTE_OBSOLETE}`, false],
    [`/api${CREATE_ACCOUNT_ROUTE}`, false],
    ['/api/members/verify', false],
    ['/api/provider-location/create-booking', true],
    ['/api/members', true],
    ['/api/pharmacy/auth-search?zipcode=11753', true],
    [
      '/api/drug/auth-search-price?zipcode=11753&ndc=00186077660&supply=5&quantity=50',
      true,
    ],
    ['/api/prescription/user-status/mock', false],
    ['/api/prescription/verify/mockIdentifier', false],
    ['/api/prescription/verify-patient/mockIdentifier', false],
    [
      '/api/content?groupKey=groupKey&language=language&version=1&experienceKey=experienceKey',
      false,
    ],
    ['/api/account/add', false],
    ['/api/feed', true],
    ['/api/consent', true],
  ])('validates url (%p)', (url: string, isTokenNotRequired: boolean) => {
    expect(isAccountTokenRequiredRoute(url)).toEqual(isTokenNotRequired);
  });
});
