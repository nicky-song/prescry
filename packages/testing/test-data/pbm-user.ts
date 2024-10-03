// Copyright 2022 Prescryptive Health, Inc.

import { otpUser } from '../test-data';

export const pbmUser = {
  ...otpUser,
  code: '123456',
  dateOfBirth: new Date('2000-05-01T00:00:00Z'),
  firstName: 'PBM_AUTOMATION',
  lastName: 'TEST',
  initials: 'PT',
  phoneNumberDialingCode: '+1',
};
