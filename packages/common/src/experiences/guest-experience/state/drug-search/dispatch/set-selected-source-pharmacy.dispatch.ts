// Copyright 2021 Prescryptive Health, Inc.

import { DrugSearchDispatch } from './drug-search.dispatch';
import { IPharmacy } from '../../../../../models/pharmacy';
import { setSelectedSourcePharmacyAction } from '../actions/set-selected-source-pharmacy.action';

export const setSelectedSourcePharmacyDispatch = (
  dispatch: DrugSearchDispatch,
  selectedSourcePharmacy: IPharmacy
): void => {
  dispatch(setSelectedSourcePharmacyAction(selectedSourcePharmacy));
};
