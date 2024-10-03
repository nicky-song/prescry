// Copyright 2022 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../../models/location-coordinates';

export interface IFindLocationState {
  isAutocompletingUserLocation: boolean;
  locationErrorMessage?: string;
  activeSuggestedLocation?: ILocationCoordinates;
  suggestedLocations?: ILocationCoordinates[];
}
