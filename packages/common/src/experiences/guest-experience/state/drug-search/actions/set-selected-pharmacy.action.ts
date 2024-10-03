// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';
import { IDrugSearchAction } from './drug-search.action';

export type ISetSelectedPharmacyAction = IDrugSearchAction<
  'SET_SELECTED_PHARMACY'
>;

export const setSelectedPharmacyAction = (
  selectedPharmacy: IPharmacyDrugPrice
): ISetSelectedPharmacyAction => ({
  type: 'SET_SELECTED_PHARMACY',
  payload: {
    selectedPharmacy,
  },
});
