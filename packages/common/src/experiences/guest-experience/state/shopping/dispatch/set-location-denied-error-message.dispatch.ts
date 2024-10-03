// Copyright 2022 Prescryptive Health, Inc.

import { setLocationDeniedErrorMessageAction } from '../actions/set-location-denied-error-message.action';
import { ShoppingDispatch } from './shopping.dispatch';

export const setLocationDeniedErrorMessageDispatch = (
  dispatch: ShoppingDispatch,
  error?: string
): void => {
  dispatch(setLocationDeniedErrorMessageAction(error));
};
