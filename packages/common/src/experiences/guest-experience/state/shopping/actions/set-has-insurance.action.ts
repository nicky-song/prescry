// Copyright 2022 Prescryptive Health, Inc.

import { IShoppingAction } from './shopping.action';

export type ISetHasInsuranceAction = IShoppingAction<'SET_HAS_INSURANCE'>;
export const setHasInsuranceAction = (
  hasInsurance?: boolean
): ISetHasInsuranceAction => ({
  type: 'SET_HAS_INSURANCE',
  payload: {
    hasInsurance,
  },
});
