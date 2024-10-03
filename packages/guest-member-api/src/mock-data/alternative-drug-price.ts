// Copyright 2022 Prescryptive Health, Inc.

import { IAlternativeMedication } from '@phx/common/src/models/alternative-medication';
import { IContactInfo } from '@phx/common/src/models/contact-info';
import { IPrescribedMedication } from '@phx/common/src/models/prescribed-medication';

export interface IAlternativeDrugPrice {
  prescribedMedication: IPrescribedMedication;
  alternativeMedicationList: IAlternativeMedication[];
  pharmacyInfo: IContactInfo;
}

const pharmacyHours = [
  {
    day: 'sun',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
  {
    day: 'mon',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
  {
    day: 'tue',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
  {
    day: 'wed',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
  {
    day: 'thu',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
  {
    day: 'fri',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
  {
    day: 'sat',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
];

export const alternativeDrugPriceMock: IAlternativeDrugPrice = {
  prescribedMedication: {
    drugName: 'Invokana (Canagliflozin)',
    drugDetails: {
      formCode: 'capsules',
      quantity: 30,
      strength: '150',
      unit: 'mg',
      supply: 30,
    },
    price: 172.25,
    planPrice: 405.3,
    orderDate: new Date().toDateString(),
  },
  alternativeMedicationList: [
    {
      memberSaves: 79,
      planSaves: 184,
      prescriptionDetailsList: [
        {
          productName: 'Farxiga',
          quantity: 30,
          formCode: 'tablets',
          strength: '5',
          unit: 'mg',
        },
      ],
      drugPricing: {
        memberPays: 92.45,
        planPays: 220.4,
      },
    },
    {
      memberSaves: 0,
      planSaves: 149,
      prescriptionDetailsList: [
        {
          productName: 'Steglatro',
          quantity: 30,
          formCode: 'tablets',
          strength: '5',
          unit: 'mg',
        },
      ],
      drugPricing: {
        memberPays: 172.25,
        planPays: 256.0,
      },
    },
  ],
  pharmacyInfo: {
    name: 'Value Drug Mart',
    phone: '777-777-7777',
    ncpdp: 'ncpdp-mock',
    hours: pharmacyHours,
  },
};
