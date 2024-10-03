// Copyright 2022 Prescryptive Health, Inc.

import { IContactPoint } from '../../models/fhir/contact-point';
import {
  mockTelephoneCurrentHomePhoneCurrent,
  mockTelephoneCurrentHomePhoneCurrentNoStart,
  mockTelephoneCurrentHomePhoneCurrentOlder,
  mockTelephoneCurrentMobilePhoneCurrent,
  mockTelephoneCurrentMobilePhoneExpired,
  mockTelephoneCurrentMobilePhoneExpiredOlder,
  mockTelephoneCurrentMobilePhoneNoPeriod,
  mockTelephonesMultiple,
  mockTelephonesMultipleMobile,
  mockTelephonesMultipleNoPeriod,
  mockTelephonesMultipleNoPeriodMobileLast,
  mockTelephonesMultipleWithCountryCode,
  mockTelephonesSingleHomeNoPeriod,
  mockTelephonesSingleHomeNoPeriodWithRank,
  mockTelephonesSingleMobileNoPeriod,
} from '../../mock-data/fhir-telephone.mock';
import {
  mockPatient,
  mockPatientWithEmail,
} from '../../mock-data/fhir-patient.mock';
import {
  mockTelecomMobilePhoneEmailNoPeriod,
  mockTelecomPhoneEmailWithOlderPeriod,
} from '../../mock-data/fhir-telecom.mock';
import {
  compareContactPointPeriod,
  getMobileContactPhone,
  getMostRecentPreferredContactForSystem,
  getPreferredEmailFromPatient,
  getPreferredContactForSystem,
  getEmailFromPatientForPurpose,
} from './get-contact-info-from-patient';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('compareContactPointPeriod', () => {
  it('sorts telephones in ascending date order with period and no period', () => {
    const provided: IContactPoint[] = [
      mockTelephoneCurrentMobilePhoneExpired,
      mockTelephoneCurrentMobilePhoneNoPeriod,
    ];

    provided.sort(compareContactPointPeriod);

    const expected: IContactPoint[] = [
      mockTelephoneCurrentMobilePhoneNoPeriod,
      mockTelephoneCurrentMobilePhoneExpired,
    ];
    expect(provided).toEqual(expected);
  });

  it('sorts telephones in ascending date order with no period and period', () => {
    const provided: IContactPoint[] = [
      mockTelephoneCurrentMobilePhoneNoPeriod,
      mockTelephoneCurrentMobilePhoneExpired,
    ];

    provided.sort(compareContactPointPeriod);

    const expected: IContactPoint[] = [
      mockTelephoneCurrentMobilePhoneNoPeriod,
      mockTelephoneCurrentMobilePhoneExpired,
    ];
    expect(provided).toEqual(expected);
  });

  it('sorts telephones in ascending date order with period without end', () => {
    const provided: IContactPoint[] = [
      mockTelephoneCurrentHomePhoneCurrent,
      mockTelephoneCurrentHomePhoneCurrentOlder,
      mockTelephoneCurrentMobilePhoneCurrent,
    ];

    provided.sort(compareContactPointPeriod);

    const expected: IContactPoint[] = [
      mockTelephoneCurrentHomePhoneCurrent,
      mockTelephoneCurrentMobilePhoneCurrent,
      mockTelephoneCurrentHomePhoneCurrentOlder,
    ];
    expect(provided).toEqual(expected);
  });

  it('sorts telephones in ascending date order with period without end and no start', () => {
    const provided: IContactPoint[] = [
      mockTelephoneCurrentHomePhoneCurrent,
      mockTelephoneCurrentHomePhoneCurrentOlder,
      mockTelephoneCurrentHomePhoneCurrentNoStart,
      mockTelephoneCurrentMobilePhoneCurrent,
    ];

    provided.sort(compareContactPointPeriod);

    const expected: IContactPoint[] = [
      mockTelephoneCurrentHomePhoneCurrentNoStart,
      mockTelephoneCurrentHomePhoneCurrent,
      mockTelephoneCurrentMobilePhoneCurrent,
      mockTelephoneCurrentHomePhoneCurrentOlder,
    ];
    expect(provided).toEqual(expected);
  });

  it('sorts telephones in ascending date order with period without end and no start different order', () => {
    const provided: IContactPoint[] = [
      mockTelephoneCurrentHomePhoneCurrent,
      mockTelephoneCurrentHomePhoneCurrentNoStart,
      mockTelephoneCurrentHomePhoneCurrentOlder,
      mockTelephoneCurrentMobilePhoneCurrent,
    ];

    provided.sort(compareContactPointPeriod);

    const expected: IContactPoint[] = [
      mockTelephoneCurrentHomePhoneCurrentNoStart,
      mockTelephoneCurrentHomePhoneCurrent,
      mockTelephoneCurrentMobilePhoneCurrent,
      mockTelephoneCurrentHomePhoneCurrentOlder,
    ];
    expect(provided).toEqual(expected);
  });

  it('sorts telephones in ascending date order with period with end', () => {
    const provided: IContactPoint[] = [
      mockTelephoneCurrentMobilePhoneExpiredOlder,
      mockTelephoneCurrentMobilePhoneExpired,
    ];

    provided.sort(compareContactPointPeriod);

    const expected: IContactPoint[] = [
      mockTelephoneCurrentMobilePhoneExpired,
      mockTelephoneCurrentMobilePhoneExpiredOlder,
    ];
    expect(provided).toEqual(expected);
  });
});

describe('getMobileContactPhone', () => {
  it('returns mobile telephone from prescription with single phone', () => {
    const mockPatientSingleMobileNoPeriod = {
      ...mockPatient,
      telecom: mockTelephonesSingleMobileNoPeriod,
    };
    const telephone = getMobileContactPhone(
      mockPatientSingleMobileNoPeriod,
      undefined
    );
    expect(mockTelephonesSingleMobileNoPeriod.length).toEqual(1);
    expect(telephone).toEqual('+11111111111');
  });
  it('returns undefined telephone when no preferred phone is found', () => {
    const mockPatientSingleHomeNoPeriod = {
      ...mockPatient,
      telecom: mockTelephonesSingleHomeNoPeriod,
    };
    const telephone = getMobileContactPhone(mockPatientSingleHomeNoPeriod);
    expect(mockTelephonesSingleHomeNoPeriod.length).toEqual(1);
    expect(telephone).toEqual(undefined);
  });
  it('returns mobile telephone from prescription with multiple phones', () => {
    const mockPatientMultipleNoPeriod = {
      ...mockPatient,
      telecom: mockTelephonesMultipleNoPeriod,
    };
    const telephone = getMobileContactPhone(mockPatientMultipleNoPeriod);
    expect(mockTelephonesMultipleNoPeriod.length).toEqual(3);
    expect(telephone).toEqual('+11111111111');
  });
  it('returns mobile telephone from prescription with multiple phones when mobile is last', () => {
    const mockPatientMultipleNoPeriodMobileLast = {
      ...mockPatient,
      telecom: mockTelephonesMultipleNoPeriodMobileLast,
    };
    const telephone = getMobileContactPhone(
      mockPatientMultipleNoPeriodMobileLast
    );
    expect(mockTelephonesMultipleNoPeriodMobileLast.length).toEqual(3);
    expect(telephone).toEqual('+11111111111');
  });
  it('Does not add cuntry code if mobile telephone from prescription has country code', () => {
    const mockPatientMultipleWithCountryCode = {
      ...mockPatient,
      telecom: mockTelephonesMultipleWithCountryCode,
    };
    const telephone = getMobileContactPhone(mockPatientMultipleWithCountryCode);
    expect(telephone).toEqual('+12222222222');
  });
});

describe('getPreferredContactForSystem', () => {
  it('returns mobile telephone from prescription with single phone', () => {
    const telephone = getPreferredContactForSystem(
      mockTelephonesSingleMobileNoPeriod,
      'mobile',
      'phone'
    );
    expect(mockTelephonesSingleMobileNoPeriod.length).toEqual(1);
    expect(telephone).toEqual('1111111111');
  });
  it('returns undefined telephone when no preferred phone is found', () => {
    const telephone = getPreferredContactForSystem(
      mockTelephonesSingleHomeNoPeriod,
      'mobile',
      'phone'
    );
    expect(mockTelephonesSingleHomeNoPeriod.length).toEqual(1);
    expect(telephone).toEqual(undefined);
  });
  it('returns mobile telephone from prescription with multiple phones', () => {
    const telephone = getPreferredContactForSystem(
      mockTelephonesMultipleNoPeriod,
      'mobile',
      'phone'
    );
    expect(mockTelephonesMultipleNoPeriod.length).toEqual(3);
    expect(telephone).toEqual('1111111111');
  });
  it('returns mobile telephone from prescription with multiple phones when mobile is last', () => {
    const telephone = getPreferredContactForSystem(
      mockTelephonesMultipleNoPeriodMobileLast,
      'mobile',
      'phone'
    );
    expect(mockTelephonesMultipleNoPeriodMobileLast.length).toEqual(3);
    expect(telephone).toEqual('1111111111');
  });
  it('returns undefined telephone when preferred phone is found but rank is not matching', () => {
    const telephone = getPreferredContactForSystem(
      mockTelephonesSingleHomeNoPeriodWithRank,
      'mobile',
      'phone',
      3
    );
    expect(mockTelephonesSingleHomeNoPeriodWithRank.length).toEqual(1);
    expect(telephone).toEqual(undefined);
  });
});

describe('getMostRecentPreferredContactForSystem', () => {
  it('returns telephone from prescription with single phone', () => {
    const telephone = getMostRecentPreferredContactForSystem(
      mockTelephonesSingleMobileNoPeriod,
      'mobile',
      'phone'
    );
    expect(mockTelephonesSingleMobileNoPeriod.length).toEqual(1);
    expect(telephone).toEqual('1111111111');
  });
  it('returns telephone from prescription with multiple phones', () => {
    const telephone = getMostRecentPreferredContactForSystem(
      mockTelephonesMultipleNoPeriod,
      'mobile',
      'phone'
    );
    expect(mockTelephonesMultipleNoPeriod.length).toEqual(3);
    expect(telephone).toEqual('1111111111');
  });
  it('returns current mobile telephone from prescription with multiple mobile phones', () => {
    const telephone = getMostRecentPreferredContactForSystem(
      mockTelephonesMultipleMobile,
      'mobile',
      'phone'
    );
    expect(mockTelephonesMultipleMobile.length).toEqual(3);
    expect(telephone).toEqual('8888888888');
  });
  it('returns current mobile telephone from prescription with multiple phones', () => {
    const telephone = getMostRecentPreferredContactForSystem(
      mockTelephonesMultiple,
      'mobile',
      'phone'
    );
    expect(mockTelephonesMultiple.length).toEqual(6);
    expect(telephone).toEqual('8888888888');
  });
  it('returns current mobile telephone from prescription with multiple phones', () => {
    const telephone = getMostRecentPreferredContactForSystem(
      mockTelephonesMultiple,
      'mobile',
      'phone',
      1
    );
    expect(mockTelephonesMultiple.length).toEqual(6);
    expect(telephone).toEqual(undefined);
  });
});

describe('getPreferredEmailFromPatient', () => {
  it('returns email value from patient for given value of system', () => {
    const email = getPreferredEmailFromPatient(mockPatientWithEmail);
    expect(email).toEqual('email@prescryptive.com');
  });
  it('returns undefined when no email is found', () => {
    const email = getPreferredEmailFromPatient(mockPatient);
    expect(email).toEqual(undefined);
  });
});
describe('getEmailFromPatientForPurpose', () => {
  it('returns email value from patient for given value of purpose', () => {
    const mockPatientObject = {
      ...mockPatient,
      telecom: mockTelecomMobilePhoneEmailNoPeriod,
    };
    const email = getEmailFromPatientForPurpose('work', mockPatientObject);
    expect(email).toEqual('test2@test.com');
  });
  it('returns undefined when no email is found for given value of purpose', () => {
    const email = getEmailFromPatientForPurpose('work', mockPatient);
    expect(email).toEqual(undefined);
  });
  it('returns email value from patient when there is no period in the contact', () => {
    const mockPatientObject = {
      ...mockPatient,
      telecom: mockTelecomMobilePhoneEmailNoPeriod,
    };
    const email = getEmailFromPatientForPurpose('home', mockPatientObject);
    expect(email).toEqual('test@test.com');
  });

  it('returns email value from patient when there are multiple periods in the contact', () => {
    const mockPatientObject = {
      ...mockPatient,
      telecom: mockTelecomPhoneEmailWithOlderPeriod,
    };
    const email = getEmailFromPatientForPurpose('home', mockPatientObject);
    expect(email).toEqual('test@test.com');
  });
});
