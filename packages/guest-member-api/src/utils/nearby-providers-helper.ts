// Copyright 2020 Prescryptive Health, Inc.

import { IProviderLocation } from '@phx/common/src/models/provider-location';
import { getDistance, isPointWithinRadius } from 'geolib';
import { convertUnits } from './unit-conversion.helper';

export type PharmacyItem = {
  item: IProviderLocation & Document;
  distance: number;
};

export function getNearbyProviderLocations(
  providers: IProviderLocation[],
  currentLatitude: number,
  currentLongitude: number,
  maxDistanceMiles: number
): PharmacyItem[] {
  const locations: PharmacyItem[] = [];
  const maxDistanceMeters = convertUnits(maxDistanceMiles, 'miles', 'meters');
  providers.forEach((provider) => {
    if (
      provider.latitude &&
      provider.longitude &&
      isNearBy(provider, currentLatitude, currentLongitude, maxDistanceMeters)
    ) {
      const distanceFromZipcode = Number(
        convertUnits(
          getDistance(
            { latitude: currentLatitude, longitude: currentLongitude },
            { latitude: provider.latitude, longitude: provider.longitude }
          ),
          'meters',
          'miles'
        ).toFixed(2)
      );
      const item: PharmacyItem = {
        item: provider,
        distance: distanceFromZipcode,
      };
      locations.push(item);
    }
  });
  locations.sort((a, b) => {
    return a.distance - b.distance;
  });
  return locations;
}

export function isNearBy(
  provider: IProviderLocation,
  currentLatitude: number,
  currentLongitude: number,
  maxDistanceMeters: number
) {
  return provider.latitude && provider.longitude
    ? isPointWithinRadius(
        { latitude: currentLatitude, longitude: currentLongitude },
        { latitude: provider.latitude, longitude: provider.longitude },
        maxDistanceMeters
      )
    : false;
}
