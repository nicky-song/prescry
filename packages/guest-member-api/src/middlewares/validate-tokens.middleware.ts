// Copyright 2020 Prescryptive Health, Inc.

import { NextFunction, Request, Response } from 'express';
import {
  HttpStatusCodes,
  InternalResponseCode,
} from '@phx/common/src/errors/error-codes';
import { InternalStringResponseCode } from '@phx/common/src/experiences/guest-experience/api/response-codes';
import { ErrorDeviceTokenInvalid } from '@phx/common/src/errors/error-device-token-invalid';
import { ErrorJsonWebTokenExpired } from '@phx/common/src/errors/error-jsonwebtoken-expired';
import { ErrorAccountTokenInvalid } from '@phx/common/src/errors/error-account-token-invalid';
import { IConfiguration } from '../configuration';
import { IDatabase } from '../databases/mongo-database/v1/setup/setup-database';
import { IAccountTokenPayload } from '../models/account-token-payload';
import {
  IDeviceKeyValues,
  IIdentityVerificationKeyValues,
  IPinVerificationKeyValues,
} from '../utils/redis/redis.helper';
import {
  getDeviceDataFromRedis,
  getIdentityVerificationAttemptsDataFromRedis,
  getPinVerificationDataFromRedis,
} from '../databases/redis/redis-query-helper';
import { verifyJsonWebToken } from '../utils/jwt-device-helper';
import { SuccessResponseWithInternalResponseCode } from '../utils/response-helper';
import {
  getDeviceToken,
  decodeCachedToken,
  isTooManyAttempts,
  updateRequestWithValidatedDeviceToken,
  isTooManyIdentityVerificationAttempts,
} from './device-token.middleware';
import {
  accountNotFoundResponse,
  updateRequestWithValidatedToken,
} from './account-token.middleware';
import {
  getAccessToken,
  getPinStatus,
  keysMatch,
  unexpectedErrorResponse,
  getPatientAccountById,
  updatePatientAccountLocals,
} from './middleware.helper';
import { getEndpointVersion } from '../utils/request/get-endpoint-version';

import { searchAccountByPhoneNumber } from '../databases/mongo-database/v1/query-helper/account-collection-helper';
import { IPerson } from '@phx/common/src/models/person';
import { getAllRecordsForLoggedInPerson } from '../utils/person/get-logged-in-person.helper';
import { verifyAccountToken } from '../utils/account-token.helper';
import { getRequiredResponseLocal } from '../utils/request/request-app-locals.helper';
import { getAllAllowedFamilyMembersForFamily } from '../utils/person/get-dependent-person.helper';
import { getMasterIdsFromPersonList } from '../utils/person/person-helper';
import { getPreferredEmailFromPatient } from '../utils/fhir-patient/get-contact-info-from-patient';
import { updateRequestWithValidatedDeviceTokenV2 } from './device-token.middleware.v2';
import { getPatientAccountByPhoneNumber } from '../utils/patient-account/get-patient-account-by-phone-number';
import { IAppLocals } from '../models/app-locals';
import { getAllPatientRecordsForLoggedInPerson } from '../utils/fhir-patient/get-logged-in-patient.helper';
import {
  getMasterIdsFromDependentPatientList,
  getMasterIdsFromPrimaryPatientList,
} from '../utils/fhir-patient/get-master-ids-from-patient-list';
import { getAllFamilyMembersOfLoggedInUser } from '../utils/fhir-patient/get-dependent-patient.helper';
import { getMasterId } from '../utils/patient-account/patient-account.helper';
import { getPatientByMasterId } from '../utils/external-api/identity/get-patient-by-master-id';

export const validateTokensMiddleware =
  (
    configuration: IConfiguration,
    database: IDatabase
  ) =>
  async (request: Request, response: Response, next: NextFunction) =>
    await middleware(configuration, database, request, response, next);

async function middleware(
  configuration: IConfiguration,
  database: IDatabase,
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | undefined> {
  const deviceTokenVerificationResponse = await verifyDeviceToken(
    configuration,
    request,
    response,
    database
  );
  if (deviceTokenVerificationResponse) {
    return deviceTokenVerificationResponse;
  }
  const accountTokenVerificationResponse = await verifyAccountTokenFromRequest(
    configuration,
    database,
    request,
    response
  );
  if (accountTokenVerificationResponse) {
    return accountTokenVerificationResponse;
  }

  next();
  return undefined;
}

async function verifyDeviceToken(
  configuration: IConfiguration,
  request: Request,
  response: Response,
  database: IDatabase
): Promise<Response | undefined> {
  const version = getEndpointVersion(request);
  const rawToken = getDeviceToken(request);
  if (!rawToken) {
    return createResponseWithInternalResponseCode(
      response,
      'DEVICE_TOKEN_MISSING'
    );
  }

  try {
    const token = verifyJsonWebToken(rawToken, configuration.jwtTokenSecretKey);

    const cached: IDeviceKeyValues | undefined = await getDeviceDataFromRedis(
      token.device,
      token.deviceIdentifier
    );

    const cachedToken = decodeCachedToken(cached);
    if (!cached || !cachedToken) {
      return createResponseWithInternalResponseCode(
        response,
        'INVALID_DEVICE_TOKEN'
      );
    }

    if (!keysMatch(token.deviceKey, cachedToken.deviceKey)) {
      return createResponseWithInternalResponseCode(
        response,
        'INVALID_PIN_KEY'
      );
    }
    const isResetPinFlow = request.originalUrl.indexOf('/pin-reset/') !== -1;

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
    let account, email;
    if (version === 'v2') {
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

      const locals = response.locals as IAppLocals;
      updatePatientAccountLocals(locals, patientAccount, token);
      email = getPreferredEmailFromPatient(locals.patient);
    } else {
      account = await searchAccountByPhoneNumber(database, token.device);
    }

    const recoveryEmailExists = email
      ? true
      : account && account.recoveryEmail && account?.recoveryEmail?.length > 0
      ? true
      : false;

    if (isMaxPinAttemptsReached && isMaxIdentityVerificationReached) {
      return createResponseWithInternalResponseCode(
        response,
        'SHOW_ACCOUNT_LOCKED',
        undefined,
        recoveryEmailExists
      );
    }

    if (isMaxPinAttemptsReached && !isResetPinFlow) {
      return createResponseWithInternalResponseCode(
        response,
        'SHOW_FORGET_PIN',
        undefined,
        recoveryEmailExists
      );
    }

    if (isMaxIdentityVerificationReached) {
      return createResponseWithInternalResponseCode(
        response,
        'SHOW_ACCOUNT_LOCKED',
        undefined,
        recoveryEmailExists
      );
    }
    if (version === 'v2') {
      updateRequestWithValidatedDeviceTokenV2(
        cachedToken,
        response,
        configuration
      );
    } else {
      updateRequestWithValidatedDeviceToken(cachedToken, response);
    }
    return;
  } catch (error) {
    if (
      error instanceof ErrorJsonWebTokenExpired ||
      error instanceof ErrorDeviceTokenInvalid
    ) {
      return createResponseWithInternalResponseCode(
        response,
        'INVALID_DEVICE_TOKEN',
        error.message
      );
    }
    throw error;
  }
}

async function verifyAccountTokenFromRequest(
  configuration: IConfiguration,
  database: IDatabase,
  request: Request,
  response: Response,
): Promise<Response | undefined> {
  const version = getEndpointVersion(request);
  const responseLocals = response.locals as IAppLocals;

  try {
    const deviceTokenPhoneNumber = getRequiredResponseLocal(
      response,
      'device'
    ).data;

    const rawToken = getAccessToken(request);
    const customResponseCode: number = await getPinStatus(
      database,
      deviceTokenPhoneNumber,
      version,
      responseLocals.patientAccount
    );

    const account = await searchAccountByPhoneNumber(
      database,
      deviceTokenPhoneNumber,
      'retryIfNotFound'
    );
    const recoveryEmail =
      version === 'v2'
        ? getPreferredEmailFromPatient(responseLocals.patient)
        : account?.recoveryEmail;

    const customResponseCodeString: InternalStringResponseCode =
      getStringResponseCodeFromResponseCode(customResponseCode);
    if (!rawToken) {
      return createResponseWithInternalResponseCode(
        response,
        customResponseCodeString,
        undefined,
        !!recoveryEmail
      );
    }
    try {
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

      responseLocals.accountIdentifier = account._id;
      responseLocals.account = account;
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
        responseLocals.masterIds = getMasterIdsFromPersonList(
          responseLocals.personList
        );
      }

      if (version === 'v2') {
        const patient = getRequiredResponseLocal(response, 'patient');
        const allPatientRecordsList =
          await getAllPatientRecordsForLoggedInPerson(patient, configuration);
        responseLocals.patientProfiles = allPatientRecordsList;
        responseLocals.masterIds = getMasterIdsFromPrimaryPatientList(
          allPatientRecordsList
        );
        responseLocals.patientDependents =
          await getAllFamilyMembersOfLoggedInUser(
            configuration,
            allPatientRecordsList
          );
        responseLocals.dependentMasterIds =
          getMasterIdsFromDependentPatientList(
            responseLocals.patientDependents
          );
      }

      updateRequestWithValidatedToken(token, configuration, response);
      return;
    } catch (tokenError) {
      if (
        tokenError instanceof ErrorJsonWebTokenExpired ||
        tokenError instanceof ErrorAccountTokenInvalid
      ) {
        return createResponseWithInternalResponseCode(
          response,
          customResponseCodeString,
          tokenError.message,
          !!recoveryEmail
        );
      }
      throw tokenError;
    }
  } catch (error) {
    return unexpectedErrorResponse(error as Error, response);
  }
}

function phoneNumberMismatchedResponse(response: Response): Response {
  return createResponseWithInternalResponseCode(
    response,
    'PHONE_NUMBER_MISMATCHED'
  );
}
function createResponseWithInternalResponseCode(
  response: Response,
  internalResponseCode: InternalStringResponseCode,
  message?: string,
  recoveryEmailExists = false
): Response {
  SuccessResponseWithInternalResponseCode(
    response,
    message || internalResponseCode.toString(),
    { recoveryEmailExists },
    HttpStatusCodes.SUCCESS,
    internalResponseCode
  );
  return response;
}

function getStringResponseCodeFromResponseCode(
  internalCode: number
): InternalStringResponseCode {
  switch (internalCode) {
    case InternalResponseCode.REQUIRE_USER_REGISTRATION:
      return 'REQUIRE_USER_REGISTRATION';
    case InternalResponseCode.REQUIRE_USER_SET_PIN:
      return 'REQUIRE_USER_SET_PIN';
    case InternalResponseCode.REQUIRE_USER_VERIFY_PIN:
      return 'REQUIRE_USER_VERIFY_PIN';
  }
  return 'REQUIRE_USER_VERIFY_PIN';
}
