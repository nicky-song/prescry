// Copyright 2022 Prescryptive Health, Inc.

import { formatPhoneNumber } from './format-phone-number.helper';

describe('formatPhoneNumber', () => {
  it('should return phone number in correct format', () => {
    const phoneNumberMock = '+15555550001';

    const expectedPhoneNumber = '(555) 555-0001';

    const result = formatPhoneNumber(phoneNumberMock);

    expect(result).toEqual(expectedPhoneNumber);
  });

  it('should return phone number in correct format for phone numbers without country code', () => {
    const phoneNumberMock = '5555550001';

    const expectedPhoneNumber = '(555) 555-0001';

    const result = formatPhoneNumber(phoneNumberMock);

    expect(result).toEqual(expectedPhoneNumber);
  });

  it('should return the same phone number when it can not be formated', () => {
    const phoneNumberMock = '+15555551';

    const expectedPhoneNumber = '+15555551';

    const result = formatPhoneNumber(phoneNumberMock);

    expect(result).toEqual(expectedPhoneNumber);
  });
});
