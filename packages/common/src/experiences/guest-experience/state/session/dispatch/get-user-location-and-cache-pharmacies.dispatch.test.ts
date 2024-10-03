// Copyright 2021 Prescryptive Health, Inc.

import { GuestExperienceConfig } from '../../../guest-experience-config';
import { IGetUserLocationAsyncActionArgs } from '../async-actions/get-user-location.async-action';
import { locationCoordinatesMock } from '../../../__mocks__/location-coordinate.mock';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { setUserLocationDispatch } from './set-user-location.dispatch';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { updateUserLocationSettingsDispatch } from '../../../store/settings/dispatch/update-user-location-settings.dispatch';
import { getNearestGeolocationAndStorePharmacies } from '../../../api/api-v1.get-nearest-geolocation-and-store-pharmacies';
import { getUserLocationAndCachePharmaciesDispatch } from './get-user-location-and-cache-pharmacies.dispatch';

jest.mock(
  '../../../store/settings/dispatch/update-user-location-settings.dispatch'
);
const updateUserLocationSettingsDispatchMock =
  updateUserLocationSettingsDispatch as jest.Mock;

jest.mock('../../../api/api-v1.get-nearest-geolocation-and-store-pharmacies');
const getNearestGeolocationAndStorePharmaciesMock =
  getNearestGeolocationAndStorePharmacies as jest.Mock;

jest.mock('./set-user-location.dispatch');
const setUserLocationDispatchMock = setUserLocationDispatch as jest.Mock;

describe('getUserLocationAndCachePharmaciesDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes API request', async () => {
    const locationMock: ILocationCoordinates = { zipCode: 'zip' };
    const configMock = GuestExperienceConfig;
    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });

    const reduxDispatchMock = jest.fn();

    getNearestGeolocationAndStorePharmaciesMock.mockReturnValueOnce({
      data: { location: locationCoordinatesMock },
    });

    const argsMock: IGetUserLocationAsyncActionArgs = {
      location: locationMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      sessionDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getUserLocationAndCachePharmaciesDispatch(argsMock);

    expect(getNearestGeolocationAndStorePharmaciesMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      locationMock,
      { getNextRetry: expect.any(Function), pause: 1000, remaining: 3 }
    );

    expect(updateUserLocationSettingsDispatchMock).toHaveBeenCalledWith(
      reduxDispatchMock,
      locationCoordinatesMock
    );
  });

  it('dispatches set user location dispatch', async () => {
    const locationMock: ILocationCoordinates = {
      zipCode: '00000',
      latitude: 0,
      longitude: 1,
    };
    const configMock = GuestExperienceConfig;
    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });
    const reduxDispatchMock = jest.fn();

    getNearestGeolocationAndStorePharmaciesMock.mockReturnValueOnce({
      data: { location: locationCoordinatesMock },
    });

    const shoppingDispatchMock = jest.fn();
    const argsMock: IGetUserLocationAsyncActionArgs = {
      location: locationMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      sessionDispatch: shoppingDispatchMock,
      navigation: rootStackNavigationMock,
    };
    await getUserLocationAndCachePharmaciesDispatch(argsMock);
    const expectedArgs: ILocationCoordinates = {
      city: locationCoordinatesMock.city,
      state: locationCoordinatesMock.state,
      latitude: locationCoordinatesMock.latitude,
      longitude: locationCoordinatesMock.longitude,
      zipCode: locationCoordinatesMock.zipCode,
    };
    expect(setUserLocationDispatchMock).toHaveBeenCalledWith(
      shoppingDispatchMock,
      expectedArgs
    );
    expect(updateUserLocationSettingsDispatchMock).toHaveBeenCalledWith(
      reduxDispatchMock,
      locationCoordinatesMock
    );
  });
});
