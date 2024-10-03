// Copyright 2018 Prescryptive Health, Inc.

import { timingSafeEqual } from 'crypto';
import { Request, Response } from 'express';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { IAccount } from '@phx/common/src/models/account';
import {
  HttpStatusCodes,
  InternalErrorCode,
  InternalResponseCode,
} from '../constants/error-codes';
import { ErrorConstants } from '../constants/response-messages';
import { LoginMessages as responseMessage } from '../constants/response-messages';
import { searchAccountByPhoneNumber } from '../databases/mongo-database/v1/query-helper/account-collection-helper';
import { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';
import {
  getAccountCreationDataFromRedis,
  getPinDataFromRedis,
} from '../databases/redis/redis-query-helper';
import { IPinKeyValues } from '../utils/redis/redis.helper';
import {
  ErrorFailureResponse,
  KnownFailureResponse,
} from '../utils/response-helper';
import { getPinDetails } from '../utils/patient-account/get-pin-details';
import { IPatientAccount } from '../models/platform/patient-account/patient-account';
import { EndpointVersion } from '../models/endpoint-version';
import { IConfiguration } from '../configuration';
import { getPatientAccountByAccountId } from '../utils/external-api/patient-account/get-patient-account-by-account-id';
import { IAppLocals } from '../models/app-locals';
import { IDeviceTokenPayload } from '../utils/jwt-device-helper';

export const getPinStatus = async (
  database: IDatabase,
  phoneNumber: string,
  version: EndpointVersion = 'v1',
  patientAccount?: IPatientAccount
): Promise<number> => {
  if (version === 'v1') {
    const redisPinDetails: IPinKeyValues | undefined =
      await getPinDataFromRedis(phoneNumber);

    if (redisPinDetails && redisPinDetails.accountKey) {
      return InternalResponseCode.REQUIRE_USER_VERIFY_PIN;
    }
    const account: IAccount | null = await searchAccountByPhoneNumber(
      database,
      phoneNumber
    );

    if (!account || !account.dateOfBirth) {
      const dataInRedis = await getAccountCreationDataFromRedis(phoneNumber);

      if (!dataInRedis) {
        return InternalResponseCode.REQUIRE_USER_REGISTRATION;
      }
      return InternalResponseCode.REQUIRE_USER_SET_PIN;
    }

    if (account.accountKey && account.pinHash) {
      return InternalResponseCode.REQUIRE_USER_VERIFY_PIN;
    }
    return InternalResponseCode.REQUIRE_USER_SET_PIN;
  } else {
    if (!patientAccount) {
      return InternalResponseCode.REQUIRE_USER_REGISTRATION;
    }

    const pinDetails = getPinDetails(patientAccount);
    if (!pinDetails) {
      return InternalResponseCode.REQUIRE_USER_SET_PIN;
    }
    return InternalResponseCode.REQUIRE_USER_VERIFY_PIN;
  }
};

export function showPinFeatureWelcomeScreen(response: Response): Response {
  return KnownFailureResponse(
    response,
    HttpStatusCodes.UNAUTHORIZED_REQUEST,
    ErrorConstants.INVALID_TOKEN,
    undefined,
    InternalResponseCode.REQUIRE_USER_SHOW_PIN_FEATURE_WELCOME_SCREEN
  );
}

export async function tokenMissingResponse(
  response: Response,
  database: IDatabase,
  phoneNumber: string,
  version: EndpointVersion = 'v1'
): Promise<Response> {
  const customResponseCode: number = await getPinStatus(
    database,
    phoneNumber,
    version,
    response.locals.patientAccount
  );
  return KnownFailureResponse(
    response,
    HttpStatusCodes.UNAUTHORIZED_REQUEST,
    ErrorConstants.ACCOUNT_TOKEN_MISSING,
    undefined,
    customResponseCode
  );
}

export function phoneNumberMismatchedResponse(response: Response): Response {
  return KnownFailureResponse(
    response,
    HttpStatusCodes.UNAUTHORIZED_REQUEST,
    responseMessage.PHONE_NUMBER_MISMATCHED,
    undefined,
    InternalErrorCode.UNAUTHORIZED_ACCESS_PHONE_NUMBER_MISMATCHED
  );
}

export function personNotFoundResponse(response: Response): Response {
  return KnownFailureResponse(
    response,
    HttpStatusCodes.UNAUTHORIZED_REQUEST,
    responseMessage.INVALID_MEMBER_RXID
  );
}

export function forbiddenErrorResponse(
  error: Error,
  response: Response,
  recoveryEmailExists = false
): Response {
  return KnownFailureResponse(
    response,
    HttpStatusCodes.FORBIDDEN_ERROR,
    ErrorConstants.ACCOUNT_TOKEN_EXPIRED,
    error,
    InternalResponseCode.REQUIRE_USER_VERIFY_PIN,
    { recoveryEmailExists }
  );
}

export function unauthorizedErrorResponse(
  error: Error,
  response: Response
): Response {
  return ErrorFailureResponse(
    response,
    HttpStatusCodes.UNAUTHORIZED_REQUEST,
    error
  );
}

export function getAccessToken(request: Request): string | undefined {
  const token =
    request.headers[RequestHeaders.accessTokenRequestHeader] ||
    request.headers.authorization;
  if (token && !Array.isArray(token)) {
    return token;
  }
  return;
}

export function keysMatch(key1: string, key2: string): boolean {
  return timingSafeEqual(Buffer.from(key1), Buffer.from(key2));
}

export function unexpectedErrorResponse(
  error: Error,
  response: Response
): Response {
  return ErrorFailureResponse(
    response,
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    error
  );
}

export async function getPatientAccountById(
  response: Response,
  configuration: IConfiguration,
  patientAccountId?: string
) {
  if (patientAccountId) {
    const patientAccount = await getPatientAccountByAccountId(
      configuration,
      patientAccountId,
      true,
      true
    );
    if (patientAccount) {
      response.locals.patient = patientAccount.patient;
    }
    return patientAccount;
  }
  return undefined;
}

export const updatePatientAccountLocals = (
  locals: IAppLocals,
  patientAccount: IPatientAccount | undefined,
  token: IDeviceTokenPayload
): void => {
  locals.patientAccount = patientAccount;
  locals.patient = patientAccount?.patient;
  locals.patientAccountId = token.patientAccountId ?? patientAccount?.accountId;
};
