// Copyright 2023 Prescryptive Health, Inc.

import { Person } from '../types';

const badEntries: Person[] = [
  {
    firstName: 'BadFirst',
  } as Person,
  { uniqueId: 'BadMembershidId' } as Person,
  { dateOfBirth: new Date('1999-01-02T00:00:00Z') } as Person,
  {
    phoneNumber: '9999999999',
  } as Person,
];

export const createAccountPbmTestData = {
  badEntries,
  welcomeName: 'Pbm_automation',
};
