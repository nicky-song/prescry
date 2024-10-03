// Copyright 2018 Prescryptive Health, Inc.

import { IContactInfo } from '../../../models/contact-info';
import { IMedication } from '../../../models/medication';
import { IPatient } from '../../../models/patient';
import {
  IPendingPrescription,
  IPendingPrescriptionsList,
} from '../../../models/pending-prescription';
import { IPharmacyOffer } from '../../../models/pharmacy-offer';
import { IPrescription } from '../../../models/prescription';
import { IRecommendation } from '../../../models/recommendation';
import { mockTelemetryIds } from './pending-prescriptions.mock';

export const mockMedications: IMedication[] = [
  {
    form: 'capsules',
    genericName: 'Pregablin',
    genericProductId: '27250050000350',
    medicationId: '00002035302', // medication ndc
    name: 'Lyrica',
    strength: '150',
    units: 'mg',
  },
  {
    form: 'capsules',
    genericName: 'Pregablin',
    genericProductId: '27250050000350',
    medicationId: '00002035232', // medication ndc
    name: 'Pregablin',
    strength: '150',
    units: 'mg',
  },
];

export const mockPrescriptions: IPrescription[] = [
  {
    expiresOn: new Date(),
    fillOptions: [
      {
        authorizedRefills: 5,
        count: 30,
        daysSupply: 30,
        fillNumber: 2,
      },
    ],
    isNewPrescription: true,
    prescribedOn: new Date(),
    prescriber: {
      hours: [
        {
          closes: { h: 12, m: 12, pm: false },
          day: 'sun',
          opens: { h: 12, m: 12, pm: false },
        },
        {
          closes: { h: 12, m: 0, pm: false },
          day: 'mon',
          opens: { h: 12, m: 0, pm: false },
        },
        {
          closes: { h: 12, m: 12, pm: false },
          day: 'tue',
          opens: { h: 12, m: 12, pm: false },
        },
        {
          closes: { h: 12, m: 12, pm: false },
          day: 'wed',
          opens: { h: 12, m: 12, pm: false },
        },
        {
          closes: { h: 12, m: 12, pm: false },
          day: 'thu',
          opens: { h: 12, m: 12, pm: false },
        },
        {
          closes: { h: 12, m: 12, pm: false },
          day: 'fri',
          opens: { h: 12, m: 12, pm: false },
        },
        {
          closes: { h: 12, m: 12, pm: false },
          day: 'sat',
          opens: { h: 12, m: 12, pm: false },
        },
      ],
      name: 'Jean Doe',
      ncpdp: '0be13b5a-1ec2-4d0d-bdfe-b24627c2990b',
      phone: '555-500-5000',
    },
    referenceNumber: 'f7a31265-c8bc-45ad-bdc4-fc39aee1716e',
    sig: 'Take one capsule every 8 hours',
  },
];

export const mockPrescriptionOffers: IPharmacyOffer[] = [
  {
    hasDriveThru: true,
    isBrand: true,
    offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
    pharmacyNcpdp: '4914176',
    price: {
      memberPaysOffer: 141.58,
      memberPaysTotal: 141.58,
      pharmacyCashPrice: 566.32,
      planCoveragePays: 707.9,
    },
    sort: {
      distance: 0.9,
      price: 141.58,
    },
    type: 'retail',
  },
  {
    hasDriveThru: true,
    isBrand: false,
    offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640d0',
    pharmacyNcpdp: '4914176',
    price: {
      memberPaysOffer: 25,
      memberPaysTotal: 25,
      pharmacyCashPrice: 566.32,
      planCoveragePays: 707.9,
    },
    recommendation: {
      identifier: 'recommendation1',
    },
    sort: {
      distance: 0.9,
      price: 25,
    },
    type: 'retail',
  },
];

export const mockPharmacies: IContactInfo[] = [
  {
    address: {
      city: 'Kirkland',
      lineOne: '14442 124th Ave NE',
      lineTwo: 'Suite 300',
      state: 'WA',
      zip: '98034',
    },
    hours: [
      {
        closes: { h: 6, m: 0, pm: true },
        day: 'sun',
        opens: { h: 11, m: 0, pm: false },
      }, // sun
      {
        closes: { h: 9, m: 0, pm: true },
        day: 'mon',
        opens: { h: 9, m: 0, pm: false },
      }, // mon
      {
        closes: { h: 9, m: 0, pm: true },
        day: 'tue',
        opens: { h: 9, m: 0, pm: false },
      },
      {
        closes: { h: 9, m: 0, pm: true },
        day: 'wed',
        opens: { h: 9, m: 0, pm: false },
      },
      {
        closes: { h: 9, m: 0, pm: true },
        day: 'thu',
        opens: { h: 9, m: 0, pm: false },
      },
      {
        closes: { h: 9, m: 0, pm: true },
        day: 'fri',
        opens: { h: 9, m: 0, pm: false },
      },
      {
        closes: { h: 6, m: 0, pm: true },
        day: 'sat',
        opens: { h: 9, m: 0, pm: false },
      },
    ],
    name: 'Bartell Drugs #18',
    ncpdp: '4914176',
    phone: '4258217899',
  },
];

export const mockPatient: IPatient = {
  email: 'memb*****@exam*****.com',
  patientId: '174a8053-0b03-4988-88c6-121d77128c3a',
};

export const mockRecommendations: IRecommendation[] = [
  {
    identifier: 'recommendation1',
    rule: {
      description: 'lyrica to pregablin',
      genericSubstitution: {
        to: {
          fillOptions: {
            authorizedRefills: 5,
            count: 90,
            daysSupply: 30,
            fillNumber: 5,
          },
          medication: mockMedications[1],
        },
        toMedication: mockMedications[1],
      },
      medication: mockMedications[0],
      planGroupNumber: '10006579',
      type: 'genericSubstitution',
    },
    savings: 116,
    type: 'genericSubstitution',
  },
];

export const mockPendingPrescriptions: IPendingPrescription[] = [
  {
    bestPrice: '$430',
    confirmation: {
      offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
      orderDate: new Date(),
      orderNumber: '54321',
    },
    identifier: 'mock-pending-rx-5',
    medication: mockMedications[0],
    medicationId: '00002035302',
    offers: mockPrescriptionOffers,
    pharmacies: mockPharmacies,
    prescription: mockPrescriptions[0],
    recommendations: mockRecommendations,
  },
];

export const mockPendingPrescriptionsList: IPendingPrescriptionsList = {
  events: [mockTelemetryIds],
  identifier: 'rogue-1',
  prescriptions: mockPendingPrescriptions,
};
