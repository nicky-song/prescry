// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacy } from '../../../models/pharmacy';

export const selectedPharmacyMock: IPharmacy = {
  name: 'Test Provider',
  address: {
    lineOne: '123 Test St',
    lineTwo: 'Apt 321',
    city: 'Seattle',
    state: 'WA',
    zip: '98109',
  },
  ncpdp: '12345678',
  hours: [],
  twentyFourHours: true,
  phoneNumber: '1234567890',
  isMailOrderOnly: false,
};
