// Copyright 2022 Prescryptive Health, Inc.

import { ShoppingDispatch } from './shopping.dispatch';
import { setIsGettingPharmaciesAction } from '../actions/set-is-getting-pharmacies.action';

export const setIsGettingPharmaciesDispatch = (
  dispatch: ShoppingDispatch,
  isGettingPharmacies: boolean
): void => {
  dispatch(setIsGettingPharmaciesAction(isGettingPharmacies));
};
