// Copyright 2022 Prescryptive Health, Inc.

import { DrugSearchDispatch } from './drug-search.dispatch';
import { setIsGettingPharmaciesAction } from '../actions/set-is-getting-pharmacies.action';

export const setIsGettingPharmaciesDispatch = (
  dispatch: DrugSearchDispatch,
  isGettingPharmacies: boolean
): void => {
  dispatch(setIsGettingPharmaciesAction(isGettingPharmacies));
};
