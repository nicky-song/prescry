// Copyright 2022 Prescryptive Health, Inc.

import {
  IPendingPrescriptionsList,
  IPendingPrescription,
} from '@phx/common/src/models/pending-prescription';
import { IPharmacyOffer } from '@phx/common/src/models/pharmacy-offer';
import { IRecommendation } from '@phx/common/src/models/recommendation';
import { IMedication } from '@phx/common/src/models/medication';
import { IContactInfo } from '@phx/common/src/models/contact-info';

// TODO: M.Meletti - Move and re-map to
// '@phx/common/src/models/recommendation'
export type RecommendationTypes =
  | 'genericSubstitution'
  | 'alternativeSubstitution'
  | 'transfer'
  | 'notification'
  | 'reversal';

export const mockMedication: IMedication = {
  form: 'cap',
  genericName: '',
  genericProductId: '',
  isGeneric: false,
  medicationId: '12345',
  name: 'FakeMeds1',
  strength: '300',
  units: 'mg',
};

export const mockOffers: IPharmacyOffer[] = [
  {
    offerId: '631b8f36116cf079b2e663ed',
    daysSupply: 30.0,
    hasDriveThru: false,
    isBrand: true,
    pharmacyNcpdp: '4921979',
    price: {
      pharmacyCashPrice: 157.42,
      planCoveragePays: 157.42,
      memberPaysOffer: 157.42,
      memberPaysShipping: 157.42,
      memberPaysTotal: 157.42,
    },
    type: 'retail',
    sort: {
      distance: 0.9,
      price: 157.42,
    },
  },
  {
    offerId: 'f072aa22-d63e-4c48-b5b6-b5dfd3ab876c"',
    daysSupply: 30.0,
    hasDriveThru: false,
    isBrand: true,
    pharmacyNcpdp: '4921979',
    price: {
      pharmacyCashPrice: 157.42,
      planCoveragePays: 157.42,
      memberPaysOffer: 157.42,
      memberPaysShipping: 157.42,
      memberPaysTotal: 157.42,
    },
    type: 'retail',
    recommendation: {
      identifier: '631b8f39116cf079b2e663f1',
      index: 0,
    },
    sort: {
      distance: 0.9,
      price: 157.42,
    },
  },
];

export const mockPharmacies: IContactInfo[] = [
  {
    name: 'RITE AID PHARMACY # 05196',
    phone: '4257719427',
    email: 'JZOREK@RITEAID.COM',
    address: {
      city: 'RITE AID PHARMACY # 05196',
      lineOne: '18600-B 33RD AVENUE WEST',
      lineTwo: 'ALDERWOOD PLAZA SHOPPING CENTER',
      state: 'WA',
      zip: '980374715',
    },
    ncpdp: '4921979',
    hours: [
      {
        day: 'Sun',
        opens: {
          h: 10,
          m: 0,
          pm: false,
        },
        closes: {
          h: 6,
          m: 0,
          pm: true,
        },
      },
      {
        day: 'Mon',
        opens: {
          h: 9,
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
        day: 'Tue',
        opens: {
          h: 9,
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
        day: 'Wed',
        opens: {
          h: 9,
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
        day: 'Thu',
        opens: {
          h: 9,
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
        day: 'Fri',
        opens: {
          h: 9,
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
        day: 'Sat',
        opens: {
          h: 9,
          m: 0,
          pm: false,
        },
        closes: {
          h: 6,
          m: 0,
          pm: true,
        },
      },
    ],
  },
];

export const makeRecommendation = (
  substitutionType: RecommendationTypes
  // medications: IMedication[]
): IRecommendation => ({
  identifier: '631b8f39116cf079b2e663f1',
  type: substitutionType,
  savings: 151.08,
  rule: {
    // identifier: '631a8629cec30a87a07c8753',
    planGroupNumber: '',
    type: substitutionType,
    description: '',
    medication: mockMedication,
    [substitutionType]: {
      // toMedications:[mockMedication, mockMedication],
      to: [
        {
          medication: mockMedication,
          fillOptions: {
            count: 10,
            daysSupply: 10,
            authorizedRefills: 10,
            fillNumber: 10,
          },
          price: {
            pharmacyCashPrice: 10,
            planCoveragePays: 10,
            memberPaysOffer: 10,
            memberPaysShipping: 10,
            memberPaysTotal: 10,
          },
        },
      ],

      // savings: 150.5,
      // planSavings: 0.0,
      savings: '150.5',
      planSavings: '0.0',
    },
    minimumSavingsAmount: '1.0',
    minimumPlanSavingsAmount: '20.0',
  },
});

export const mockPrescriptions: IPendingPrescription = {
  identifier: '631b8f36116cf079b2e663ed',
  confirmation: {
    offerId: '631b8f36116cf079b2e663ed',
    orderNumber: '8361889722',
    orderDate: new Date('2022-09-09T00:00:00'),
  },
  medicationId: '',
  medication: mockMedication,
  offers: [
    {
      offerId: '631b8f36116cf079b2e663ed',
      daysSupply: 30.0,
      hasDriveThru: false,
      isBrand: true,
      pharmacyNcpdp: '4921979',
      price: {
        pharmacyCashPrice: 157.42,
        planCoveragePays: 157.42,
        memberPaysOffer: 157.42,
        memberPaysTotal: 157.42,
      },
      type: 'retail',
      sort: {
        distance: 0.9,
        price: 157.42,
      },
    },
    {
      offerId: 'f072aa22-d63e-4c48-b5b6-b5dfd3ab876c"',
      daysSupply: 30.0,
      hasDriveThru: false,
      isBrand: true,
      pharmacyNcpdp: '4921979',
      price: {
        pharmacyCashPrice: 157.42,
        planCoveragePays: 157.42,
        memberPaysOffer: 157.42,
        memberPaysTotal: 157.42,
      },
      type: 'retail',
      recommendation: {
        identifier: '631b8f39116cf079b2e663f1',
        index: 0,
      },
      sort: {
        distance: 0.9,
        price: 157.42,
      },
    },
  ],
  pharmacies: mockPharmacies,
  prescription: {
    expiresOn: new Date(),
    prescribedOn: new Date(),
    referenceNumber: 'some-reference-number',
    sig: 'some-sig',
    fillOptions: [
      {
        count: 2.0,
        daysSupply: 30.0,
        authorizedRefills: 5.0,
        fillNumber: 0.0,
      },
    ],
    prescriber: {
      name: 'Dr. Fake',
      phone: '1234567890',
      ncpdp: 'some-ncpdp-for-dr-fake',
      hours: [
        {
          day: 'Sun',
          opens: {
            h: 10,
            m: 0,
            pm: false,
          },
          closes: {
            h: 6,
            m: 0,
            pm: true,
          },
        },
        {
          day: 'Mon',
          opens: {
            h: 9,
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
          day: 'Tue',
          opens: {
            h: 9,
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
          day: 'Wed',
          opens: {
            h: 9,
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
          day: 'Thu',
          opens: {
            h: 9,
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
          day: 'Fri',
          opens: {
            h: 9,
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
          day: 'Sat',
          opens: {
            h: 9,
            m: 0,
            pm: false,
          },
          closes: {
            h: 6,
            m: 0,
            pm: true,
          },
        },
      ],
    },
  },
  recommendations: [makeRecommendation('alternativeSubstitution')],
  bestPrice: '',
};

export const claimAlertMock: IPendingPrescriptionsList = {
  identifier: '',
  prescriptions: [mockPrescriptions],
};
