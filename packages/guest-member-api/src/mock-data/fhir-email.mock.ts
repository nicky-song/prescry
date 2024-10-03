// Copyright 2022 Prescryptive Health, Inc.

import { IContactPoint } from '../models/fhir/contact-point';

export const mockEmailHomeCurrentNoPeriod: IContactPoint = {
  system: 'email',
  value: 'test@test.com',
  use: 'home',
};

export const mockEmailWorkCurrentNoPeriod: IContactPoint = {
  system: 'email',
  value: 'test2@test.com',
  use: 'work',
};

export const mockEmailHomeExpired: IContactPoint = {
  system: 'email',
  value: 'test3@test.com',
  use: 'home',
  period: {
    start: '2005-01-01',
    end: '2015-01-01',
  },
};

export const mockEmailHomeExpiredOlder: IContactPoint = {
  system: 'email',
  value: 'test4@test.com',
  use: 'home',
  period: {
    start: '2002-01-01',
    end: '2005-01-01',
  },
};

export const mockEmailHomeCurrentPeriod: IContactPoint = {
  system: 'email',
  value: 'test5@test.com',
  use: 'home',
  period: {
    start: '2015-01-01',
  },
};
