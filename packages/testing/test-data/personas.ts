// Copyright 2022 Prescryptive Health, Inc.

import { Persona, InsuranceInfo } from '../types';

export const plans: InsuranceInfo = {
  cardHolderID: 'T5703506484',
  groupNumber: 'CON03',
  personCode: '01',
};

export const personas: Record<string, Persona> = {
  account1: {
    pin: '7777',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '2000-01-01',
    email: '',
    cardHolderID: 'T',
    groupNumber: 'CON03',
    personCode: '01',
    phoneNumberDialingCode: '',
    genderCode: 1,
  },
  account2: {
    pin: '7777',
    firstName: 't',
    lastName: 't',
    phoneNumber: '4252875340',
    dateOfBirth: '2000-01-01',
    email: '',
    cardHolderID: 'T5703506484',
    groupNumber: 'CON03',
    personCode: '01',
    phoneNumberDialingCode: '',
    genderCode: 1,
  },
};
