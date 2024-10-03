// Copyright 2018 Prescryptive Health, Inc.

import { NextFunction, Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { ErrorDeviceTokenInvalid } from '@phx/common/src/errors/error-device-token-invalid';
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
  decodePayload,
  IDeviceTokenPayload,
  verifyJsonWebToken,
} from '../utils/jwt-device-helper';
import {
  IDeviceKeyValues,
  IIdentityVerificationKeyValues,
  IPinVerificationKeyValues,
} from '../utils/redis/redis.helper';
import { KnownFailureResponse } from '../utils/response-helper';
import { generateDeviceTokenV2 } from '../utils/verify-device-helper-v2';
import {
  keysMatch,
  unauthorizedErrorResponse,
  unexpectedErrorResponse,
  getPatientAccountById,
  updatePatientAccountLocals,
} from './middleware.helper';
import {
  CREATE_ACCOUNT_ROUTE,
  CREATE_ACCOUNT_ROUTE_OBSOLETE,
  SEND_REGISTRATION_TEXT_ROUTE,
  SMART_PRICE_REGISTER_ROUTE,
  VERIFY_MEMBERSHIP_ROUTE,
  VERIFY_SSO_JWT_TOKEN_ROUTE,
  WAITLIST_REMOVE_ROUTE,
} from '../constants/routes';
import { getPatientAccountByPhoneNumber } from '../utils/patient-account/get-patient-account-by-phone-number';
import { IAppLocals } from '../models/app-locals';
import { getMasterId } from '../utils/patient-account/patient-account.helper';
import { getPatientByMasterId } from '../utils/external-api/identity/get-patient-by-master-id';

export const validateDeviceTokenMiddlewareV2 =
  (configuration: IConfiguration) =>
  async (request: Request, response: Response, next: NextFunction) =>
    await middleware(configuration, request, response, next);

async function middleware(
  configuration: IConfiguration,
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
    const isMaxPinAttemptsReached: boolean = pinVerificationData
      ? isTooManyAttempts(pinVerificationData, configuration)
      : false;

    const identityVerificationData: IIdentityVerificationKeyValues | undefined =
      await getIdentityVerificationAttemptsDataFromRedis(token.device);

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

    const patientAccount = token.patientAccountId
      ? await getPatientAccountById(
          response,
          configuration,
          token.patientAccountId
        )
      : await getPatientAccountByPhoneNumber(configuration, token.device);

    if (
      patientAccount &&
      !patientAccount.patient &&
      patientAccount.patientProfile
    ) {
      const masterId = getMasterId(patientAccount) ?? '';
      patientAccount.patient = await getPatientByMasterId(
        masterId,
        configuration
      );
    }

    updatePatientAccountLocals(
      response.locals as IAppLocals,
      patientAccount,
      token
    );

    updateRequestWithValidatedDeviceTokenV2(
      cachedToken,
      response,
      configuration
    );
    next();
    return;
  } catch (error) {
    if (
      error instanceof ErrorJsonWebTokenExpired ||
      error instanceof ErrorDeviceTokenInvalid
    ) {
      return unauthorizedErrorResponse(error, response);
    }
    return unexpectedErrorResponse(error as Error, response);
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

export async function updateRequestWithValidatedDeviceTokenV2(
  validatedDevice: IDeviceTokenPayload,
  response: Response,
  configuration: IConfiguration
) {
  const phoneDevice: IPhoneDevice = {
    data: validatedDevice.device.trim(),
    identifier: validatedDevice.deviceIdentifier,
    type: 'phone',
  };

  const locals = response.locals as IAppLocals;
  locals.device = phoneDevice;
  locals.deviceKeyRedis = validatedDevice.deviceKey;

  if (!validatedDevice.patientAccountId && locals.patientAccountId) {
    const { token: updatedDeviceToken } = await generateDeviceTokenV2(
      phoneDevice.data,
      configuration,
      locals.patientAccount
    );
    response.append(RequestHeaders.refreshDeviceToken, updatedDeviceToken);
  }
}

export const isUnAuthenticatedRoute = (route: string): boolean => {
  const exactRoutes = [
    CREATE_ACCOUNT_ROUTE,
    CREATE_ACCOUNT_ROUTE_OBSOLETE,
    SEND_REGISTRATION_TEXT_ROUTE,
    SMART_PRICE_REGISTER_ROUTE,
    VERIFY_MEMBERSHIP_ROUTE,
    WAITLIST_REMOVE_ROUTE,
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

export interface IDevice<T> {
  identifier: string;
  type: 'phone' | 'other';
  data: T;
}

export type IPhoneDevice = IDevice<string>;
