// Copyright 2022 Prescryptive Health, Inc.

import { setIsAutocompletingUserLocationsAction } from '../actions/set-is-autocompleting-user-location.action';
import { FindLocationDispatch } from './find-location.dispatch';

export const setIsAutocompletingUserLocationDispatch = (
  dispatch: FindLocationDispatch,
  isAutocompletingUserLocation: boolean
): void => {
  dispatch(
    setIsAutocompletingUserLocationsAction(isAutocompletingUserLocation)
  );
};
