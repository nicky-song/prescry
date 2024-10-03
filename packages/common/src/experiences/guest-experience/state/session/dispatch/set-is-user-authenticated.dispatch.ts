// Copyright 2021 Prescryptive Health, Inc.

import { setIsUserAuthenticatedAction } from '../actions/set-is-user-authenticated.action';
import { SessionDispatch } from './session.dispatch';

export const setIsUserAuthenticatedDispatch = (
  dispatch: SessionDispatch,
  isUserAuthenticated: boolean
): void => {
  dispatch(setIsUserAuthenticatedAction(isUserAuthenticated));
};
