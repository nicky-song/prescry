// Copyright 2023 Prescryptive Health, Inc.

import { IPricingOptionSelectorOption } from '../components/buttons/pricing-option-group/pricing-option-group';
import { IDualDrugPrice } from '../models/drug-price';
import { PricingOption } from '../models/pricing-option';

export const getPricingOptionType = (
  dualPrice?: IDualDrugPrice
): PricingOption => {
  if (dualPrice === undefined) return 'noPrice';
  else if (
    dualPrice?.smartPriceMemberPays !== undefined &&
    dualPrice?.pbmMemberPays === undefined &&
    dualPrice?.pbmPlanPays === undefined
  )
    return 'smartPrice';
  else if (
    dualPrice?.pbmPlanPays !== undefined &&
    dualPrice?.pbmMemberPays !== undefined
  )
    return 'pbm';
  else return 'thirdParty';
};

export const shouldNavigateToPricingOption = (
  dualPrice?: IDualDrugPrice
): boolean => {
  if (
    dualPrice &&
    ((dualPrice?.smartPriceMemberPays !== undefined &&
      dualPrice?.pbmMemberPays !== undefined) ||
      (dualPrice?.pbmPlanPays !== undefined &&
        dualPrice?.pbmMemberPays !== undefined &&
        dualPrice?.smartPriceMemberPays !== undefined) ||
      (dualPrice?.pbmPlanPays !== undefined &&
        dualPrice?.smartPriceMemberPays !== undefined))
  )
    return true;
  return false;
};

export const getOptions = (dualPrice?: IDualDrugPrice) => {
  const result: IPricingOptionSelectorOption[] = [];

  if (
    dualPrice?.pbmType === 'thirdParty' &&
    dualPrice?.pbmMemberPays !== undefined
  ) {
    result.push({
      pricingOption: 'thirdParty',
      memberPays: dualPrice.pbmMemberPays,
    });
  }

  if (
    dualPrice?.pbmType === 'phx' &&
    dualPrice?.pbmMemberPays !== undefined &&
    dualPrice?.pbmPlanPays !== undefined
  ) {
    result.push({
      pricingOption: 'pbm',
      memberPays: dualPrice.pbmMemberPays,
      planPays: dualPrice.pbmPlanPays,
    });
  }

  if (dualPrice?.smartPriceMemberPays !== undefined) {
    result.push({
      pricingOption: 'smartPrice',
      memberPays: dualPrice.smartPriceMemberPays,
    });
  }

  return result;
};

export const lowestPriceOption = (options: IPricingOptionSelectorOption[]) => {
  return options.reduce((acc, curr) => {
    return curr.memberPays < acc.memberPays ? curr : acc;
  }, options[0]);
};
