// Copyright 2021 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { ISessionAction } from './session.action';

export type IUserCoordinatesSetAction = ISessionAction<'USER_LOCATION_SET'>;

export const userLocationSetAction = (
  userLocation?: ILocationCoordinates
): IUserCoordinatesSetAction => ({
  type: 'USER_LOCATION_SET',
  payload: {
    userLocation,
  },
});
