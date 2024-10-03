// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacy } from '../../../../../models/pharmacy';
import { IDrugSearchAction } from './drug-search.action';

export type ISetSelectedPharmacyAction = IDrugSearchAction<
  'SET_SELECTED_SOURCE_PHARMACY'
>;

export const setSelectedSourcePharmacyAction = (
  selectedSourcePharmacy: IPharmacy
): ISetSelectedPharmacyAction => ({
  type: 'SET_SELECTED_SOURCE_PHARMACY',
  payload: {
    selectedSourcePharmacy,
  },
});
