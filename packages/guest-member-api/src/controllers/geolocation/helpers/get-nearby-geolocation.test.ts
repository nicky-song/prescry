// Copyright 2021 Prescryptive Health, Inc.

import { assertIsDefined } from '@phx/common/src/assertions/assert-is-defined';
import { ILocationCoordinates } from '@phx/common/src/models/location-coordinates';
import { zipCodes } from '../../../static/json/json-resources';
import { getNearbyGeolocation } from './get-nearby-geolocation';

jest.mock('geolib');

jest.mock('@phx/common/src/assertions/assert-is-defined');
const assertIsDefinedMock = assertIsDefined as jest.Mock;

describe('getNearbyLocation', () => {
  it('asserts that zip code location latitude and longitude are defined', () => {
    getNearbyGeolocation(49, -128);

    const storedLocations = zipCodes as ILocationCoordinates[];
    expect(assertIsDefinedMock).toHaveBeenCalledTimes(
      2 * storedLocations.length
    );

    storedLocations.forEach((location, index) => {
      expect(assertIsDefinedMock).toHaveBeenNthCalledWith(
        index * 2 + 1,
        location.latitude
      );
      expect(assertIsDefinedMock).toHaveBeenNthCalledWith(
        index * 2 + 2,
        location.longitude
      );
    });
  });

  it('should return correct location with user-entered coordinates', () => {
    const currentLatitude = 43;
    const currentLongitude = -85;
    const nearbyLocation = getNearbyGeolocation(
      currentLatitude,
      currentLongitude
    );
    expect(nearbyLocation.city).toBe('Fenwick');
    expect(nearbyLocation.latitude).toBe(43);
    expect(nearbyLocation.longitude).toBe(-85);
    expect(nearbyLocation.state).toBe('MI');
    expect(nearbyLocation.zipCode).toBe('48834');
  });
});
