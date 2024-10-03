// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { Twilio } from 'twilio';
import { ISendVerificationCodeRequestBody } from '@phx/common/src/models/api-request-body/send-verification-code.request-body';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IConfiguration } from '../../../configuration';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  errorResponseWithTwilioErrorHandling,
  KnownFailureResponse,
  SuccessResponse,
} from '../../../utils/response-helper';
import {
  sendOneTimeCodeToEmail,
  sendOneTimePassword,
} from '../../../utils/twilio-helper';
import RestException from 'twilio/lib/base/RestException';
import { IAppLocals } from '../../../models/app-locals';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';
import { assertHasAccountId } from '../../../assertions/assert-has-account-id';
import { isPhoneNumberInReferences } from '../../../utils/patient-account/patient-account.helper';
import { sendOneTimePasswordV2 } from '../../../utils/one-time-password/send-one-time-password-v2';
import { ContactType } from '../../../utils/external-api/patient-account/authorize-contact';
import { getPreferredEmailFromPatient } from '../../../utils/fhir-patient/get-contact-info-from-patient';
import { assertHasPatient } from '../../../assertions/assert-has-patient';
import { assertIsTruthy } from '@phx/common/src/assertions/assert-is-truthy';
import { BadRequestError } from '../../../errors/request-errors/bad.request-error';
import { RequestError } from '../../../errors/request-errors/request.error';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function sendVerificationCodeHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration,
  twilioClient: Twilio
) {
  const version = getEndpointVersion(request);
  const phoneNumber = getRequiredResponseLocal(response, 'device').data;

  try {
    const { verificationType } =
      request.body as ISendVerificationCodeRequestBody;

    if (version === 'v2') {
      const locals = response.locals as IAppLocals;

      const { patientAccount } = locals;
      assertHasPatientAccount(patientAccount);

      const { accountId } = patientAccount;
      assertHasAccountId(accountId);

      if (!isPhoneNumberInReferences(patientAccount.reference, phoneNumber)) {
        throw new BadRequestError(ErrorConstants.PHONE_NUMBER_MISSING);
      }

      const contactType: ContactType =
        verificationType === 'EMAIL' ? 'email' : 'phone';
      const contactValue = (): string => {
        if (verificationType === 'EMAIL') {
          assertHasPatient(patientAccount.patient);

          const preferredEmail = getPreferredEmailFromPatient(
            patientAccount?.patient
          );
          assertIsTruthy(preferredEmail);

          return preferredEmail;
        }

        return phoneNumber;
      };

      await sendOneTimePasswordV2(configuration, contactValue(), contactType);
    } else {
      const account = await searchAccountByPhoneNumber(database, phoneNumber);

      if (!account) {
        throw new BadRequestError(ErrorConstants.PHONE_NUMBER_MISSING);
      }

      if (!account.recoveryEmail) {
        throw new BadRequestError(ErrorConstants.RECOVERY_EMAIL_MISSING);
      }

      if (verificationType === 'EMAIL')
        await sendOneTimeCodeToEmail(
          twilioClient,
          configuration.twilioEmailVerificationServiceId,
          account.recoveryEmail
        );
      else {
        await sendOneTimePassword(
          twilioClient,
          configuration.twilioVerificationServiceId,
          phoneNumber
        );
      }
    }

    return SuccessResponse(response, SuccessConstants.SEND_SUCCESS_MESSAGE);
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

    return errorResponseWithTwilioErrorHandling(
      response,
      phoneNumber,
      error as RestException
    );
  }
}
