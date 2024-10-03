// Copyright 2022 Prescryptive Health, Inc.

import { IPerson } from '@phx/common/src/models/person';
import { Twilio } from 'twilio';
import { IConfiguration } from '../../../configuration';
import { ITextMessageComponents } from './send-text-messages';

export async function sendInformationTextIfApplicable(
  configuration: IConfiguration,
  twilioClient: Twilio,
  phoneNumber: string | undefined,
  person: IPerson | undefined,
  textMessageComponents: ITextMessageComponents | undefined
) {
  if (
    person &&
    phoneNumber &&
    textMessageComponents?.informationMessage &&
    textMessageComponents?.contactPhoneNumber
  ) {
    await twilioClient.messages.create({
      to: phoneNumber,
      body: messageBuilder(person, textMessageComponents),
      from: configuration.twilioMessagingFromPhoneNumber,
    });
  }
}

const messageBuilder = (
  person: IPerson,
  textMessageComponents: ITextMessageComponents
) => `${textMessageComponents.informationMessage}

${textMessageComponents.memberIdText} ${person.primaryMemberFamilyId}
${textMessageComponents.groupNumberText} ${person.rxGroup}
${textMessageComponents.binText} ${person.rxBin}
${textMessageComponents.pcnText} ${person.carrierPCN}

${textMessageComponents.questionsText} ${textMessageComponents.contactPhoneNumber}`;
