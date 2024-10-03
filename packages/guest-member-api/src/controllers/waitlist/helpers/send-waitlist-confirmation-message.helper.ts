// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { StringFormatter } from '@phx/common/src/utils/formatters/string.formatter';
import { Twilio } from 'twilio';
import { IConfiguration } from '../../../configuration';
import { EndpointVersion } from '../../../models/endpoint-version';
import { ICreateWaitListRequest } from '../../../models/pharmacy-portal/create-waitlist.request';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';
import { getContentLanguage } from '@phx/common/src/utils/translation/get-content-language.helper';
import { retrieveWaitlistTextMessage } from './retrieve-waitlist-text-message.helper';
import { WaitlistFieldKeysEnum } from '../../../content/waitlist.content';
import { Language } from '@phx/common/src/models/language';

export async function sendWaitlistConfirmationMessage(
  configuration: IConfiguration,
  twilioClient: Twilio,
  waitlist: ICreateWaitListRequest,
  serviceName: string,
  response: Response,
  version: EndpointVersion,
  addedByFirstName?: string,
  addedByLastName?: string
) {
  let language: Language;
  if (version === 'v2') {
    const patientAccount = getRequiredResponseLocal(response, 'patientAccount');
    assertHasPatientAccount(patientAccount);
    language = getContentLanguage(
      patientAccount.userPreferences?.language || ''
    );
  } else {
    const account = getRequiredResponseLocal(response, 'account');
    language = getContentLanguage(account.languageCode || '');
  }

  const parameterMap = new Map<string, string>([
    ['first-name', waitlist.firstName ?? ''],
    ['last-name', waitlist.lastName ?? ''],
    ['service-name', serviceName],
    ['added-by-first-name', addedByFirstName ?? ''],
    ['added-by-last-name', addedByLastName ?? ''],
  ]);
  const textMessage = StringFormatter.format(
    waitlist.addedBy === waitlist.phoneNumber
      ? retrieveWaitlistTextMessage(
          WaitlistFieldKeysEnum.waitlistAddedSamePhoneText,
          language
        )
      : retrieveWaitlistTextMessage(
          WaitlistFieldKeysEnum.waitlistAddedDifferentPhoneText,
          language
        ),
    parameterMap
  );
  await twilioClient.messages.create({
    to: waitlist.phoneNumber,
    body: textMessage,
    from: configuration.twilioMessagingFromPhoneNumber,
  });
}
