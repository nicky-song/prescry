// Copyright 2021 Prescryptive Health, Inc.

import { ApiConstants } from '../../../constants/api-constants';
import { ISmartPriceRegistration } from '../handlers/register-smart-price.handler';
import { ISmartPriceMembership } from '../smart-price-membership';

export interface IEmailInfo {
  name: string;
  email: string;
}

export interface IPersonalizationsInfo {
  to: IEmailInfo[];
  dynamic_template_data: ISmartPriceMembership;
  subject: string;
}
export interface IEmailReqeustBody {
  personalizations: IPersonalizationsInfo[];
  from: IEmailInfo;
  templateId: string;
}

export const buildEmailBody = (
  memberInfo: ISmartPriceRegistration,
  membershipInfo: ISmartPriceMembership
) => {
  const personalizationInfo = [
    {
      to: [
        {
          email: memberInfo.email,
          name: `${memberInfo.firstName} ${memberInfo.lastName}`,
        },
      ],
      dynamic_template_data: membershipInfo,
      subject: ApiConstants.SMART_PRICE_EMAIL_SUBJECT,
    } as IPersonalizationsInfo,
  ];
  const request = {
    personalizations: personalizationInfo,
    from: {
      email: ApiConstants.SMART_PRICE_EMAIL_SENDER_EMAIL,
      name: ApiConstants.SMART_PRICE_EMAIL_SENDER_NAME,
    } as IEmailInfo,
    templateId: ApiConstants.SMART_PRICE_EMAIL_TEMPLATE_ID,
  } as IEmailReqeustBody;
  return request;
};
