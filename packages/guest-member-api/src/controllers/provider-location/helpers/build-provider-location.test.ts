// Copyright 2020 Prescryptive Health, Inc.

import { IProviderLocationDetails } from '@phx/common/src/models/api-response/provider-location-response';
import { IProviderLocationListItem } from '../../../models/pharmacy-portal/get-provider-location.response';
import { buildProviderLocation } from './build-provider-location';

const providerLocationMock = {
  id: 'id-1',
  providerName: 'provider',
  locationName: 'test-location',
  address: {
    line1: 'mock-address1',
    line2: 'mock-address2',
    city: 'mock-city',
    state: 'mock-state',
    zipCode: 'mock-zip',
  },
  phoneNumber: 'mock-phone',
  distanceMiles: 10.88447583,
  priceCents: '2500',
} as IProviderLocationListItem;

describe('buildProviderLocation', () => {
  it('Should build provider location based on the endpoint response', () => {
    const providerLocationResponseMock = {
      id: 'id-1',
      providerName: 'provider',
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      distance: 10.88,
      phoneNumber: 'mock-phone',
      price: '2500',
    } as IProviderLocationDetails;

    const providerResponse = buildProviderLocation(providerLocationMock);
    expect(providerResponse).toStrictEqual(providerLocationResponseMock);
  });

  it('Should return 0 distance if distance is not present', () => {
    const providerLocationNoDistanceMock = {
      ...providerLocationMock,
      distanceMiles: undefined,
    } as IProviderLocationListItem;
    const providerLocationResponseMock = {
      id: 'id-1',
      providerName: 'provider',
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      distance: 0,
      phoneNumber: 'mock-phone',
      price: '2500',
    };
    const providerResponse = buildProviderLocation(
      providerLocationNoDistanceMock
    );
    expect(providerResponse).toStrictEqual(providerLocationResponseMock);
  });

  it('Should return undefined price if distance is not present', () => {
    const providerLocationNoPriceMock = {
      ...providerLocationMock,
      priceCents: undefined,
    } as IProviderLocationListItem;
    const providerLocationResponseMock = {
      id: 'id-1',
      providerName: 'provider',
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      distance: 10.88,
      phoneNumber: 'mock-phone',
      price: undefined,
    };

    const providerResponse = buildProviderLocation(providerLocationNoPriceMock);
    expect(providerResponse).toStrictEqual(providerLocationResponseMock);
  });
});
