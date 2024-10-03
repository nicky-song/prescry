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
import { ITelemetryIds } from '../../../models/telemetry-id';

export const mockMedications: IMedication[] = [
  {
    form: 'capsules',
    genericName: 'Pregablin',
    genericProductId: '27250050000350',
    medicationId: '58554', // DRUG_DESCRIPTOR_IDENTIFIER
    name: 'Lyrica',
    strength: '50',
    units: 'mg',
  },
  {
    form: 'tablets',
    genericName: 'Gabapentin',
    genericProductId: '27250050000358',
    medicationId: '58555', // DRUG_DESCRIPTOR_IDENTIFIER
    name: 'Gabapentin',
    strength: '100',
    units: 'mg',
  },
  {
    form: 'tablets',
    genericName: 'Oxycodone',
    genericProductId: '27250050000353',
    medicationId: '58777', // DRUG_DESCRIPTOR_IDENTIFIER
    name: 'OxyContin',
    strength: '10',
    units: 'mg',
  },
  {
    form: 'tablets',
    genericName: 'Place-holder generic name',
    genericProductId: '27250050000353',
    medicationId: '58779', // DRUG_DESCRIPTOR_IDENTIFIER
    name: 'Place-holder',
    strength: '10',
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
        fillNumber: 3,
      },
      {
        authorizedRefills: 5,
        count: 90,
        daysSupply: 90,
        fillNumber: 3,
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
  {
    expiresOn: new Date(),
    fillOptions: [
      {
        authorizedRefills: 5,
        count: 30,
        daysSupply: 30,
        fillNumber: 3,
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
      name: 'Joe Damagio',
      ncpdp: 'b24627c2990a',
      phone: '555-500-5000',
    },
    referenceNumber: 'f7a31265-c8bc-45bd-bdc4-fc39aee1716e',
    sig: 'Take one tablet every 24 hours',
  },
  {
    expiresOn: new Date(),
    fillOptions: [
      {
        authorizedRefills: 5,
        count: 60,
        daysSupply: 30,
        fillNumber: 3,
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
      name: 'Joe Damagio',
      ncpdp: 'b24627c2990a',
      phone: '555-500-5000',
    },
    referenceNumber: 'f7a31265-c8bc-45cd-bdc4-fc39aee1716e',
    sig: 'Take one tablet twice daily',
  },
];

export const mockPrescriptionOffers: IPharmacyOffer[] = [
  {
    hasDriveThru: true,
    isBrand: true,
    offerId: 'e1a04711-63d6-4299-a1dd-4732a8f640cf',
    pharmacyNcpdp: '4916017',
    price: {
      memberPaysOffer: 594.93,
      memberPaysTotal: 594.93,
      pharmacyCashPrice: 803.61,
      planCoveragePays: 208.68,
    },
    sort: {
      distance: 0.9,
      price: 594.93,
    },
    type: 'retail',
  },
  {
    offerId: '6a8b85b0-c341-4832-bb7e-a5ab7f0b9310',
    pharmacyNcpdp: '4918097',

    price: {
      memberPaysOffer: 430.03,
      memberPaysTotal: 430.03,
      pharmacyCashPrice: 638.71,
      planCoveragePays: 208.68,
    },
    sort: {
      distance: 0.8,
      price: 430.03,
    },
    type: 'retail',
  },
  {
    offerId: '7f6dd25e-2e21-4430-bae6-47eaf37d8f37',
    pharmacyNcpdp: '4914176',
    price: {
      memberPaysOffer: 593.93,
      memberPaysShipping: 0,
      memberPaysTotal: 593.93,
      pharmacyCashPrice: 802.61,
      planCoveragePays: 208.68,
    },
    sort: {
      distance: 0.5,
      price: 593.93,
    },
    type: 'retail',
  },

  {
    daysSupply: 90,
    hasDriveThru: true,
    isBrand: true,
    offerId: 'c12c48a3-1b1c-48d4-bee7-6ed9d182635f',
    pharmacyNcpdp: '4919900',
    price: {
      memberPaysOffer: 450.03,
      memberPaysShipping: 8.0,
      memberPaysTotal: 458.03,
      pharmacyCashPrice: 658.71,
      planCoveragePays: 208.68,
    },
    sort: {
      price: 450.03,
    },
    type: 'mail-order',
  },

  {
    daysSupply: 90,
    hasDriveThru: true,
    isBrand: true,
    offerId: 'c12c48a3-1b1c-48d4-bee7-6ed9d1826364',
    pharmacyNcpdp: '4916020',
    price: {
      memberPaysOffer: 398.03,
      memberPaysShipping: 2.0,
      memberPaysTotal: 400.03,
      pharmacyCashPrice: 658.71,
      planCoveragePays: 260.68,
    },
    sort: {
      price: 398.03,
    },
    type: 'mail-order',
  },
  {
    offerId: '7f6dd25e-2e21-4430-bae6-47eaf37d8f90',
    pharmacyNcpdp: '4916030',
    price: {
      memberPaysOffer: 593.93,
      memberPaysShipping: 0,
      memberPaysTotal: 493.93,
      pharmacyCashPrice: 802.61,
      planCoveragePays: 208.68,
    },
    sort: {
      distance: 0.9,
      price: 593.93,
    },
    type: 'retail',
  },
  {
    offerId: '7f6dd25e-2e21-4430-bae6-47eaf37d8780',
    pharmacyNcpdp: '4916050',
    price: {
      memberPaysOffer: 300.93,
      memberPaysShipping: 0,
      memberPaysTotal: 300.93,
      pharmacyCashPrice: 802.61,
      planCoveragePays: 501.68,
    },
    sort: {
      distance: 0.5,
      price: 300.93,
    },
    type: 'retail',
  },
  {
    daysSupply: 90,
    hasDriveThru: true,
    isBrand: true,
    offerId: 'c12c48a3-1b1c-48d4-bee7-6ed9d1826364',
    pharmacyNcpdp: '4919970',
    price: {
      memberPaysOffer: 460.03,
      memberPaysShipping: 2.0,
      memberPaysTotal: 462.03,
      pharmacyCashPrice: 658.71,
      planCoveragePays: 198.68,
    },
    sort: {
      price: 460.03,
    },
    type: 'mail-order',
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
      },
      {
        closes: { h: 9, m: 0, pm: true },
        day: 'mon',
        opens: { h: 9, m: 0, pm: false },
      },
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
  {
    address: {
      city: 'Kirkland',
      lineOne: '14442 125th Ave NE',
      lineTwo: 'Suite 300',
      state: 'WA',
      zip: '98034',
    },
    hours: [
      {
        closes: { h: 6, m: 0, pm: true },
        day: 'sun',
        opens: { h: 9, m: 0, pm: false },
      },
      {
        closes: { h: 9, m: 0, pm: true },
        day: 'mon',
        opens: { h: 9, m: 0, pm: false },
      },
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
    name: 'Bartell Drugs #21',
    ncpdp: '4916017',
    phone: '4258815544',
  },
  {
    address: {
      city: 'Kirkland',
      lineOne: '8629 120th Ave NE',
      state: 'WA',
      zip: '98033',
    },
    hours: [
      {
        closes: { h: 9, m: 0, pm: true },
        day: 'sun',
        opens: { h: 9, m: 0, pm: false },
      },
      {
        closes: { h: 9, m: 0, pm: true },
        day: 'mon',
        opens: { h: 9, m: 0, pm: false },
      },
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
        closes: { h: 9, m: 0, pm: true },
        day: 'sat',
        opens: { h: 9, m: 0, pm: false },
      },
    ],
    name: 'Costco Pharmacy',
    ncpdp: '4918097',
    phone: '4258220414',
  },
  {
    email: 'mailpharma@example.com',
    hours: [
      {
        closes: { h: 9, m: 0, pm: true },
        day: 'sun',
        opens: { h: 9, m: 0, pm: false },
      },
      {
        closes: { h: 9, m: 0, pm: true },
        day: 'mon',
        opens: { h: 9, m: 0, pm: false },
      },
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
        closes: { h: 9, m: 0, pm: true },
        day: 'sat',
        opens: { h: 9, m: 0, pm: false },
      },
    ],
    name: 'MailPharma',
    ncpdp: '4919900',
    phone: '4258217455',
  },
  {
    address: {
      city: 'Kirkland',
      lineOne: '14442 126th Ave NE',
      lineTwo: 'Suite 300',
      state: 'WA',
      zip: '98034',
    },
    hours: [
      {
        closes: { h: 11, m: 30, pm: true },
        day: 'sun',
        opens: { h: 8, m: 0, pm: false },
      },
      {
        closes: { h: 11, m: 0, pm: true },
        day: 'mon',
        opens: { h: 11, m: 0, pm: false },
      },
      {
        closes: { h: 1, m: 0, pm: false },
        day: 'tue',
        opens: { h: 2, m: 0, pm: true },
      },
      {
        closes: { h: 2, m: 0, pm: false },
        day: 'wed',
        opens: { h: 3, m: 0, pm: true },
      },
      {
        closes: { h: 11, m: 0, pm: true },
        day: 'thu',
        opens: { h: 8, m: 0, pm: false },
      },
      {
        closes: { h: 4, m: 0, pm: false },
        day: 'fri',
        opens: { h: 6, m: 0, pm: true },
      },
      {
        closes: { h: 11, m: 0, pm: true },
        day: 'sat',
        opens: { h: 8, m: 0, pm: false },
      },
    ],
    name: 'Bartell Drugs #30',
    ncpdp: '4916030',
    phone: '4258815544',
  },
  {
    address: {
      city: 'Kirkland',
      lineOne: '14442 127th Ave NE',
      lineTwo: 'Suite 300',
      state: 'WA',
      zip: '98034',
    },
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
    name: 'Bartell Drugs #25',
    ncpdp: '4916020',
    phone: '4258815544',
  },
  {
    address: {
      city: 'Kirkland',
      lineOne: '14442 128th Ave NE',
      lineTwo: 'Suite 300',
      state: 'WA',
      zip: '98034',
    },
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
    name: 'Value Drug Mart',
    ncpdp: '4916050',
    phone: '4258815894',
  },
  {
    email: 'mailpharma@example.com',
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
    name: 'Pharmasave',
    ncpdp: '4919970',
    phone: '4258217455',
  },
];

export const mockPatient: IPatient = {
  email: 'memb*****@exam*****.com',
  patientId: '174a8053-0b03-4988-88c6-121d77128c3a',
};

export const mockRecommendations: IRecommendation[] = [];

export const mockPendingPrescriptions: IPendingPrescription[] = [
  {
    bestPrice: '$430',
    identifier: 'mock-pending-rx-1',
    medication: mockMedications[0],
    medicationId: mockMedications[0].medicationId,
    offers: mockPrescriptionOffers,
    pharmacies: mockPharmacies,
    prescription: mockPrescriptions[0],
  },
  {
    bestPrice: '$430',
    identifier: 'mock-pending-rx-2',
    medication: mockMedications[1],
    medicationId: mockMedications[1].medicationId,
    offers: mockPrescriptionOffers,
    pharmacies: mockPharmacies,
    prescription: mockPrescriptions[0],
  },
  {
    bestPrice: '$430',
    identifier: 'mock-pending-rx-3',
    medication: mockMedications[0],
    medicationId: mockMedications[0].medicationId,
    offers: mockPrescriptionOffers,
    pharmacies: mockPharmacies,
    prescription: mockPrescriptions[1],
  },
  {
    bestPrice: '$430',
    identifier: 'mock-pending-rx-4',
    medication: mockMedications[1],
    medicationId: mockMedications[1].medicationId,
    offers: mockPrescriptionOffers,
    pharmacies: mockPharmacies,
    prescription: mockPrescriptions[1],
  },
  {
    bestPrice: '$290',
    identifier: 'mock-pending-rx-6',
    medication: mockMedications[2],
    medicationId: mockMedications[2].medicationId,
    offers: mockPrescriptionOffers,
    pharmacies: mockPharmacies,
    prescription: mockPrescriptions[0],
  },
  {
    bestPrice: '$330',
    identifier: 'mock-pending-rx-7',
    medication: mockMedications[3],
    medicationId: mockMedications[3].medicationId,
    offers: mockPrescriptionOffers,
    pharmacies: mockPharmacies,
    prescription: mockPrescriptions[0],
  },
];

export const mockTelemetryIds: ITelemetryIds = {
  correlationId: 'mock-parent-operation-id',
  operationId: 'mock-operation-id',
};
export const mockPendingPrescriptionsList: IPendingPrescriptionsList = {
  events: [mockTelemetryIds],
  identifier: 'mock',
  prescriptions: mockPendingPrescriptions,
};
