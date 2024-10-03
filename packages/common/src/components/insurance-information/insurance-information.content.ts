// Copyright 2022 Prescryptive Health, Inc.

export interface IInsuranceInformationContent {
  id: string;
  headingTitle: string;
  question: string;
  placeHolder: string;
  options: Map<string, string>;
}

export const insuranceInformationContent = {
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
