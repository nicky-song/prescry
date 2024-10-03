// Copyright 2021 Prescryptive Health, Inc.

import { IShoppingAction } from '../actions/shopping.action';
import { ShoppingDispatch } from './shopping.dispatch';

export type ISetNoPharmacyErrorAction = IShoppingAction<
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
  dispatch: ShoppingDispatch,
  noPharmaciesFound: boolean
): void => {
  dispatch(setNoPharmacyErrorAction(noPharmaciesFound));
};
