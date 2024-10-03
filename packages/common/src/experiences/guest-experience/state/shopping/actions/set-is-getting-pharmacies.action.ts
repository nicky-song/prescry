// Copyright 2022 Prescryptive Health, Inc.

import { IShoppingAction } from './shopping.action';

export type ISetIsGettingPharmaciesAction =
  IShoppingAction<'SET_IS_GETTING_PHARMACIES'>;
export const setIsGettingPharmaciesAction = (
  isGettingPharmacies: boolean
): ISetIsGettingPharmaciesAction => ({
  type: 'SET_IS_GETTING_PHARMACIES',
  payload: {
    isGettingPharmacies,
  },
});
