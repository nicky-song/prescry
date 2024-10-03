// Copyright 2022 Prescryptive Health, Inc.

import {
  IInsuranceInformationContent,
  insuranceInformationContent,
} from './insurance-information.content';

describe('InsuranceInformationContent', () => {
  it('has expected content', () => {
    const expectedContent: IInsuranceInformationContent = {
      id: 'payment-method',
      headingTitle: 'Payment information',
      question: 'Please select a payment method',
      placeHolder: 'Select a value',
      options: new Map<string, string>([
        ['creditDebitCard', 'Credit / debit card'],
        ['commercial', 'Commercial health insurance'],
        ['medicare', 'Medicare'],
        ['medicaid', 'Medicaid'],
        ['tricare', 'Tricare'],
        ['va', 'VA'],
      ]),
    };
    expect(insuranceInformationContent).toEqual(expectedContent);
  });
});
