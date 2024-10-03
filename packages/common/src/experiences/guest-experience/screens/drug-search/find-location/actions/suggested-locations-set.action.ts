// Copyright 2022 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../../../models/location-coordinates';
import { IFindLocationAction } from './find-location.action';

export type ISuggestedLocationsSetAction =
  IFindLocationAction<'SUGGESTED_LOCATIONS_SET'>;

export const suggestedLocationsSetAction = (
  suggestedLocations?: ILocationCoordinates[]
): ISuggestedLocationsSetAction => ({
  type: 'SUGGESTED_LOCATIONS_SET',
  payload: {
    suggestedLocations,
  },
});
