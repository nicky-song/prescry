// Copyright 2022 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../../../models/location-coordinates';
import { setActiveSuggestedLocationAction } from '../actions/set-active-suggested-location.action';
import { FindLocationDispatch } from './find-location.dispatch';

export const setActiveSuggestedLocationDispatch = (
  dispatch: FindLocationDispatch,
  location?: ILocationCoordinates
): void => {
  dispatch(setActiveSuggestedLocationAction(location));
};
