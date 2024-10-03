// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { Twilio } from 'twilio';
import { InternalResponseCode } from '@phx/common/src/errors/error-codes';
import { IResetPinRequestBody } from '@phx/common/src/models/api-request-body/reset-pin.request-body';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IConfiguration } from '../../../configuration';
import { IResetPinResponseData } from '@phx/common/src/models/api-response/reset-pin.response';
import {
  ErrorConstants,
  SuccessConstants,
  TwilioErrorMessage,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { searchAccountByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/account-collection-helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
  validatePhoneNumberErrorType,
} from '../../../utils/response-helper';
import { deleteKeysInRedis } from '../../../utils/redis/redis.helper';
import { publishAccountUpdateMessage } from '../../../utils/service-bus/account-update-helper';
import { createDeviceToken } from '../../../utils/verify-device-helper';
import { maskEmail, maskPhoneNumber } from '../helpers/mask-values.helper';
import { resetPinFailureResponse } from '../helpers/reset-pin-failure-response.helper';
import RestException from 'twilio/lib/base/RestException';
import { IAppLocals } from '../../../models/app-locals';
import { validateOneTimePassword } from '../../../utils/request/validate-one-time-password';
import { validateOneTimePasswordV2 } from '../../../utils/request/validate-one-time-password.v2';
import { clearPatientAccountPin } from '../../../utils/patient-account/clear-patient-account-pin';
import { RequestError } from '../../../errors/request-errors/request.error';
import { InternalServerRequestError } from '../../../errors/request-errors/internal-server.request-error';
import { BadRequestError } from '../../../errors/request-errors/bad.request-error';
import { getPreferredEmailFromPatient } from '../../../utils/fhir-patient/get-contact-info-from-patient';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function pinResetHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration,
  twilioClient: Twilio
) {
  const version = getEndpointVersion(request);
  const isV2Endpoint = version === 'v2';
  const phoneNumber = getRequiredResponseLocal(response, 'device').data;

  const locals = response.locals as IAppLocals;
  const { patientAccount } = locals;

  try {
    const { verificationType, code, maskedValue } =
      request.body as IResetPinRequestBody;

    let recoveryEmail: string | undefined;

    if (isV2Endpoint) {
      recoveryEmail = getPreferredEmailFromPatient(patientAccount?.patient);

      if (!recoveryEmail) {
        throw new InternalServerRequestError(
          ErrorConstants.RECOVERY_EMAIL_MISSING
        );
      }
    } else {
      const account = await searchAccountByPhoneNumber(database, phoneNumber);
      if (!account) {
        throw new BadRequestError(ErrorConstants.PHONE_NUMBER_MISSING);
      }

      recoveryEmail = account.recoveryEmail;
      if (!recoveryEmail) {
        throw new BadRequestError(ErrorConstants.RECOVERY_EMAIL_MISSING);
      }
    }

    const maskedValueInDB: string =
      verificationType === 'EMAIL'
        ? maskEmail(recoveryEmail)
        : maskPhoneNumber(phoneNumber);
    if (maskedValue.toUpperCase() !== maskedValueInDB.toUpperCase()) {
      return await resetPinFailureResponse(
        response,
        phoneNumber,
        configuration
      );
    }

    try {
      const contactValue =
        verificationType === 'EMAIL' ? recoveryEmail : phoneNumber;

      if (isV2Endpoint) {
        await validateOneTimePasswordV2(configuration, contactValue, code);
      } else {
        const verificationServiceId =
          verificationType === 'EMAIL'
            ? configuration.twilioEmailVerificationServiceId
            : configuration.twilioVerificationServiceId;
        await validateOneTimePassword(
          twilioClient,
          verificationServiceId,
          contactValue,
          code
        );
      }
    } catch (error) {
      if (error instanceof RequestError) {
        return await resetPinFailureResponse(
          response,
          phoneNumber,
          configuration
        );
      }

      throw error;
    }

    if (isV2Endpoint) {
      assertHasPatientAccount(patientAccount);
      await clearPatientAccountPin(configuration, patientAccount);
    }

    await deleteKeysInRedis(`*:${phoneNumber}*`);
    await publishAccountUpdateMessage({
      accountKey: '',
      pinHash: '',
      phoneNumber,
      recentlyUpdated: true,
    });
    const token: string = await createDeviceToken(phoneNumber, configuration);

    return SuccessResponse<IResetPinResponseData>(
      response,
      SuccessConstants.CREATE_WITH_PIN,
      { deviceToken: token },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
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

    const errorObj = error as RestException;
    const errorValidator = validatePhoneNumberErrorType(
      errorObj.status,
      errorObj.code,
      phoneNumber
    );
    if (errorValidator.isKnownError) {
      if (errorValidator.message === TwilioErrorMessage.TOO_MANY_TIMES) {
        return await resetPinFailureResponse(
          response,
          phoneNumber,
          configuration
        );
      }

      return KnownFailureResponse(
        response,
        errorObj.status,
        errorValidator.message,
        errorObj,
        errorObj.code
      );
    } else {
      return UnknownFailureResponse(
        response,
        ErrorConstants.INTERNAL_SERVER_ERROR,
        errorObj
      );
    }
  }
}
