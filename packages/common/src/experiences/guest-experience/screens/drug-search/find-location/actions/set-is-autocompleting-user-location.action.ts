// Copyright 2022 Prescryptive Health, Inc.

import { IFindLocationAction } from './find-location.action';

export type ISetIsAutocompletingUserLocationAction =
  IFindLocationAction<'SET_IS_AUTOCOMPLETING_USER_LOCATION'>;

export const setIsAutocompletingUserLocationsAction = (
  isAutocompletingUserLocation: boolean
): ISetIsAutocompletingUserLocationAction => ({
  type: 'SET_IS_AUTOCOMPLETING_USER_LOCATION',
  payload: {
    isAutocompletingUserLocation,
  },
});
