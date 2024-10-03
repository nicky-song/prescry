// Copyright 2021 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { userLocationSetAction } from '../actions/user-location-set.action';
import { SessionDispatch } from './session.dispatch';

export const setUserLocationDispatch = (
  dispatch: SessionDispatch,
  location?: ILocationCoordinates
): void => {
  dispatch(userLocationSetAction(location));
};
