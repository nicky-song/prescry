// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacy } from '../../../../../models/pharmacy';
import { pharmaciesByZipcodeAppendAction } from '../actions/pharmacies-by-zip-code-append.action';
import { pharmaciesByZipcodeSetAction } from '../actions/pharmacies-by-zip-code-set.action';
import { DrugSearchDispatch } from './drug-search.dispatch';

export const setPharmaciesByZipCodeDispatch = (
  dispatch: DrugSearchDispatch,
  pharmacies: IPharmacy[],
  hasPreviousPharmacies?: boolean
): void => {
  if (hasPreviousPharmacies) {
    dispatch(pharmaciesByZipcodeAppendAction(pharmacies));
  } else {
    dispatch(pharmaciesByZipcodeSetAction(pharmacies));
  }
};
