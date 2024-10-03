// Copyright 2022 Prescryptive Health, Inc.

import { IRecommendation } from '@phx/common/src/models/recommendation';
import { IPharmacyOffer } from '@phx/common/src/models/pharmacy-offer';
import { IMedication } from '@phx/common/src/models/medication';

import {
  IRecommendationGenericSubstitutionRule,
  IRecommendationAlternativesSubstitutionRule,
} from '@phx/common/src/models/recommendation';

export const recommendationsMock = [
  {
    identifier: '631b8f39116cf079b2e663f1',
    type: 'genericSubstitution',
    savings: 151.08,
    rule: {
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
      },
      type: 'genericSubstitution',
      description: 'Admelog SoloStar to Insulin Lispro (1 Unit Dial)',
      genericSubstitution: {
        toMedication: {
          form: 'Solution Pen-injector',
          genericName: 'Insulin Lispro (1 Unit Dial)',
          genericProductId: '2710400500D222',
          isGeneric: true,
          medicationId: '00002822259',
          name: 'Insulin Lispro (1 Unit Dial)',
          strength: '100',
          units: 'UNIT/ML',
        },
        to: {
          medication: {
            form: 'Solution Pen-injector',
            genericName: 'Insulin Lispro (1 Unit Dial)',
            genericProductId: '2710400500D222',
            isGeneric: true,
            medicationId: '00002822259',
            name: 'Insulin Lispro (1 Unit Dial)',
            strength: '100',
            units: 'UNIT/ML',
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
        savings: '151.08',
        planSavings: '0.0',
      },
      minimumSavingsAmount: '1.0',
      minimumPlanSavingsAmount: '20.0',
    },
  },
  {
    identifier: '631b8f39116cf079b2e663f2',
    type: 'alternativeSubstitution',
    savings: 150.43,
    rule: {
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
      },
      type: 'alternativeSubstitution',
      description: 'Admelog SoloStar to alternative',
      alternativeSubstitution: {
        toMedications: [
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
        ],
        to: [
          {
            medication: {
              form: 'Solution Cartridge',
              genericName: 'Insulin Lispro',
              genericProductId: '2710400500E220',
              isGeneric: false,
              medicationId: '00002751659',
              name: 'HumaLOG',
              strength: '100',
              units: 'UNIT/ML',
            },
            fillOptions: {
              count: 2.0,
              daysSupply: 30.0,
              authorizedRefills: 6.0,
              fillNumber: 0.0,
            },
            price: {
              pharmacyCashPrice: 69.85,
              planCoveragePays: 62.86,
              memberPaysOffer: 6.99,
              memberPaysShipping: 0.0,
              memberPaysTotal: 6.99,
            },
          },
        ],
        savings: '150.43',
        planSavings: '0.0',
      },
      minimumSavingsAmount: '1.0',
      minimumPlanSavingsAmount: '20.0',
    },
  },
  {
    identifier: '631b8f39116cf079b2e663f3',
    type: 'alternativeSubstitution',
    savings: 150.17,
    rule: {
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
      },
      type: 'alternativeSubstitution',
      description: 'Admelog SoloStar to alternative',
      alternativeSubstitution: {
        toMedications: [
          {
            form: 'Solution Pen-injector',
            genericName: 'Insulin Lispro (1 Unit Dial)',
            genericProductId: '2710400500D222',
            isGeneric: false,
            medicationId: '00002879959',
            name: 'HumaLOG KwikPen',
            strength: '100',
            units: 'UNIT/ML',
          },
        ],
        to: [
          {
            medication: {
              form: 'Solution Pen-injector',
              genericName: 'Insulin Lispro (1 Unit Dial)',
              genericProductId: '2710400500D222',
              isGeneric: false,
              medicationId: '00002879959',
              name: 'HumaLOG KwikPen',
              strength: '100',
              units: 'UNIT/ML',
            },
            fillOptions: {
              count: 2.0,
              daysSupply: 30.0,
              authorizedRefills: 6.0,
              fillNumber: 0.0,
            },
            price: {
              pharmacyCashPrice: 72.54,
              planCoveragePays: 65.29,
              memberPaysOffer: 7.25,
              memberPaysShipping: 0.0,
              memberPaysTotal: 7.25,
            },
          },
        ],
        savings: '150.17',
        planSavings: '0.0',
      },
      minimumSavingsAmount: '1.0',
      minimumPlanSavingsAmount: '20.0',
    },
  },
] as unknown as IRecommendation[];

export const offersMock: IPharmacyOffer[] = [
  {
    offerId: '631b8f36116cf079b2e663ed',
    daysSupply: 30.0,
    hasDriveThru: false,
    isBrand: true,
    pharmacyNcpdp: '4921979',
    price: {
      pharmacyCashPrice: 0,
      planCoveragePays: 157.42,
      memberPaysOffer: 157.42,
      memberPaysShipping: 0,
      memberPaysTotal: 157.42,
    },
    type: 'retail',
    sort: {
      distance: 0.9,
      price: 157.42,
    },
  },
  {
    offerId: 'f072aa22-d63e-4c48-b5b6-b5dfd3ab876c',

    hasDriveThru: false,
    isBrand: true,
    pharmacyNcpdp: '4921979',
    price: {
      pharmacyCashPrice: 6.34,
      planCoveragePays: 0.0,
      memberPaysOffer: 6.34,
      memberPaysShipping: 0.0,
      memberPaysTotal: 6.34,
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
  {
    offerId: 'e08cbfbe-96c3-4a55-abf9-6a6ddb167c5a',

    hasDriveThru: false,
    isBrand: true,
    pharmacyNcpdp: '4921979',
    price: {
      pharmacyCashPrice: 69.85,
      planCoveragePays: 62.86,
      memberPaysOffer: 6.99,
      memberPaysShipping: 0.0,
      memberPaysTotal: 6.99,
    },
    type: 'retail',
    recommendation: {
      identifier: '631b8f39116cf079b2e663f2',
      index: 0,
    },
    sort: {
      distance: 0.9,
      price: 157.42,
    },
  },
  {
    offerId: '62e39b08-1bb5-42de-858a-eb2cec857fc4',

    hasDriveThru: false,
    isBrand: true,
    pharmacyNcpdp: '4921979',
    price: {
      pharmacyCashPrice: 72.54,
      planCoveragePays: 65.29,
      memberPaysOffer: 7.25,
      memberPaysShipping: 0.0,
      memberPaysTotal: 7.25,
    },
    type: 'retail',
    recommendation: {
      identifier: '631b8f39116cf079b2e663f3',
      index: 0,
    },
    sort: {
      distance: 0.9,
      price: 157.42,
    },
  },
];

const mockMedication = {
  form: 'Solution Pen-injector',
  genericName: 'Insulin Lispro (1 Unit Dial)',
  genericProductId: '2710400500D222',
  isGeneric: false,
  medicationId: '00024592505',
  name: 'Admelog SoloStar',
  strength: '100',
  units: 'UNIT/ML',
  drugTierType: null,
  drugTie: null,
};

// TODO: M.Meletti - Rename this
export const mockMedication2: IMedication = {
  form: 'cap',
  genericName: '',
  genericProductId: '',
  isGeneric: false,
  medicationId: '12345',
  name: 'FakeMeds1',
  strength: '300',
  units: 'mg',
};

const mockTo = {
  medication: mockMedication,
  fillOptions: {
    count: 2.0,
    daysSupply: 30.0,
    authorizedRefills: 6.0,
    fillNumber: 0.0,
  },
  price: {
    pharmacyCashPrice: 69.85,
    planCoveragePays: 62.86,
    memberPaysOffer: 6.99,
    memberPaysShipping: 0.0,
    memberPaysTotal: 6.99,
  },
};

export const mockGeneric: IRecommendationGenericSubstitutionRule = {
  toMedication: mockMedication,
  to: mockTo,
  // TODO: update to number when contract is fixed
  savings: '11',
  planSavings: '10',
};

export const mockAlternative: IRecommendationAlternativesSubstitutionRule = {
  toMedications: [mockMedication],
  to: [mockTo],
  savings: '11',
  planSavings: '10',
};

export const recommendationMockPlan: IRecommendation = {
  identifier: '631b8f39116cf079b2e663f3',
  type: 'alternativeSubstitution',
  savings: 150.17,
  rule: {
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
    },
    type: 'alternativeSubstitution',
    description: 'Admelog SoloStar to alternative',
    alternativeSubstitution: {
      toMedications: [
        {
          form: 'Solution Pen-injector',
          genericName: 'Insulin Lispro (1 Unit Dial)',
          genericProductId: '2710400500D222',
          isGeneric: false,
          medicationId: '00002879959',
          name: 'HumaLOG KwikPen',
          strength: '100',
          units: 'UNIT/ML',
        },
      ],
      to: [
        {
          medication: {
            form: 'Solution Pen-injector',
            genericName: 'Insulin Lispro (1 Unit Dial)',
            genericProductId: '2710400500D222',
            isGeneric: false,
            medicationId: '00002879959',
            name: 'HumaLOG KwikPen',
            strength: '100',
            units: 'UNIT/ML',
          },
          fillOptions: {
            count: 2.0,
            daysSupply: 30.0,
            authorizedRefills: 6.0,
            fillNumber: 0.0,
          },
        },
      ],
      savings: '0.99',
      planSavings: '20.01',
    },
    minimumSavingsAmount: '1.0',
    minimumPlanSavingsAmount: '20.0',
  },
};
