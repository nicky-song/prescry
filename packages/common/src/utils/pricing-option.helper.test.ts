// Copyright 2023 Prescryptive Health, Inc.

import { IPricingOptionSelectorOption } from '../components/buttons/pricing-option-group/pricing-option-group';
import { IDualDrugPrice, PbmType } from '../models/drug-price';
import { PricingOption } from '../models/pricing-option';
import {
  getOptions,
  getPricingOptionType,
  lowestPriceOption,
  shouldNavigateToPricingOption,
} from './pricing-option.helper';

export const dualPriceMock1: IDualDrugPrice = {
  smartPriceMemberPays: 23,
  pbmType: 'none' as PbmType,
};

export const dualPriceMock2: IDualDrugPrice = {
  smartPriceMemberPays: 23,
  pbmType: 'phx',
  pbmMemberPays: 25,
  pbmPlanPays: 25,
};

export const dualPriceMock3: IDualDrugPrice = {
  smartPriceMemberPays: 23,
  pbmType: 'thirdParty',
  pbmMemberPays: 15,
};

export const expectedDualPriceMock1: IPricingOptionSelectorOption[] = [
  {
    memberPays: 23,
    pricingOption: 'smartPrice',
  },
];

export const expectedDualPriceMock2: IPricingOptionSelectorOption[] = [
  {
    memberPays: 25,
    pricingOption: 'pbm',
    planPays: 25,
  },
  {
    memberPays: 23,
    pricingOption: 'smartPrice',
  },
];

export const expectedDualPriceMock3: IPricingOptionSelectorOption[] = [
  {
    memberPays: 15,
    pricingOption: 'thirdParty',
  },
  {
    memberPays: 23,
    pricingOption: 'smartPrice',
  },
];

const inputOutputPairs: [
  IPricingOptionSelectorOption[],
  IPricingOptionSelectorOption
][] = [
  [expectedDualPriceMock2, expectedDualPriceMock2[1]],
  [expectedDualPriceMock3, expectedDualPriceMock3[0]],
];

describe('pricingOptionHelper', () => {
  it.each([
    [
      'smartPrice',
      {
        smartPriceMemberPays: 23,
        pbmType: 'none' as PbmType,
      },
    ],
    [
      'pbm',
      {
        smartPriceMemberPays: 23,
        pbmType: 'phx' as PbmType,
        pbmMemberPays: 25,
        pbmPlanPays: 25,
      },
    ],
    [
      'thirdParty',
      {
        smartPriceMemberPays: 23,
        pbmType: 'thirdParty' as PbmType,
        pbmMemberPays: 25,
      },
    ],
    ['noPrice', undefined],
  ])(
    'determines pricing option type (expected type: %p, dual price: %p)',
    (pricingOptionExptectedType: string, dualPrice?: IDualDrugPrice) => {
      expect(getPricingOptionType(dualPrice)).toEqual(
        pricingOptionExptectedType as PricingOption
      );
    }
  );

  it.each([
    [
      false,
      {
        smartPriceMemberPays: 23,
        pbmType: 'none' as PbmType,
      },
    ],
    [
      true,
      {
        smartPriceMemberPays: 23,
        pbmType: 'phx' as PbmType,
        pbmMemberPays: 25,
        pbmPlanPays: 25,
      },
    ],
    [
      false,
      {
        pbmType: 'phx' as PbmType,
        pbmMemberPays: 25,
        pbmPlanPays: 25,
      },
    ],
    [
      true,
      {
        smartPriceMemberPays: 23,
        pbmType: 'thirdParty' as PbmType,
        pbmMemberPays: 25,
      },
    ],
    [
      false,
      {
        pbmType: 'thirdParty' as PbmType,
        pbmMemberPays: 25,
      },
    ],
    [false, undefined],
  ])(
    'determines should navigate to pricing option screen (shouldNavigate: %p, dual price: %p)',
    (shouldNavigate: boolean, dualPrice?: IDualDrugPrice) => {
      expect(shouldNavigateToPricingOption(dualPrice)).toEqual(shouldNavigate);
    }
  );
});

describe('getOptionList', () => {
  it.each([
    [dualPriceMock1, expectedDualPriceMock1],
    [dualPriceMock2, expectedDualPriceMock2],
    [dualPriceMock3, expectedDualPriceMock3],
  ])(
    'returns array of options based on dualPrice data (dual price: %p)',
    (
      dualPrice?: IDualDrugPrice,
      expectedOptions?: IPricingOptionSelectorOption[]
    ) => {
      const result = getOptions(dualPrice);
      expect(result).toEqual(expectedOptions);
    }
  );
});

describe('lowestPriceOption', () => {
  it.each(inputOutputPairs)(
    'returns the option with the lowest memberPays for input %p',
    (
      input: IPricingOptionSelectorOption[],
      expectedOutput: IPricingOptionSelectorOption
    ) => {
      expect(lowestPriceOption(input)).toEqual(expectedOutput);
    }
  );
});
