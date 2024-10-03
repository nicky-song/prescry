// Copyright 2018 Prescryptive Health, Inc.

import { NextFunction, Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { ErrorDeviceTokenInvalid } from '@phx/common/src/errors/error-device-token-invalid';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { IPerson } from '@phx/common/src/models/person';
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
import { IJwtTokenPayload } from '../models/token-payload';
import { verifyJwtToken } from '../utils/jwt-account-helper';
import {
  decodePayload,
  IDeviceTokenPayload,
  verifyJsonWebToken,
} from '../utils/jwt-device-helper';
import {
  IDeviceKeyValues,
  IIdentityVerificationKeyValues,
  IPinVerificationKeyValues,
} from '../utils/redis/redis.helper';
import {
  KnownFailureResponse,
  SuccessResponse,
} from '../utils/response-helper';
import { publishAccountUpdateMessage } from '../utils/service-bus/account-update-helper';
import { generateDeviceToken } from '../utils/verify-device-helper';
import {
  keysMatch,
  unauthorizedErrorResponse,
  personNotFoundResponse,
  unexpectedErrorResponse,
} from './middleware.helper';
import {
  CREATE_ACCOUNT_ROUTE_OBSOLETE,
  CREATE_ACCOUNT_ROUTE,
  VERIFY_MEMBERSHIP_ROUTE,
  WAITLIST_REMOVE_ROUTE,
  SEND_REGISTRATION_TEXT_ROUTE,
  SMART_PRICE_REGISTER_ROUTE,
  VERIFY_SSO_JWT_TOKEN_ROUTE,
} from '../constants/routes';
import { validateDeviceTokenMiddlewareV2 } from './device-token.middleware.v2';
import { getEndpointVersion } from '../utils/request/get-endpoint-version';

export const validateDeviceTokenMiddleware =
  (configuration: IConfiguration, database: IDatabase) =>
  (request: Request, response: Response, next: NextFunction) =>
    getEndpointVersion(request) === 'v2'
      ? validateDeviceTokenMiddlewareV2(configuration)(request, response, next)
      : middleware(configuration, database, request, response, next);

async function middleware(
  configuration: IConfiguration,
  database: IDatabase,
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | undefined> {
  if (isUnAuthenticatedRoute(request.originalUrl)) {
    next();
    return;
  }
  const rawToken = getDeviceToken(request);
  if (!rawToken) {
    const authToken =
      request.headers[RequestHeaders.accessTokenRequestHeader] ||
      request.headers.authorization;
    if (authToken) {
      const tokenResponse = await createDeviceTokenResponse(
        response,
        authToken as string,
        configuration,
        database
      );
      return tokenResponse;
    }
    return badRequestResponse(response);
  }

  try {
    const token = verifyJsonWebToken(rawToken, configuration.jwtTokenSecretKey);

    const cached: IDeviceKeyValues | undefined = await getDeviceDataFromRedis(
      token.device,
      token.deviceIdentifier
    );

    const cachedToken = decodeCachedToken(cached);
    if (!cached || !cachedToken) {
      return notInRedisResponse(response);
    }

    const pinVerificationData: IPinVerificationKeyValues | undefined =
      await getPinVerificationDataFromRedis(
        token.device,
        token.deviceIdentifier
      );

    const identityVerificationData: IIdentityVerificationKeyValues | undefined =
      await getIdentityVerificationAttemptsDataFromRedis(token.device);

    const isMaxPinAttemptsReached: boolean = pinVerificationData
      ? isTooManyAttempts(pinVerificationData, configuration)
      : false;

    const isMaxIdentityVerificationReached: boolean = identityVerificationData
      ? isTooManyIdentityVerificationAttempts(
          identityVerificationData,
          configuration
        )
      : false;

    const isResetPinFlow = request.originalUrl.indexOf('/pin-reset/') !== -1;
    if (isMaxPinAttemptsReached && isMaxIdentityVerificationReached) {
      return tooManyVerificationAttemptsResponse(response);
    }

    if (isMaxPinAttemptsReached && !isResetPinFlow) {
      return tooManyAttemptsResponse(response);
    }

    if (isMaxIdentityVerificationReached) {
      return tooManyVerificationAttemptsResponse(response);
    }

    if (!keysMatch(token.deviceKey, cachedToken.deviceKey)) {
      return invalidPinKeyResponse(response);
    }

    updateRequestWithValidatedDeviceToken(cachedToken, response);

    next();
    return;
  } catch (error) {
    const errorObj = error as Error;
    if (
      error instanceof ErrorJsonWebTokenExpired ||
      error instanceof ErrorDeviceTokenInvalid
    ) {
      return unauthorizedErrorResponse(errorObj, response);
    }
    return unexpectedErrorResponse(errorObj, response);
  }
}

export function getDeviceToken(request: Request): string | undefined {
  const token = request.headers[RequestHeaders.deviceTokenRequestHeader];
  if (token && !Array.isArray(token)) {
    return token;
  }
  return;
}

function badRequestResponse(response: Response): Response {
  return KnownFailureResponse(
    response,
    HttpStatusCodes.BAD_REQUEST,
    ErrorConstants.DEVICE_TOKEN_MISSING
  );
}

function notInRedisResponse(response: Response): Response {
  return KnownFailureResponse(
    response,
    HttpStatusCodes.UNAUTHORIZED_REQUEST,
    ErrorConstants.INVALID_TOKEN
  );
}

function tooManyAttemptsResponse(response: Response): Response {
  return KnownFailureResponse(
    response,
    HttpStatusCodes.FORBIDDEN_ERROR,
    ErrorConstants.TOO_MANY_ATTEMPTS_FORGET_PIN,
    undefined,
    InternalErrorCode.SHOW_FORGET_PIN
  );
}

function tooManyVerificationAttemptsResponse(response: Response): Response {
  return KnownFailureResponse(
    response,
    HttpStatusCodes.FORBIDDEN_ERROR,
    ErrorConstants.IDENTITY_VERIFICATION_LOCKED,
    undefined,
    InternalErrorCode.SHOW_ACCOUNT_LOCKED
  );
}

function invalidPinKeyResponse(response: Response): Response {
  return KnownFailureResponse(
    response,
    HttpStatusCodes.FORBIDDEN_ERROR,
    ErrorConstants.INVALID_PIN_KEY
  );
}

export const unVerifiedTokenResponse = (response: Response): Response => {
  return KnownFailureResponse(
    response,
    HttpStatusCodes.UNAUTHORIZED_REQUEST,
    ErrorConstants.DEVICE_NOT_VERIFIED
  );
};

export function decodeCachedToken(
  cached?: IDeviceKeyValues
): IDeviceTokenPayload | undefined {
  if (cached && cached.deviceToken) {
    const decoded = decodeByType<IDeviceTokenPayload>(cached.deviceToken);
    if (decoded) {
      decodePayload(decoded);
      return decoded;
    }
  }
  return;
}

function decodeByType<T>(token: string): T | undefined {
  return decode(token) as T | undefined;
}

export function isTooManyAttempts(
  device: IPinVerificationKeyValues,
  configuration: IConfiguration
): boolean {
  const attempts = device.pinVerificationAttempt || 0;
  return configuration.maxPinVerificationAttempts <= attempts;
}

export function isTooManyIdentityVerificationAttempts(
  device: IIdentityVerificationKeyValues,
  configuration: IConfiguration
): boolean {
  const attempts = device.identityVerificationAttempt ?? 0;
  return configuration.maxPinVerificationAttempts <= attempts;
}

export function updateRequestWithValidatedDeviceToken(
  validatedDevice: IDeviceTokenPayload,
  response: Response
) {
  const phoneDevice: IPhoneDevice = {
    data: validatedDevice.device.trim(),
    identifier: validatedDevice.deviceIdentifier,
    type: 'phone',
  };

  response.locals.device = phoneDevice;
  response.locals.deviceKeyRedis = validatedDevice.deviceKey;
}
export const isUnAuthenticatedRoute = (route: string): boolean => {
  const exactRoutes = [
    SMART_PRICE_REGISTER_ROUTE,
    SEND_REGISTRATION_TEXT_ROUTE,
    WAITLIST_REMOVE_ROUTE,
    CREATE_ACCOUNT_ROUTE,
    CREATE_ACCOUNT_ROUTE_OBSOLETE,
    VERIFY_MEMBERSHIP_ROUTE,
    VERIFY_SSO_JWT_TOKEN_ROUTE,
  ];

  for (const r of exactRoutes) {
    if (`/api${r}` === route) {
      return true;
    }
  }
  const startWithRoutes = [
    'one-time-password',
    'health/',
    'drug/search-price?',
    'geolocation',
    'pharmacy/search?',
    'prescription/user-status/',
    'prescription/verify/',
    'prescription/verify-patient/',
    'content',
  ];
  for (const r of startWithRoutes) {
    if (route.startsWith('/api/' + r)) {
      return true;
    }
  }
  return false;
};

export const createDeviceTokenResponse = async (
  response: Response,
  authToken: string,
  configuration: IConfiguration,
  database: IDatabase
): Promise<Response> => {
  try {
    const verifiedToken: IJwtTokenPayload = verifyJwtToken(
      authToken,
      configuration.jwtTokenSecretKey
    );

    if (
      !verifiedToken.isPhoneNumberVerified ||
      !verifiedToken.isTokenAuthenticated
    ) {
      return unVerifiedTokenResponse(response);
    }

    const identifier = verifiedToken.identifier;
    const phoneNumber = verifiedToken.phoneNumber;

    const modelFound: IPerson | null =
      await database.Models.PersonModel.findOne({
        identifier,
      });

    if (!modelFound) {
      return personNotFoundResponse(response);
    }

    const { account, accountKey, token } = await generateDeviceToken(
      phoneNumber,
      configuration,
      database
    );

    if (!account) {
      await publishAccountUpdateMessage({
        dateOfBirth: modelFound.dateOfBirth,
        firstName: modelFound.firstName,
        lastName: modelFound.lastName,
        phoneNumber,
      });
    }

    const customCode = accountKey
      ? InternalResponseCode.REQUIRE_USER_VERIFY_PIN
      : InternalResponseCode.REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN;

    const message = accountKey
      ? SuccessConstants.LOGIN_WITH_PIN
      : SuccessConstants.CREATE_WITH_PIN;

    return SuccessResponse(
      response,
      message,
      { deviceToken: token },
      undefined,
      undefined,
      HttpStatusCodes.ACCEPTED,
      customCode
    );
  } catch (error) {
    return unauthorizedErrorResponse(error as Error, response);
  }
};

export interface IDevice<T> {
  identifier: string;
  type: 'phone' | 'other';
  data: T;
}

export type IPhoneDevice = IDevice<string>;
