// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import { IConfiguration } from '../../../configuration';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  IRemoveWaitlistRequestBody,
  IWaitlistRemoveOperationResult,
} from '../../../models/twilio-web-hook/remove-waitlist-request.body';
import { logTelemetryException } from '../../../utils/app-insight-helper';
import { GuestApiError } from '../../../utils/custom-error-helper';
import {
  trackWaitlistRemoveFailureEvent,
  trackWaitlistSuccessEvent,
} from '../../../utils/waitlist-custom-event.helper';
import { updateWaitlistStatus } from '../helpers/update-waitlist-status.helper';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';
import { getContentLanguage } from '@phx/common/src/utils/translation/get-content-language.helper';
import { Language } from '@phx/common/src/models/language';
import { WaitlistFieldKeysEnum } from '../../../content/waitlist.content';
import { retrieveWaitlistTextMessage } from '../helpers/retrieve-waitlist-text-message.helper';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function removeWaitlistHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  try {
    const version = getEndpointVersion(request);
    const {
      To,
      AccountSid,
      Body,
      From,
      FromCity,
      FromCountry,
      FromState,
      FromZip,
      MessageSid,
    } = request.body as IRemoveWaitlistRequestBody;

    let language: Language;
    if (version === 'v2') {
      const patientAccount = getRequiredResponseLocal(
        response,
        'patientAccount'
      );
      assertHasPatientAccount(patientAccount);
      language = getContentLanguage(
        patientAccount.userPreferences?.language || ''
      );
    } else {
      const account = getRequiredResponseLocal(response, 'account');
      language = getContentLanguage(account.languageCode || '');
    }

    if (Body.toUpperCase().trim() !== 'REMOVE') {
      return removeResponse(response);
    }
    if (
      AccountSid !== configuration.twilioAccountSid ||
      To !== configuration.twilioMessagingFromPhoneNumber
    ) {
      trackWaitlistRemoveFailureEvent(
        'InvalidAccountSidOrPhone',
        MessageSid,
        From,
        FromCity,
        FromState,
        FromZip,
        FromCountry,
        ''
      );
      return removeResponse(response);
    }

    // commenting the code temporarily
    //  const twilioSignature = request.headers['x-twilio-signature'];

    // if (
    //   twilioSignature === undefined ||
    //   !Twilio.validateRequest(
    //     configuration.twilioAuthToken,
    //     twilioSignature.toString(),
    //     configuration.twilioRemoveWaitlistUrl,
    //     request.body
    //   )
    // ) {
    //   trackWaitlistRemoveFailureEvent(
    //     'InvalidTwilioSignature',
    //     MessageSid,
    //     From,
    //     FromCity,
    //     FromState,
    //     FromZip,
    //     FromCountry,
    //     ''
    //   );
    //   return removeResponse(response);
    // }

    const statusResult: IWaitlistRemoveOperationResult =
      await updateWaitlistStatus(From, database, configuration);

    const {
      success,
      firstName,
      lastName,
      serviceName,
      identifier,
      failureType,
      error,
    } = statusResult;

    if (success) {
      trackWaitlistSuccessEvent(
        MessageSid,
        From,
        FromCity,
        FromState,
        FromZip,
        FromCountry,
        identifier
      );
      const parameterMap = new Map<string, string>([
        ['first-name', firstName ?? ''],
        ['last-name', lastName ?? ''],
        ['service-name', serviceName ?? ''],
      ]);
      const textMessage = StringFormatter.format(
        retrieveWaitlistTextMessage(
          WaitlistFieldKeysEnum.waitlistRemoveSuccessText,
          language
        ),
        parameterMap
      );
      return removeResponseWithTextMessage(response, textMessage);
    }
    if (failureType)
      trackWaitlistRemoveFailureEvent(
        failureType,
        MessageSid,
        From,
        FromCity,
        FromState,
        FromZip,
        FromCountry,
        identifier,
        error
      );
    if (
      failureType === 'WaitlistFulfilled' ||
      failureType === 'WaitlistError'
    ) {
      const parameterMap = new Map<string, string>([
        ['first-name', firstName ?? ''],
        ['last-name', lastName ?? ''],
      ]);
      const textMessage = StringFormatter.format(
        retrieveWaitlistTextMessage(
          WaitlistFieldKeysEnum.waitlistRemoveFailureText,
          language
        ),
        parameterMap
      );
      return removeResponseWithTextMessage(response, textMessage);
    }
    return removeResponse(response);
  } catch (error) {
    const errorObj = error as Error;
    logTelemetryException({
      exception: new GuestApiError(errorObj.message, errorObj),
    });
    return removeResponse(response);
  }
}

function removeResponseWithTextMessage(
  response: Response,
  textMessage: string
): Response {
  return response
    .status(HttpStatusCodes.SUCCESS)
    .type('application/xml')
    .send(`<Response><Message>${textMessage}</Message></Response>`);
}

function removeResponse(response: Response): Response {
  return response
    .status(HttpStatusCodes.SUCCESS)
    .type('application/xml')
    .send('<Response></Response>');
}
