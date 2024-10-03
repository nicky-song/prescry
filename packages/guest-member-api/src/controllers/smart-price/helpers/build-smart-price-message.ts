// Copyright 2021 Prescryptive Health, Inc.

import { ISmartPriceMembership } from '../smart-price-membership';

export const smartPriceWelcomeMessageBuilder = (
  membershipInfo: ISmartPriceMembership
) => `Welcome to the Prescryptive SmartPrice™ savings plan!

Present the following information to your pharmacy to save on medications:
Member ID: ${membershipInfo.memberId}
RxGroup: ${membershipInfo.rxGroup}
RxBin: ${membershipInfo.rxBin}
PCN: ${membershipInfo.carrierPCN}`;
