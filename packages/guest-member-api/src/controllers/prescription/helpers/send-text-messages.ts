// Copyright 2022 Prescryptive Health, Inc.

import { Response } from 'express';
import { RxGroupTypesEnum } from '@phx/common/src/models/member-profile/member-profile-info';
import { IConfiguration } from '../../../configuration';
import { sendInformationTextIfApplicable } from './send-information-text-if-applicable';
import { sendCouponInformationTextIfApplicable } from './send-coupon-information-text-if-applicable';
import { getCMSCommunicationContent } from '../../../utils/external-api/cms-communication-content/get-cms-communication-content';
import { Twilio } from 'twilio';
import { ICoupon } from '../../../models/coupon';
import { IPerson } from '@phx/common/src/models/person';
import { Language } from '@phx/common/src/models/language';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { getContentLanguage } from '@phx/common/src/utils/translation/get-content-language.helper';
import { assertHasPatientAccount } from '../../../assertions/assert-has-patient-account';
import { EndpointVersion } from '../../../models/endpoint-version';

export interface ITextMessageComponents {
  informationMessage?: string;
  contactPhoneNumber?: string;
  groupNumberText?: string;
  pcnText?: string;
  memberIdText?: string;
  binText?: string;
  questionsText?: string;
}

export const sendTextMessages = async (
  configuration: IConfiguration,
  twilioClient: Twilio,
  response: Response,
  isMock?: boolean,
  coupon?: ICoupon,
  person?: IPerson,
  version?: EndpointVersion
) => {
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

  const communicationContent = await getCMSCommunicationContent(
    configuration,
    language
  );

  if (person?.phoneNumber && person.primaryMemberRxId) {
    const isSieMember = person.rxGroupType === RxGroupTypesEnum.SIE;
    const textMessagePartialComponents: Partial<ITextMessageComponents> = {
      groupNumberText: communicationContent.groupNumberText || '',
      pcnText: communicationContent.pcnText || '',
      memberIdText: communicationContent.memberIdText || '',
      binText: communicationContent.binText || '',
      questionsText: communicationContent.questionsText || '',
    };

    if (isSieMember) {
      const textMessagePBMComponents: ITextMessageComponents = {
        informationMessage:
          communicationContent.pbmTextInformationMessage || '',
        contactPhoneNumber: communicationContent.supportPBMPhone || '',
        ...textMessagePartialComponents,
      };
      await sendInformationTextIfApplicable(
        configuration,
        twilioClient,
        person.phoneNumber,
        person,
        textMessagePBMComponents
      );
    } else {
      const textMessageCashComponents: ITextMessageComponents = {
        informationMessage:
          communicationContent.cashTextInformationMessage || '',
        contactPhoneNumber: communicationContent.supportCashPhone || '',
        ...textMessagePartialComponents,
      };
      await sendInformationTextIfApplicable(
        configuration,
        twilioClient,
        person.phoneNumber,
        person,
        textMessageCashComponents
      );

      const couponMock = {
        GroupNumber: 'group-number-mock',
        PCN: 'pcn-mock',
        MemberId: 'member-id-mock',
        BIN: 'bin-mock',
      } as ICoupon;

      const textMessageCouponComponents: ITextMessageComponents = {
        informationMessage:
          communicationContent.couponTextInformationMessage || '',
        contactPhoneNumber: communicationContent.supportCashPhone || '',
        ...textMessagePartialComponents,
      };
      await sendCouponInformationTextIfApplicable(
        configuration,
        twilioClient,
        person.phoneNumber,
        isMock ? couponMock : coupon,
        textMessageCouponComponents
      );
    }
  }
};
