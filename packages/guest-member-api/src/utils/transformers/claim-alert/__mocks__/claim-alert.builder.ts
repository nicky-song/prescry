// Copyright 2022 Prescryptive Health, Inc.

import { IPendingPrescription } from '@phx/common/src/models/pending-prescription';
import { IMedication } from '@phx/common/src/models/medication';

// TODO: M.Meletti - Work in progress
export type sub = 'alternativeSubstitution' | 'genericSubstitution';

export type MockGenerationConfiguration = {
  isBestPrice: boolean;
  saver: boolean;
  alternateCount: number;
};

export const medications: IMedication[] = [
  {
    form: 'SOPN',
    genericName: 'Insulin Lispro (1 Unit Dial)',
    genericProductId: '2710400500D222',
    isGeneric: false,
    medicationId: '00024592505',
    name: 'Admelog SoloStar',
    strength: '100',
    units: 'UNIT/ML',
  },
  {
    form: 'Solution Pen-injector',
    genericName: 'Insulin Lispro (1 Unit Dial)',
    genericProductId: '2710400500D222',
    isGeneric: false,
    medicationId: '00024592505',
    name: 'Admelog SoloStar',
    strength: '100',
    units: 'UNIT/ML',
  },
  {
    form: 'Solution Cartridge',
    genericName: 'Insulin Lispro',
    genericProductId: '2710400500E220',
    isGeneric: false,
    medicationId: '00002751659',
    name: 'HumaLOG',
    strength: '100',
    units: 'UNIT/ML',
  },
  {
    form: 'Solution Pen-injector',
    genericName: 'Insulin Lispro (1 Unit Dial)',
    genericProductId: '2710400500D222',
    isGeneric: true,
    medicationId: '00002822259',
    name: 'Insulin Lispro (1 Unit Dial)',
    strength: '100',
    units: 'UNIT/ML',
  },
];

export const mockIdMap = {
  main: '631b8f36116cf079b2e663ed',
  medication: {},
  alternates: [
    {
      offerId: 'e08cbfbe-96c3-4a55-abf9-6a6ddb167c5a',
      recommendation: {
        identifier: '631b8f39116cf079b2e663f1',
      },
      alternativeType: 'alternativeSubstitution',
      medication: {},
    },
    {
      offerId: 'f072aa22-d63e-4c48-b5b6-b5dfd3ab876c',
      recommendation: {
        identifier: '631b8f39116cf079b2e663f2',
      },
      alternativeType: 'genericSubstitution',
      medication: {},
    },
  ],
};

export const buildPendingPrescriptionResponse = (
  config: MockGenerationConfiguration
) => {
  const responseIdentifier = '631b8f39116cf079b2e663f9';
  const listIdentifer = '631b8f39116cf079b2e663f8';
  const pendingPrescriptionList = {
    identifier: listIdentifer,
    prescriptions: makePrescriptions(config),
  };
  return { identifier: responseIdentifier, pendingPrescriptionList };
};

export const makePharmacy = () => {
  return {
    Id: '631b8f39116cf079b2e663ee',
    name: 'RITE AID PHARMACY # 05196                                   ',
    phone: '4257719427',
    email: 'JZOREK@RITEAID.COM                                ',
    address: {
      city: 'RITE AID PHARMACY # 05196                                   ',
      distance: null,
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
    type: 0,
    hasDriveThru: false,
    twentyFourHours: false,
    inNetwork: true,
    networkId: '1',
    nationalProviderIdentifier: '1437165727',
  };
};

export const makePrescriptions = (
  config: MockGenerationConfiguration
): IPendingPrescription[] => {
  const identifier = '';
  const confirmation = {
    offerId: identifier,
    orderNumber: '1234567890',
    orderDate: new Date(2022, 1, 2, 11, 1, 5, 5),
  };
  const medication = medications[0];

  const prescription = {
    expiresOn: '2022-10-09T19:08:41.4854573Z',
    fillOptions: [
      {
        count: 2.0,
        daysSupply: 30.0,
        authorizedRefills: 5.0,
        fillNumber: 0.0,
      },
    ],
    isNewPrescription: true,
    isPriorAuthRequired: null,
    lastFilledOn: null,
    prescribedOn: '2022-09-09T00:00:00',
    prescriber: {
      Id: '000000000000000000000000',
      name: null,
      phone: '',
      email: '',
      address: {
        city: '',
        distance: null,
        lineOne: '',
        lineTwo: '',
        state: '',
        zip: '',
      },
      ncpdp: '',
      hours: null,
      type: null,
      hasDriveThru: null,
      twentyFourHours: null,
      inNetwork: null,
      networkId: null,
      nationalProviderIdentifier: null,
    },
    referenceNumber: '1437165727-20220909113605435-0',
    sig: null,
  };

  const pharmacies = [makePharmacy()];
  const offers = makeOffers(config);
  const recommendations = makeRecommendations(config);

  return [
    {
      identifier,
      confirmation,
      medication,
      pharmacies,
      prescription,
      offers,
      recommendations,
    } as unknown as IPendingPrescription,
  ];
};

export const makeOffers = (config: MockGenerationConfiguration) => {
  const { isBestPrice, alternateCount, saver } = config;
  const price = 157.42;
  const discount = 150;
  const discountedPrice = price - discount;

  const altPrice = saver
    ? {
        pharmacyCashPrice: discountedPrice,
        planCoveragePays: 0.0,
        memberPaysOffer: discountedPrice,
        memberPaysShipping: 0.0,
        memberPaysTotal: discountedPrice,
      }
    : {
        pharmacyCashPrice: discountedPrice,
        planCoveragePays: discountedPrice,
        memberPaysOffer: 0.0,
        memberPaysShipping: 0.0,
        memberPaysTotal: 0.0,
      };

  const primaryOffer = {
    offerId: mockIdMap.main,
    daysSupply: 30.0,
    hasDriveThru: false,
    isBrand: true,
    pharmacyNcpdp: '4921979',
    price: {
      pharmacyCashPrice: null,
      planCoveragePays: 157.42,
      memberPaysOffer: 157.42,
      memberPaysShipping: null,
      memberPaysTotal: 157.42,
    },
    type: 0,
    recommendation: null,
    sort: {
      distance: 0.9,
      price,
    },
  };

  const alternativeOffers = !isBestPrice
    ? mockIdMap.alternates.slice(0, alternateCount).map((alt) => ({
        ...alt,
        daysSupply: null,
        hasDriveThru: false,
        isBrand: true,
        pharmacyNcpdp: '4921979',
        price: altPrice,
        type: 0,
        sort: {
          distance: 0.9,
          price: 157.42,
        },
      }))
    : [];
  return [primaryOffer, ...alternativeOffers];
};

export const makeRecommendations = (config: MockGenerationConfiguration) => {
  config.saver;
  const savingsTotals = config.saver
    ? { savings: 151.08, planSavings: 0.0 }
    : { savings: 0, planSavings: 21.0 };
  return !config.isBestPrice
    ? mockIdMap.alternates.slice(0, config.alternateCount).map((alt) => ({
        identifier: alt.recommendation.identifier,
        type: alt.alternativeType,
        savings: 151.08,
        rule: {
          identifier: '631a8629cec30a87a07c8753',
          notificationMessageTemplate:
            'Check the cost of your prescription: https://$(HOSTNAME)/$(IDENTIFIER)',
          planGroupNumber: 'HMA01',
          medication: {
            form: 'Solution Pen-injector',
            genericName: 'Insulin Lispro (1 Unit Dial)',
            genericProductId: '2710400500D222',
            isGeneric: false,
            medicationId: '00024592505',
            name: 'Admelog SoloStar',
            strength: '100',
            units: 'UNIT/ML',
            drugTierType: null,
            drugTier: null,
          },
          type: alt.alternativeType,
          description: 'Admelog SoloStar to Insulin Lispro (1 Unit Dial)',
          // [alt.alternativeType]: {
          alternativeSubstitution: {
            to: [
              {
                countMultiplier: null,
                daysSupplyMultiplier: null,
                refillsRemainingModifier: null,
                medication: {
                  form: 'Solution Pen-injector',
                  genericName: 'Insulin Lispro (1 Unit Dial)',
                  genericProductId: '2710400500D222',
                  isGeneric: true,
                  medicationId: '00002822259',
                  name: 'Insulin Lispro (1 Unit Dial)',
                  strength: '100',
                  units: 'UNIT/ML',
                  drugTierType: null,
                  drugTier: null,
                },
                fillOptions: {
                  count: 2.0,
                  daysSupply: 30.0,
                  authorizedRefills: 6.0,
                  fillNumber: 0.0,
                },
                price: {
                  pharmacyCashPrice: 6.34,
                  planCoveragePays: 0.0,
                  memberPaysOffer: 6.34,
                  memberPaysShipping: 0.0,
                  memberPaysTotal: 6.34,
                },
              },
            ],
            ...savingsTotals,
            // savings: 151.08,
            // planSavings: 0.0,
          },
          genericSubstitution: {
            to: {
              countMultiplier: null,
              daysSupplyMultiplier: null,
              refillsRemainingModifier: null,
              medication: {
                form: 'Solution Pen-injector',
                genericName: 'Insulin Lispro (1 Unit Dial)',
                genericProductId: '2710400500D222',
                isGeneric: true,
                medicationId: '00002822259',
                name: 'Insulin Lispro (1 Unit Dial)',
                strength: '100',
                units: 'UNIT/ML',
                drugTierType: null,
                drugTier: null,
              },
              fillOptions: {
                count: 2.0,
                daysSupply: 30.0,
                authorizedRefills: 6.0,
                fillNumber: 0.0,
              },
              price: {
                pharmacyCashPrice: 6.34,
                planCoveragePays: 0.0,
                memberPaysOffer: 6.34,
                memberPaysShipping: 0.0,
                memberPaysTotal: 6.34,
              },
            },
            ...savingsTotals,
            // savings: 151.08,
            // planSavings: 0.0,
          },

          minimumSavingsAmount: 1.0,
          minimumPlanSavingsAmount: 20.0,
        },
      }))
    : [];
};
