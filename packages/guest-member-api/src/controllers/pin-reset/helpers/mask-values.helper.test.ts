// Copyright 2021 Prescryptive Health, Inc.

import { maskEmail, maskPhoneNumber } from './mask-values.helper';

describe('maskPhoneNumber', () => {
  const phoneNumberMock = '+11112223344';
  const maskedPhoneNumberMock = '(XXX) XXX-3344';
  it('returns masked phone number', () => {
    const maskedPhoneNumber = maskPhoneNumber(phoneNumberMock);
    expect(maskedPhoneNumber).toEqual(maskedPhoneNumberMock);
  });
});
describe('maskEmailAddress', () => {
  it('returns masked email address', () => {
    const maskedEmailAddress = maskEmail('email@email.com');
    expect(maskedEmailAddress).toEqual('e*****l@email.com');
  });
  it('returns fixed length of masked email address irrespective of original email', () => {
    const maskedEmailAddress = maskEmail('big.email.testing@email.com');
    expect(maskedEmailAddress).toEqual('b*****g@email.com');
  });
});
