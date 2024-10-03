// Copyright 2021 Prescryptive Health, Inc.

import { ILocationCoordinates } from '@phx/common/src/models/location-coordinates';
import { zipCodes } from '../../../static/json/json-resources';

export const getGeolocationByZip = (zipCode: string) => {
  const storedLocation = zipCodes.find(
    (coordinates: ILocationCoordinates) => coordinates.zipCode === zipCode
  );

  return storedLocation;
};
