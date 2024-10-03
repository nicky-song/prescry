// Copyright 2022 Prescryptive Health, Inc.

import { IContactPoint } from '../models/fhir/contact-point';
import {
  mockEmailHomeCurrentNoPeriod,
  mockEmailWorkCurrentNoPeriod,
  mockEmailHomeCurrentPeriod,
  mockEmailHomeExpired,
  mockEmailHomeExpiredOlder,
} from './fhir-email.mock';
import {
  mockTelephoneCurrentHomePhoneNoPeriod,
  mockTelephoneCurrentMobilePhoneCurrent,
  mockTelephoneCurrentMobilePhoneExpired,
  mockTelephoneCurrentMobilePhoneExpiredOlder,
  mockTelephoneCurrentMobilePhoneNoPeriod,
  mockTelephoneCurrentWorkPhoneNoPeriod,
} from './fhir-telephone.mock';

export const mockTelecomMobilePhoneEmailNoPeriod: IContactPoint[] = [
  mockTelephoneCurrentMobilePhoneNoPeriod,
  mockTelephoneCurrentHomePhoneNoPeriod,
  mockTelephoneCurrentWorkPhoneNoPeriod,
  mockEmailHomeCurrentNoPeriod,
  mockEmailWorkCurrentNoPeriod,
];

export const mockTelecomPhoneEmailWithPeriod: IContactPoint[] = [
  mockTelephoneCurrentMobilePhoneCurrent,
  mockEmailHomeCurrentPeriod,
];

export const mockTelecomPhoneEmailWithOlderPeriod: IContactPoint[] = [
  mockTelephoneCurrentMobilePhoneExpiredOlder,
  mockTelephoneCurrentMobilePhoneExpired,
  mockEmailHomeCurrentPeriod,
  mockEmailHomeCurrentNoPeriod,
  mockEmailHomeExpired,
  mockEmailHomeExpiredOlder,
];

export const mockTelecomPhoneNoHomeEmail: IContactPoint[] = [
  mockTelephoneCurrentMobilePhoneNoPeriod,
  mockTelephoneCurrentHomePhoneNoPeriod,
  mockTelephoneCurrentWorkPhoneNoPeriod,
  mockEmailWorkCurrentNoPeriod,
];
