// Copyright 2020 Prescryptive Health, Inc.

import { IProviderLocation } from '@phx/common/src/models/provider-location';
import { getDistance, isPointWithinRadius } from 'geolib';

import {
  getNearbyProviderLocations,
  isNearBy,
  PharmacyItem,
} from './nearby-providers-helper';

const providerList = [
  {
    identifier: 'id-1',
    providerInfo: {
      providerName: 'provider',
    },
    locationName: 'test-location',
    address1: 'mock-address1',
    address2: 'mock-address2',
    city: 'mock-city',
    state: 'mock-state',
    zip: 'mock-zip',
    latitude: 10.1,
    longitude: 12.3,
    phoneNumber: 'mock-phone',
    timezone: 'America/Los_Angeles',
    serviceList: [
      {
        serviceName: 'fake-name',
        serviceDescription: 'fake-desc',
        questions: [],
        serviceType: 'COVID-19 Antigen Testing',
        screenTitle: 'screen1',
        screenDescription: 'screen-desc',
        confirmationTitle: 'confirm-title',
        confirmationDescription: 'confirm-desc',
        duration: 15,
        minLeadDays: 'P6D',
        maxLeadDays: 'P30D',
      },
      {
        serviceName: 'fake-name2',
        serviceDescription: 'fake-desc2',
        questions: [],
        serviceType: 'Other Testing',
        screenTitle: 'screen1',
        screenDescription: 'screen-desc',
        confirmationTitle: 'confirm-title',
        confirmationDescription: 'confirm-desc',
        duration: 15,
        minLeadDays: 'P6D',
        maxLeadDays: 'P30D',
      },
    ],
  },
  {
    identifier: 'id-2',
    providerInfo: {
      providerName: 'provider2',
    },
    locationName: 'test-location2',
    address1: 'mock2-address1',
    address2: 'mock2-address2',
    city: 'mock-city2',
    state: 'mock-state2',
    zip: 'mock-zip2',
    latitude: 10.2,
    longitude: 12.4,
    phoneNumber: 'mock-phone2',
    timezone: 'America/Los_Angeles',
  },
] as IProviderLocation[];

const pharmacyItemList = [
  {
    item: {
      identifier: 'id-1',
      providerInfo: {
        providerName: 'provider',
      },
      locationName: 'test-location',
      address1: 'mock-address1',
      address2: 'mock-address2',
      city: 'mock-city',
      state: 'mock-state',
      zip: 'mock-zip',
      latitude: 10.1,
      longitude: 12.3,
      phoneNumber: 'mock-phone',
      timezone: 'America/Los_Angeles',
      serviceList: [
        {
          serviceName: 'fake-name',
          serviceDescription: 'fake-desc',
          questions: [],
          serviceType: 'COVID-19 Antigen Testing',
          screenTitle: 'screen1',
          screenDescription: 'screen-desc',
          confirmationTitle: 'confirm-title',
          confirmationDescription: 'confirm-desc',
          duration: 15,
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
        },
        {
          serviceName: 'fake-name2',
          serviceDescription: 'fake-desc2',
          questions: [],
          serviceType: 'Other Testing',
          screenTitle: 'screen1',
          screenDescription: 'screen-desc',
          confirmationTitle: 'confirm-title',
          confirmationDescription: 'confirm-desc',
          duration: 15,
          minLeadDays: 'P6D',
          maxLeadDays: 'P30D',
        },
      ],
    },
    distance: 5,
  },
  {
    item: {
      identifier: 'id-2',
      providerInfo: {
        providerName: 'provider2',
      },
      locationName: 'test-location2',
      address1: 'mock2-address1',
      address2: 'mock2-address2',
      city: 'mock-city2',
      state: 'mock-state2',
      zip: 'mock-zip2',
      latitude: 10.2,
      longitude: 12.4,
      phoneNumber: 'mock-phone2',
      timezone: 'America/Los_Angeles',
    },
    distance: 7,
  },
] as PharmacyItem[];

const providerMissingLatitude = {
  identifier: 'id-2',
  providerInfo: {
    providerName: 'provider2',
  },
  locationName: 'test-location2',
  address1: 'mock2-address1',
  address2: 'mock2-address2',
  city: 'mock-city2',
  state: 'mock-state2',
  zip: 'mock-zip2',
  phoneNumber: 'mock-phone2',
  timezone: 'America/Los_Angeles',
  longitude: 12.3,
} as IProviderLocation;

const providerMissingLongitude = {
  identifier: 'id-3',
  providerInfo: {
    providerName: 'provider2',
  },
  locationName: 'test-location2',
  address1: 'mock2-address1',
  address2: 'mock2-address2',
  city: 'mock-city2',
  state: 'mock-state2',
  zip: 'mock-zip2',
  phoneNumber: 'mock-phone2',
  timezone: 'America/Los_Angeles',
  latitude: 10.1,
} as IProviderLocation;

const getDistanceMock = getDistance as jest.Mock<number>;
const isPointWithinRadiusMock = isPointWithinRadius as jest.Mock<boolean>;

beforeEach(() => {
  getDistanceMock.mockReset();
  isPointWithinRadiusMock.mockReset();
});

describe('getNearbyProviderLocations', () => {
  it('Should return all providers if within distance range', () => {
    isPointWithinRadiusMock.mockReturnValue(true);
    getDistanceMock
      .mockReturnValueOnce(5 * 1609.34)
      .mockReturnValueOnce(7 * 1609.34);
    const nearbyProviders = getNearbyProviderLocations(
      providerList,
      10,
      12.2,
      15
    );
    expect(getDistanceMock).toBeCalledTimes(2);
    expect(getDistanceMock).toBeCalledWith(
      { latitude: 10, longitude: 12.2 },
      { latitude: 10.1, longitude: 12.3 }
    );
    expect(getDistanceMock).toBeCalledWith(
      { latitude: 10, longitude: 12.2 },
      { latitude: 10.2, longitude: 12.4 }
    );

    expect(nearbyProviders).toStrictEqual(pharmacyItemList);
  });
  it('Should not return providers that are missing latitude or longitude', () => {
    isPointWithinRadiusMock.mockReturnValue(true);

    getDistanceMock.mockReturnValueOnce(5 * 1609.34);

    const nearbyProviders = getNearbyProviderLocations(
      [providerList[0], providerMissingLatitude, providerMissingLongitude],
      10,
      12.2,
      10
    );
    expect(getDistanceMock).toBeCalledTimes(1);
    expect(getDistanceMock).toBeCalledWith(
      { latitude: 10, longitude: 12.2 },
      { latitude: 10.1, longitude: 12.3 }
    );

    expect(nearbyProviders).toStrictEqual([pharmacyItemList[0]]);
  });
});

describe('isNearBy', () => {
  it('Should return true if provider within limit distance', () => {
    isPointWithinRadiusMock.mockReturnValue(true);
    const testIsNearby = isNearBy(providerList[0], 10, 12.2, 10);

    expect(isPointWithinRadiusMock).toBeCalledTimes(1);
    expect(isPointWithinRadiusMock).toBeCalledWith(
      { latitude: 10, longitude: 12.2 },
      { latitude: 10.1, longitude: 12.3 },
      10
    );
    expect(testIsNearby).toBe(true);
  });
  it('Should return false if provider not within limit distance', () => {
    isPointWithinRadiusMock.mockReturnValue(false);
    const testIsNearby = isNearBy(providerList[0], 10, 12.2, 10);

    expect(isPointWithinRadiusMock).toBeCalledTimes(1);
    expect(isPointWithinRadiusMock).toBeCalledWith(
      { latitude: 10, longitude: 12.2 },
      { latitude: 10.1, longitude: 12.3 },
      10
    );
    expect(testIsNearby).toBe(false);
  });
  it('Should return false if latitude missing', () => {
    isPointWithinRadiusMock.mockReturnValue(true);
    const testIsNearby = isNearBy(providerMissingLatitude, 10, 12.2, 10);

    expect(isPointWithinRadiusMock).not.toBeCalled();
    expect(testIsNearby).toBe(false);
  });
  it('Should return false if longitude missing', () => {
    isPointWithinRadiusMock.mockReturnValue(true);
    const testIsNearby = isNearBy(providerMissingLongitude, 10, 12.2, 10);

    expect(isPointWithinRadiusMock).not.toBeCalled();
    expect(testIsNearby).toBe(false);
  });
});
