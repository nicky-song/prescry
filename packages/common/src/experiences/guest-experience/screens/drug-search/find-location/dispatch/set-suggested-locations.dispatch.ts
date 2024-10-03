// Copyright 2022 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../../../models/location-coordinates';
import { suggestedLocationsSetAction } from '../actions/suggested-locations-set.action';
import { FindLocationDispatch } from './find-location.dispatch';

export const setSuggestedLocationsDispatch = (
  dispatch: FindLocationDispatch,
  locations?: ILocationCoordinates[]
): void => {
  dispatch(suggestedLocationsSetAction(locations));
};
