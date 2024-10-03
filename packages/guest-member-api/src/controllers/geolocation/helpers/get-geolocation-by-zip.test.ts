// Copyright 2021 Prescryptive Health, Inc.

import { getGeolocationByZip } from './get-geolocation-by-zip';

describe('getGeolocationByZip', () => {
  it('should return correct location', () => {
    const nearbyLocation = getGeolocationByZip('48834');
    expect(nearbyLocation.city).toBe('Fenwick');
    expect(nearbyLocation.latitude).toBe(43.141649);
    expect(nearbyLocation.longitude).toBe(-85.04948);
    expect(nearbyLocation.state).toBe('MI');
    expect(nearbyLocation.zipCode).toBe('48834');
  });
});
