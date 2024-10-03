// Copyright 2021 Prescryptive Health, Inc.

import { DrugSearchDispatch } from './drug-search.dispatch';
import { setSelectedPharmacyAction } from '../actions/set-selected-pharmacy.action';
import { IPharmacyDrugPrice } from '../../../../../models/pharmacy-drug-price';

export const setSelectedPharmacyDispatch = (
  dispatch: DrugSearchDispatch,
  selectedPharmacy: IPharmacyDrugPrice
): void => {
  dispatch(setSelectedPharmacyAction(selectedPharmacy));
};
