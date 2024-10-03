// Copyright 2022 Prescryptive Health, Inc.

import { IDrugSearchAction } from './drug-search.action';

export type ISetIsGettingPharmaciesAction =
  IDrugSearchAction<'SET_IS_GETTING_PHARMACIES'>;
export const setIsGettingPharmaciesAction = (
  isGettingPharmacies: boolean
): ISetIsGettingPharmaciesAction => ({
  type: 'SET_IS_GETTING_PHARMACIES',
  payload: {
    isGettingPharmacies,
  },
});
