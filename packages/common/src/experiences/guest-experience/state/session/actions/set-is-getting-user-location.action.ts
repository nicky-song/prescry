// Copyright 2021 Prescryptive Health, Inc.

import { ISessionAction } from './session.action';

export type ISetIsGettingUserLocationAction =
  ISessionAction<'SET_IS_GETTING_USER_LOCATION'>;

export const setIsGettingUserLocationAction = (
  isGettingUserLocation: boolean
): ISetIsGettingUserLocationAction => ({
  type: 'SET_IS_GETTING_USER_LOCATION',
  payload: {
    isGettingUserLocation,
  },
});
