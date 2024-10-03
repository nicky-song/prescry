// Copyright 2022 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../models/location-coordinates';

export const formatUserLocation = (
  location?: ILocationCoordinates
): string | undefined => {
  if (location?.fullAddress) {
    return location.fullAddress;
  }

  if (location?.city && location?.state) {
    return `${location.city}, ${location.state}`;
  }

  if (location?.city) {
    return location.city;
  }

  if (location?.state) {
    return location.state;
  }

  return undefined;
};
