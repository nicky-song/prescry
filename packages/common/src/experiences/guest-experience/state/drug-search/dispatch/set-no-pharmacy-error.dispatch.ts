// Copyright 2021 Prescryptive Health, Inc.

import { IDrugSearchAction } from '../actions/drug-search.action';
import { DrugSearchDispatch } from './drug-search.dispatch';

export type ISetNoPharmacyErrorAction = IDrugSearchAction<
  'SET_NO_PHARMACY_ERROR'
>;

export const setNoPharmacyErrorAction = (
  noPharmaciesFound: boolean
): ISetNoPharmacyErrorAction => ({
  type: 'SET_NO_PHARMACY_ERROR',
  payload: {
    noPharmaciesFound,
  },
});

export const setNoPharmacyErrorDispatch = (
  dispatch: DrugSearchDispatch,
  noPharmaciesFound: boolean
): void => {
  dispatch(setNoPharmacyErrorAction(noPharmaciesFound));
};
