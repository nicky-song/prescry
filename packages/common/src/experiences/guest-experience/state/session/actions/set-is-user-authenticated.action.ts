// Copyright 2021 Prescryptive Health, Inc.

import { ISessionAction } from './session.action';

export type ISetIsUserAuthenticatedAction = ISessionAction<
  'SET_IS_USER_AUTHENTICATED'
>;

export const setIsUserAuthenticatedAction = (
  isUserAuthenticated: boolean
): ISetIsUserAuthenticatedAction => ({
  type: 'SET_IS_USER_AUTHENTICATED',
  payload: {
    isUserAuthenticated,
  },
});
