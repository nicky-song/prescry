// Copyright 2020 Prescryptive Health, Inc.

import { NextFunction, Request, Response } from 'express';
import { ErrorAccountTokenInvalid } from '@phx/common/src/errors/error-account-token-invalid';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { IConfiguration } from '../configuration';

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
import {
  ADD_ACCOUNT_ROUTE,
  CREATE_ACCOUNT_ROUTE,
  CREATE_ACCOUNT_ROUTE_OBSOLETE,
  LOGIN_ROUTE,
  SEND_REGISTRATION_TEXT_ROUTE,
  VERIFY_MEMBERSHIP_ROUTE,
  VERIFY_PIN_ROUTE,
  VERIFY_SSO_JWT_TOKEN_ROUTE,
  WAITLIST_REMOVE_ROUTE,
} from '../constants/routes';
import { IPatientAccount } from '../models/platform/patient-account/patient-account';
import { getPreferredEmailFromPatient } from '../utils/fhir-patient/get-contact-info-from-patient';
import { searchAccountByPhoneNumber } from '../databases/mongo-database/v1/query-helper/account-collection-helper';
import { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';
import { getAllPatientRecordsForLoggedInPerson } from '../utils/fhir-patient/get-logged-in-patient.helper';
import { ErrorRequestInitialization } from '@phx/common/src/errors/error-request-initialization';
import {
  getMasterIdsFromDependentPatientList,
  getMasterIdsFromPrimaryPatientList,
} from '../utils/fhir-patient/get-master-ids-from-patient-list';
import { getAllFamilyMembersOfLoggedInUser } from '../utils/fhir-patient/get-dependent-patient.helper';
import { IAppLocals } from '../models/app-locals';

export const validateAccountTokenMiddlewareV2 =
  (configuration: IConfiguration, database: IDatabase) =>
  (request: Request, response: Response, next: NextFunction) =>
    middleware(configuration, database, request, response, next);

async function middleware(
  configuration: IConfiguration,
  database: IDatabase,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const responseLocals = response.locals as IAppLocals;

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
      return tokenMissingResponse(
        response,
        database,
        deviceTokenPhoneNumber,
        'v2'
      );
    }
    const patientAccount: IPatientAccount = getRequiredResponseLocal(
      response,
      'patientAccount'
    );
    const patient = getRequiredResponseLocal(response, 'patient');
    const account = await searchAccountByPhoneNumber(
      database,
      deviceTokenPhoneNumber
    );

    const patientEmail = getPreferredEmailFromPatient(patient);
    const email =
      patientEmail ??
      (account && account.recoveryEmail && account?.recoveryEmail?.length > 0
        ? account.recoveryEmail
        : undefined);
    recoveryEmailExists = email ? true : false;

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

    responseLocals.accountIdentifier = patientAccount?.accountId;
    responseLocals.account = account ?? undefined;
    const personList: IPerson[] = await getAllRecordsForLoggedInPerson(
      database,
      deviceTokenPhoneNumber
    );

    if (personList && personList.length > 0) {
      responseLocals.personList = personList;
      responseLocals.dependents = await getAllAllowedFamilyMembersForFamily(
        database,
        personList,
        deviceTokenPhoneNumber,
        configuration.childMemberAgeLimit
      );
    }
    const allPatientRecordsList = await getAllPatientRecordsForLoggedInPerson(
      patient,
      configuration
    );
    responseLocals.patientProfiles = allPatientRecordsList;
    responseLocals.masterIds = getMasterIdsFromPrimaryPatientList(
      allPatientRecordsList
    );
    responseLocals.patientDependents = await getAllFamilyMembersOfLoggedInUser(
      configuration,
      allPatientRecordsList
    );
    responseLocals.dependentMasterIds = getMasterIdsFromDependentPatientList(
      responseLocals.patientDependents
    );
    updateRequestWithValidatedToken(token, configuration, response);
    next();
  } catch (error) {
    if (error instanceof ErrorJsonWebTokenExpired) {
      return forbiddenErrorResponse(error, response, recoveryEmailExists);
    }
    if (error instanceof ErrorAccountTokenInvalid) {
      return unauthorizedErrorResponse(error, response);
    }
    if (error instanceof ErrorRequestInitialization) {
      return accountNotFoundResponse(response);
    }
    return unexpectedErrorResponse(error as Error, response);
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
