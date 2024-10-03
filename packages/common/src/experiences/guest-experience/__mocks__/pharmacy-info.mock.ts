// Copyright 2022 Prescryptive Health, Inc.

import { IPharmacy } from '../../../models/pharmacy';
import { IPharmacyDrugPrice } from '../../../models/pharmacy-drug-price';

const pharmacyOneMock: IPharmacy = {
  address: {
    lineOne: '111 Pharmacy Ave.',
    city: 'Redmond',
    state: 'WA',
    zip: '98052',
  },
  isMailOrderOnly: false,
  name: "Jackson's Pharmacy",
  ncpdp: '2017',
  hours: [
    {
      day: 'Sunday',
      opens: { h: 1, m: 0, pm: false },
      closes: { h: 11, m: 59, pm: true },
    },
    {
      day: 'Monday',
      opens: { h: 1, m: 0, pm: false },
      closes: { h: 11, m: 59, pm: true },
    },
    {
      day: 'Tuesday',
      opens: { h: 1, m: 0, pm: false },
      closes: { h: 11, m: 59, pm: true },
    },
    {
      day: 'Wednesday',
      opens: { h: 1, m: 0, pm: false },
      closes: { h: 11, m: 59, pm: true },
    },
    {
      day: 'Thursday',
      opens: { h: 1, m: 0, pm: false },
      closes: { h: 11, m: 59, pm: true },
    },
    {
      day: 'Friday',
      opens: { h: 1, m: 0, pm: false },
      closes: { h: 11, m: 59, pm: true },
    },
    {
      day: 'Saturday',
      opens: { h: 1, m: 0, pm: false },
      closes: { h: 11, m: 59, pm: true },
    },
  ],
  twentyFourHours: false,
};
const pharmacyDrugPriceOneMock: IPharmacyDrugPrice = {
  pharmacy: pharmacyOneMock,
};

const pharmacyTwoMock: IPharmacy = {
  address: {
    lineOne: '222 Pharmacy Ave.',
    city: 'Redmond',
    state: 'WA',
    zip: '98052',
  },
  isMailOrderOnly: false,
  name: "Pavani's Pharmacy",
  ncpdp: '2018',
  hours: [],
  twentyFourHours: true,
};
const pharmacyDrugPriceTwoMock: IPharmacyDrugPrice = {
  pharmacy: pharmacyTwoMock,
};

const pharmacyThreeMock: IPharmacy = {
  address: {
    lineOne: '333 Pharmacy Ave.',
    city: 'Redmond',
    state: 'WA',
    zip: '98052',
  },
  isMailOrderOnly: false,
  name: "Jimena's Pharmacy",
  ncpdp: '2019',
  hours: [
    {
      day: 'Friday',
      opens: { h: 3, m: 33, pm: false },
      closes: { h: 3, m: 33, pm: true },
    },
  ],
  twentyFourHours: false,
};
const pharmacyDrugPriceThreeMock: IPharmacyDrugPrice = {
  pharmacy: pharmacyThreeMock,
};

export const pharmacyInfoListMock: IPharmacyDrugPrice[] = [
  pharmacyDrugPriceOneMock,
  pharmacyDrugPriceTwoMock,
  pharmacyDrugPriceThreeMock,
];
