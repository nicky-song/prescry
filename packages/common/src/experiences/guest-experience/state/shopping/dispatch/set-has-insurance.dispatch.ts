// Copyright 2022 Prescryptive Health, Inc.

import { ShoppingDispatch } from './shopping.dispatch';
import { setHasInsuranceAction } from '../actions/set-has-insurance.action';

export const setHasInsuranceDispatch = (
  dispatch: ShoppingDispatch,
  hasInsurance?: boolean
): void => {
  dispatch(setHasInsuranceAction(hasInsurance));
};
