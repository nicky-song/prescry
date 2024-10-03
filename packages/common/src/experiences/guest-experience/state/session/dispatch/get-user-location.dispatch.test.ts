// Copyright 2021 Prescryptive Health, Inc.

import { getNearestGeolocation } from '../../../api/api-v1.get-nearest-geolocation';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import { IGetUserLocationAsyncActionArgs } from '../async-actions/get-user-location.async-action';
import { getUserLocationDispatch } from './get-user-location.dispatch';
import { locationCoordinatesMock } from '../../../__mocks__/location-coordinate.mock';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { setUserLocationDispatch } from './set-user-location.dispatch';
import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { updateUserLocationSettingsDispatch } from '../../../store/settings/dispatch/update-user-location-settings.dispatch';

jest.mock(
  '../../../store/settings/dispatch/update-user-location-settings.dispatch'
);
const updateUserLocationSettingsDispatchMock =
  updateUserLocationSettingsDispatch as jest.Mock;

jest.mock('../../../api/api-v1.get-nearest-geolocation');
const getNearestGeolocationMock = getNearestGeolocation as jest.Mock;

jest.mock('./set-user-location.dispatch');
const setUserLocationDispatchMock = setUserLocationDispatch as jest.Mock;

describe('getUserLocationDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes API request', async () => {
    const locationMock: ILocationCoordinates = { zipCode: 'zip' };
    const configMock = GuestExperienceConfig;
    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });

    const reduxDispatchMock = jest.fn();

    getNearestGeolocationMock.mockReturnValueOnce({
      data: { location: locationCoordinatesMock },
    });

    const argsMock: IGetUserLocationAsyncActionArgs = {
      location: locationMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      sessionDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getUserLocationDispatch(argsMock);

    expect(getNearestGeolocationMock).toHaveBeenCalledWith(
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

    getNearestGeolocationMock.mockReturnValueOnce({
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
    await getUserLocationDispatch(argsMock);
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
