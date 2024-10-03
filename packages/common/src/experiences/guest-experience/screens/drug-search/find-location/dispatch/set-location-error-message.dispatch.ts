// Copyright 2022 Prescryptive Health, Inc.

import { setLocationErrorMessageAction } from '../actions/set-location-error-message.action';
import { FindLocationDispatch } from './find-location.dispatch';

export const setLocationErrorMessageDispatch = (
  dispatch: FindLocationDispatch,
  locationErrorMessage?: string
): void => {
  dispatch(setLocationErrorMessageAction(locationErrorMessage));
};
