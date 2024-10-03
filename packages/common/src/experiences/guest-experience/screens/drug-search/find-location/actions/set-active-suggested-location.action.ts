// Copyright 2022 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../../../models/location-coordinates';
import { IFindLocationAction } from './find-location.action';

export type ISetActiveSuggestedLocationAction =
  IFindLocationAction<'SET_ACTIVE_SUGGESTED_LOCATION'>;

export const setActiveSuggestedLocationAction = (
  activeSuggestedLocation?: ILocationCoordinates
): ISetActiveSuggestedLocationAction => ({
  type: 'SET_ACTIVE_SUGGESTED_LOCATION',
  payload: {
    activeSuggestedLocation,
  },
});
