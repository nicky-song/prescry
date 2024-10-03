// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  KnownFailureResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import {
  HttpStatusCodes,
  InternalErrorCode,
} from '@phx/common/src/errors/error-codes';
import { ErrorConstants } from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { IVerifyIdentityRequestBody } from '@phx/common/src/models/api-request-body/verify-identity.request-body';
import { IConfiguration } from '../../../configuration';
import { invalidIdentityVerificationResponse } from '../helpers/invalid-identity-verification-response.helper';
import { UTCDateString } from '@phx/common/src/utils/date-time-helper';
import { verifyIdentitySuccessResponse } from '../helpers/verify-identity-success-response.helper';
import { getIdentityVerificationAttemptsDataFromRedis } from '../../../databases/redis/redis-query-helper';
import { IAppLocals } from '../../../models/app-locals';
import { RequestError } from '../../../errors/request-errors/request.error';
import { arePatientIdentityDetailsValid } from '../../../utils/fhir-patient/patient.helper';
import { isPhoneNumberInReferences } from '../../../utils/patient-account/patient-account.helper';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';
import { assertHasPatient } from '../../../assertions/assert-has-patient';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function verifyIdentityHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  const version = getEndpointVersion(request);
  const { data: accountPhoneNumber } = getRequiredResponseLocal(
    response,
    'device'
  );
  const identityVerificationDataInRedis =
    await getIdentityVerificationAttemptsDataFromRedis(accountPhoneNumber);
  if (
    identityVerificationDataInRedis &&
    identityVerificationDataInRedis.identityVerificationAttempt ===
      configuration.maxIdentityVerificationAttempts
  ) {
    return KnownFailureResponse(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.IDENTITY_VERIFICATION_LOCKED,
      undefined,
      InternalErrorCode.SHOW_ACCOUNT_LOCKED,
      {
        reachedMaxVerificationAttempts: true,
      }
    );
  }

  try {
    const { phoneNumber, emailAddress, dateOfBirth } =
      request.body as IVerifyIdentityRequestBody;

    if (version === 'v2') {
      const locals = response.locals as IAppLocals;
      const { patient, patientAccount } = locals;

      assertHasPatient(patient);
      assertHasPatientAccount(patientAccount);

      if (
        !arePatientIdentityDetailsValid(
          patient,
          phoneNumber,
          emailAddress,
          dateOfBirth
        ) ||
        !isPhoneNumberInReferences(patientAccount.reference, phoneNumber)
      ) {
        return invalidIdentityVerificationResponse(
          response,
          accountPhoneNumber,
          configuration,
          identityVerificationDataInRedis
        );
      }
    } else {
      const account = await searchAccountByPhoneNumber(database, phoneNumber);

      const accountDateOfBirth = account?.dateOfBirth
        ? UTCDateString(account.dateOfBirth)
        : '';
      if (
        !account ||
        !account.recoveryEmail ||
        accountDateOfBirth !== dateOfBirth ||
        account.recoveryEmail.toLowerCase() !== emailAddress.toLowerCase() ||
        accountPhoneNumber !== phoneNumber
      ) {
        return invalidIdentityVerificationResponse(
          response,
          accountPhoneNumber,
          configuration,
          identityVerificationDataInRedis
        );
      }
    }

    return await verifyIdentitySuccessResponse(
      response,
      phoneNumber,
      emailAddress,
      configuration
    );
  } catch (error) {
    if (error instanceof RequestError) {
      return KnownFailureResponse(
        response,
        error.httpCode,
        error.message,
        undefined,
        error.internalCode
      );
    }

    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
