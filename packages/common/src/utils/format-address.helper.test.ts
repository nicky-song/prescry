// Copyright 2022 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../models/location-coordinates';
import { formatUserLocation } from './format-address.helper';

const locationMock: ILocationCoordinates = {
  fullAddress: '680 W Beaufort Rd Beaufort, North Carolina(NC), 28516',
  zipCode: '28516',
  city: 'Beaufort',
  state: 'North Carolina',
};

describe('formatAddress', () => {
  it('returns the fullAddress when exists', () => {
    const address = formatUserLocation(locationMock);
    expect(address).toEqual(locationMock.fullAddress);
  });

  it('returns the city, state when fullAddress does not exist', () => {
    const address = formatUserLocation({
      ...locationMock,
      fullAddress: '',
    });
    expect(address).toEqual(`${locationMock.city}, ${locationMock.state}`);
  });

  it('returns the city when state does not exist', () => {
    const address = formatUserLocation({
      ...locationMock,
      fullAddress: '',
      state: '',
    });
    expect(address).toEqual(locationMock.city);
  });

  it('returns the state when city does not exist', () => {
    const address = formatUserLocation({
      ...locationMock,
      fullAddress: '',
      city: '',
    });
    expect(address).toEqual(locationMock.state);
  });

  it('returns the state when city does not exist', () => {
    const address = formatUserLocation({
      ...locationMock,
      fullAddress: '',
      city: '',
      state: '',
    });
    expect(address).toEqual(undefined);
  });
});
