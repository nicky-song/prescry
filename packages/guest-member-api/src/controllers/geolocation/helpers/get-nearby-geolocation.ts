// Copyright 2021 Prescryptive Health, Inc.

import { getDistance } from 'geolib';
import { IUserLocation } from '../../../models/user-location';
import { ILocationCoordinates } from '@phx/common/src/models/location-coordinates';
import { zipCodes } from '../../../static/json/json-resources';
import { convertUnits } from '../../../utils/unit-conversion.helper';
import { assertIsDefined } from '@phx/common/src/assertions/assert-is-defined';

export const getNearbyGeolocation = (
  currentLatitude: number,
  currentLongitude: number
) => {
  const storedLocations: ILocationCoordinates[] = zipCodes;
  const locations: IUserLocation[] = [];
  storedLocations.forEach((storedLocation) => {
    assertIsDefined(storedLocation.latitude);
    assertIsDefined(storedLocation.longitude);

    const distanceFromZipCode = Number(
      convertUnits(
        getDistance(
          { latitude: currentLatitude, longitude: currentLongitude },
          {
            latitude: storedLocation.latitude,
            longitude: storedLocation.longitude,
          }
        ),
        'meters',
        'miles'
      ).toFixed(2)
    );
    const local: IUserLocation = {
      city: storedLocation.city ?? '',
      state: storedLocation.state ?? '',
      zipCode: storedLocation.zipCode ?? '',
      coordinates: {
        longitude: storedLocation.longitude,
        latitude: storedLocation.latitude,
      },
      distance: distanceFromZipCode,
    };
    locations.push(local);
  });

  locations.sort((a, b) => {
    return a.distance - b.distance;
  });
  const localCoordinates: ILocationCoordinates = {
    city: locations[0].city,
    zipCode: locations[0].zipCode,
    state: locations[0].state,
    latitude: currentLatitude,
    longitude: currentLongitude,
  };
  return localCoordinates;
};
