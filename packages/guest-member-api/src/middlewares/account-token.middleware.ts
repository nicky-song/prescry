// Copyright 2020 Prescryptive Health, Inc.

import { NextFunction, Request, Response } from 'express';
import { ErrorAccountTokenInvalid } from '@phx/common/src/errors/error-account-token-invalid';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { IConfiguration } from '../configuration';
import { searchAccountByPhoneNumber } from '../databases/mongo-database/v1/query-helper/account-collection-helper';
import { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';

import {
  generateAccountToken,
  verifyAccountToken,
} from '../utils/account-token.helper';
import { IAccountTokenPayload } from '../models/account-token-payload';
import {
  getAccessToken,
  tokenMissingResponse,
  keysMatch,
  phoneNumberMismatchedResponse,
  forbiddenErrorResponse,
  unauthorizedErrorResponse,
  unexpectedErrorResponse,
} from './middleware.helper';
import { getAllRecordsForLoggedInPerson } from '../utils/person/get-logged-in-person.helper';
import { IPerson } from '@phx/common/src/models/person';
import { KnownFailureResponse } from '../utils/response-helper';
import { HttpStatusCodes } from '../constants/error-codes';
import { ErrorConstants } from '../constants/response-messages';
import { getRequiredResponseLocal } from '../utils/request/request-app-locals.helper';
import { getAllAllowedFamilyMembersForFamily } from '../utils/person/get-dependent-person.helper';
import { getMasterIdsFromPersonList } from '../utils/person/person-helper';
import {
  ADD_ACCOUNT_ROUTE,
  CREATE_ACCOUNT_ROUTE,
  CREATE_ACCOUNT_ROUTE_OBSOLETE,
  LOGIN_ROUTE,
  SEND_REGISTRATION_TEXT_ROUTE,
  VERIFY_MEMBERSHIP_ROUTE,
  VERIFY_PATIENT_INFO_ROUTE,
  VERIFY_PIN_ROUTE,
  VERIFY_SSO_JWT_TOKEN_ROUTE,
  WAITLIST_REMOVE_ROUTE,
} from '../constants/routes';
import { validateAccountTokenMiddlewareV2 } from './account-token.middleware-v2';
import { getEndpointVersion } from '../utils/request/get-endpoint-version';

export const validateAccountTokenMiddleware =
  (configuration: IConfiguration, database: IDatabase) =>
  (request: Request, response: Response, next: NextFunction) =>
    getEndpointVersion(request) === 'v2'
      ? validateAccountTokenMiddlewareV2(configuration, database)(
          request,
          response,
          next
        )
      : middleware(configuration, database, request, response, next);

async function middleware(
  configuration: IConfiguration,
  database: IDatabase,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (!isAccountTokenRequiredRoute(request.originalUrl)) {
    return next();
  }
  let recoveryEmailExists = false;
  try {
    const deviceTokenPhoneNumber = getRequiredResponseLocal(
      response,
      'device'
    ).data;

    const rawToken = getAccessToken(request);
    if (!rawToken) {
      return tokenMissingResponse(response, database, deviceTokenPhoneNumber);
    }

    const account = await searchAccountByPhoneNumber(
      database,
      deviceTokenPhoneNumber
    );
    recoveryEmailExists =
      account && account.recoveryEmail && account?.recoveryEmail?.length > 0
        ? true
        : false;
    const token: IAccountTokenPayload = verifyAccountToken(
      rawToken,
      configuration.jwtTokenSecretKey
    );

    try {
      if (!keysMatch(deviceTokenPhoneNumber, token.phoneNumber)) {
        return phoneNumberMismatchedResponse(response);
      }
    } catch (byteLengthError) {
      return phoneNumberMismatchedResponse(response);
    }

    if (!account) {
      return accountNotFoundResponse(response);
    }

    response.locals.accountIdentifier = account._id;
    response.locals.account = account;
    const personList: IPerson[] = await getAllRecordsForLoggedInPerson(
      database,
      deviceTokenPhoneNumber
    );

    if (personList && personList.length > 0) {
      response.locals.personList = personList;
      response.locals.dependents = await getAllAllowedFamilyMembersForFamily(
        database,
        personList,
        deviceTokenPhoneNumber,
        configuration.childMemberAgeLimit
      );
      response.locals.masterIds = getMasterIdsFromPersonList(
        response.locals.personList
      );
    }

    updateRequestWithValidatedToken(token, configuration, response);
    next();
  } catch (error) {
    const errorObj = error as Error;
    if (error instanceof ErrorJsonWebTokenExpired) {
      return forbiddenErrorResponse(errorObj, response, recoveryEmailExists);
    }
    if (error instanceof ErrorAccountTokenInvalid) {
      return unauthorizedErrorResponse(errorObj, response);
    }
    return unexpectedErrorResponse(errorObj, response);
  }
}

export const isAccountTokenRequiredRoute = (route: string) => {
  const exactRoutes = [
    ADD_ACCOUNT_ROUTE,
    VERIFY_PIN_ROUTE,
    LOGIN_ROUTE,
    SEND_REGISTRATION_TEXT_ROUTE,
    WAITLIST_REMOVE_ROUTE,
    CREATE_ACCOUNT_ROUTE,
    CREATE_ACCOUNT_ROUTE_OBSOLETE,
    VERIFY_MEMBERSHIP_ROUTE,
    VERIFY_SSO_JWT_TOKEN_ROUTE,
    VERIFY_PATIENT_INFO_ROUTE,
  ];

  for (const r of exactRoutes) {
    if (`/api${r}` === route) {
      return false;
    }
  }
  const startWithRoutes = [
    'one-time-password',
    'health/',
    'pin-reset/',
    'smart-price/',
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
      return false;
    }
  }
  return true;
};

export function updateRequestWithValidatedToken(
  token: IAccountTokenPayload,
  configuration: IConfiguration,
  response: Response
) {
  const refreshToken = generateAccountToken(
    token,
    configuration.jwtTokenSecretKey,
    configuration.accountTokenExpiryTime
  );

  response.locals.verifiedPayload = token;

  response.append(RequestHeaders.refreshAccountToken, refreshToken);
}

export function accountNotFoundResponse(response: Response): Response {
  return KnownFailureResponse(
    response,
    HttpStatusCodes.UNAUTHORIZED_REQUEST,
    ErrorConstants.PHONE_NUMBER_MISSING
  );
}
