// Copyright 2022 Prescryptive Health, Inc.

import { IContactPoint } from '../models/fhir/contact-point';

export const mockTelephoneCurrentHomePhoneNoPeriod: IContactPoint = {
  system: 'phone',
  value: '1111111111',
  use: 'home',
};

export const mockTelephoneCurrentHomePhoneNoPeriodWithRank: IContactPoint = {
  system: 'phone',
  value: '1111111111',
  use: 'home',
  rank: 1,
};
export const mockTelephoneCurrentMobilePhoneNoPeriod: IContactPoint = {
  system: 'phone',
  value: '1111111111',
  use: 'mobile',
};

export const mockTelephoneCurrentWorkPhoneNoPeriod: IContactPoint = {
  system: 'phone',
  value: '1111111111',
  use: 'work',
};

export const mockTelephoneCurrentHomePhoneExpired: IContactPoint = {
  system: 'phone',
  value: '9999999999',
  use: 'home',
  period: {
    start: '2005-01-01',
    end: '2015-01-01',
  },
};

export const mockTelephoneCurrentMobilePhoneExpiredOlder: IContactPoint = {
  system: 'phone',
  value: '9999999999',
  use: 'mobile',
  period: {
    start: '2002-01-01',
    end: '2005-01-01',
  },
};

export const mockTelephoneCurrentMobilePhoneExpired: IContactPoint = {
  system: 'phone',
  value: '9999999999',
  use: 'mobile',
  period: {
    start: '2005-01-01',
    end: '2015-01-01',
  },
};

export const mockTelephoneCurrentWorkPhoneExpired: IContactPoint = {
  system: 'phone',
  value: '9999999999',
  use: 'work',
  period: {
    start: '2005-01-01',
    end: '2015-01-01',
  },
};

export const mockTelephoneCurrentHomePhoneCurrent: IContactPoint = {
  system: 'phone',
  value: '8888888888',
  use: 'home',
  period: {
    start: '2015-01-01',
  },
};

export const mockTelephoneCurrentHomePhoneCurrentOlder: IContactPoint = {
  system: 'phone',
  value: '8888888888',
  use: 'home',
  period: {
    start: '2011-01-01',
  },
};

export const mockTelephoneCurrentHomePhoneCurrentNoStart: IContactPoint = {
  system: 'phone',
  value: '8888888888',
  use: 'home',
  period: {},
};

export const mockTelephoneCurrentMobilePhoneCurrent: IContactPoint = {
  system: 'phone',
  value: '8888888888',
  use: 'mobile',
  period: {
    start: '2015-01-01',
  },
};

export const mockTelephoneCurrentWorkPhoneCurrent: IContactPoint = {
  system: 'phone',
  value: '8888888888',
  use: 'work',
  period: {
    start: '2015-01-01',
  },
};

export const mockTelephoneCurrentMobilePhoneCountryCodeNoPeriod: IContactPoint =
  {
    system: 'phone',
    value: '+12222222222',
    use: 'mobile',
  };

export const mockTelephonesSingleMobileNoPeriod: IContactPoint[] = [
  mockTelephoneCurrentMobilePhoneNoPeriod,
];

export const mockTelephonesSingleHomeNoPeriod: IContactPoint[] = [
  mockTelephoneCurrentHomePhoneNoPeriod,
];

export const mockTelephonesSingleHomeNoPeriodWithRank: IContactPoint[] = [
  mockTelephoneCurrentHomePhoneNoPeriodWithRank,
];

export const mockTelephonesMultipleNoPeriod: IContactPoint[] = [
  mockTelephoneCurrentMobilePhoneNoPeriod,
  mockTelephoneCurrentHomePhoneNoPeriod,
  mockTelephoneCurrentWorkPhoneNoPeriod,
];

export const mockTelephonesMultipleNoPeriodMobileLast: IContactPoint[] = [
  mockTelephoneCurrentHomePhoneNoPeriod,
  mockTelephoneCurrentWorkPhoneNoPeriod,
  mockTelephoneCurrentMobilePhoneNoPeriod,
];

export const mockTelephonesMultipleMobile: IContactPoint[] = [
  mockTelephoneCurrentMobilePhoneExpiredOlder,
  mockTelephoneCurrentMobilePhoneExpired,
  mockTelephoneCurrentMobilePhoneCurrent,
];

export const mockTelephonesMultiple: IContactPoint[] = [
  mockTelephoneCurrentMobilePhoneExpired,
  mockTelephoneCurrentMobilePhoneCurrent,
  mockTelephoneCurrentHomePhoneExpired,
  mockTelephoneCurrentHomePhoneCurrent,
  mockTelephoneCurrentWorkPhoneExpired,
  mockTelephoneCurrentWorkPhoneCurrent,
];

export const mockTelephonesMultipleWithCountryCode: IContactPoint[] = [
  mockTelephoneCurrentMobilePhoneExpired,
  mockTelephoneCurrentMobilePhoneCountryCodeNoPeriod,
  mockTelephoneCurrentHomePhoneExpired,
  mockTelephoneCurrentHomePhoneCurrent,
  mockTelephoneCurrentWorkPhoneExpired,
  mockTelephoneCurrentWorkPhoneCurrent,
];
