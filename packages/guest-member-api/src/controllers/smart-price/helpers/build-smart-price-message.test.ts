// Copyright 2021 Prescryptive Health, Inc.

import { ISmartPriceMembership } from '../smart-price-membership';
import { smartPriceWelcomeMessageBuilder } from './build-smart-price-message';

describe('smartPriceWelcomeMessageBuilder', () => {
  it('should create message content from the membership', () => {
    const memberInfo: ISmartPriceMembership = {
      memberId: 'SM12345',
      rxGroup: '200P32F',
      rxBin: '610749',
      carrierPCN: 'X01',
    };
    const expectedMessage = `Welcome to the Prescryptive SmartPrice™ savings plan!

Present the following information to your pharmacy to save on medications:
Member ID: SM12345
RxGroup: 200P32F
RxBin: 610749
PCN: X01`;

    expect(smartPriceWelcomeMessageBuilder(memberInfo)).toEqual(
      expectedMessage
    );
  });
});
