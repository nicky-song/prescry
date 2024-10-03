// Copyright 2021 Prescryptive Health, Inc.

import { setIsGettingUserLocationAction } from '../actions/set-is-getting-user-location.action';
import { SessionDispatch } from './session.dispatch';

export const setIsGettingUserLocationDispatch = (
  dispatch: SessionDispatch,
  isGettingUserLocation: boolean
): void => {
  dispatch(setIsGettingUserLocationAction(isGettingUserLocation));
};
