// Copyright 2021 Prescryptive Health, Inc.

import { ISmartPriceRegistration } from '../handlers/register-smart-price.handler';
import { ISmartPriceMembership } from '../smart-price-membership';
import { buildEmailBody } from './build-email-body';

describe('buildEmailBody', () => {
  it('should create email body from the membership', () => {
    const memberInfo: ISmartPriceMembership = {
      memberId: 'SM12345',
      rxGroup: '200P32F',
      rxBin: '610749',
      carrierPCN: 'X01',
    };
    const registration: ISmartPriceRegistration = {
      verifyCode: '111111',
      firstName: 'first',
      lastName: 'last',
      dateOfBirth: '01/01/2000',
      phoneNumber: '+11111111111',
      email: 'email@email.com',
    };
    const expectedBody = {
      from: { email: 'noreply@prescryptive.com', name: 'Prescryptive' },
      personalizations: [
        {
          dynamic_template_data: {
            carrierPCN: 'X01',
            memberId: 'SM12345',
            rxBin: '610749',
            rxGroup: '200P32F',
          },
          subject: 'Savings for your medications',
          to: [{ email: 'email@email.com', name: 'first last' }],
        },
      ],
      templateId: 'd-fbbc981d41524d079da781562629ddcc',
    };

    expect(buildEmailBody(registration, memberInfo)).toEqual(expectedBody);
  });
});
