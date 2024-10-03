// Copyright 2022 Prescryptive Health, Inc.

import { DrugSearchDispatch } from './drug-search.dispatch';
import { setLocationDeniedErrorMessageAction } from '../actions/set-location-denied-error-message.action';

export const setLocationDeniedErrorMessageDispatch = (
  dispatch: DrugSearchDispatch,
  error?: string
): void => {
  dispatch(setLocationDeniedErrorMessageAction(error));
};
