// Copyright 2021 Prescryptive Health, Inc.

import { Twilio } from 'twilio';
import { IConfiguration } from '../../../configuration';
import { ICoupon } from '../../../models/coupon';
import { ITextMessageComponents } from './send-text-messages';

export async function sendCouponInformationTextIfApplicable(
  configuration: IConfiguration,
  twilioClient: Twilio,
  phoneNumber: string | undefined,
  coupon: ICoupon | undefined,
  textMessageComponents: ITextMessageComponents | undefined
) {
  if (
    coupon &&
    phoneNumber &&
    textMessageComponents?.informationMessage &&
    textMessageComponents?.contactPhoneNumber
  ) {
    await twilioClient.messages.create({
      to: phoneNumber,
      body: messageBuilder(coupon as ICoupon, textMessageComponents),
      from: configuration.twilioMessagingFromPhoneNumber,
    });
  }
}

const messageBuilder = (
  coupon: ICoupon,
  textMessageComponents: ITextMessageComponents
) => `${textMessageComponents.informationMessage}

${textMessageComponents.groupNumberText} ${coupon.GroupNumber}
${textMessageComponents.pcnText} ${coupon.PCN}
${textMessageComponents.memberIdText} ${coupon.MemberId}
${textMessageComponents.binText} ${coupon.BIN}

${textMessageComponents.questionsText} ${textMessageComponents.contactPhoneNumber}`;
