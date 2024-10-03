// Copyright 2022 Prescryptive Health, Inc.

import { autocompleteGeolocation } from '../../../../api/api-v1.autocomplete-geolocation';
import { GuestExperienceConfig } from '../../../../guest-experience-config';
import { IAutocompleteUserLocationAsyncActionArgs } from '../async-actions/autocomplete-user-location.async-action';
import { autocompleteUserLocationDispatch } from './autocomplete-user-location.dispatch';
import { locationCoordinatesMock } from '../../../../__mocks__/location-coordinate.mock';
import { rootStackNavigationMock } from '../../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { setSuggestedLocationsDispatch } from './set-suggested-locations.dispatch';
import { setActiveSuggestedLocationDispatch } from './set-active-suggested-location.dispatch';
import { setLocationErrorMessageDispatch } from './set-location-error-message.dispatch';
import { ILocationCoordinates } from '../../../../../../models/location-coordinates';

jest.mock('../../../../api/api-v1.autocomplete-geolocation');
const autocompleteGeolocationMock = autocompleteGeolocation as jest.Mock;

jest.mock('./set-suggested-locations.dispatch');
const setSuggestedLocationsDispatchMock =
  setSuggestedLocationsDispatch as jest.Mock;

jest.mock('./set-active-suggested-location.dispatch');
const setActiveSuggestedLocationDispatchMock =
  setActiveSuggestedLocationDispatch as jest.Mock;

jest.mock('./set-location-error-message.dispatch');
const setLocationErrorMessageDispatchMock =
  setLocationErrorMessageDispatch as jest.Mock;

describe('autocompleteUserLocationDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes API request', async () => {
    const queryMock = 'zip';
    const configMock = GuestExperienceConfig;
    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });
    const reduxDispatchMock = jest.fn();

    autocompleteGeolocationMock.mockReturnValueOnce({
      data: { locations: [locationCoordinatesMock] },
    });

    const argsMock: IAutocompleteUserLocationAsyncActionArgs = {
      query: queryMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      findLocationDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await autocompleteUserLocationDispatch(argsMock);

    expect(autocompleteGeolocationMock).toHaveBeenCalledWith(
      configMock.apis.guestExperienceApi,
      queryMock,
      undefined,
      { getNextRetry: expect.any(Function), pause: 1000, remaining: 3 }
    );
  });

  it('dispatches set suggested locations', async () => {
    const locationMock: ILocationCoordinates = {
      zipCode: '00000',
      latitude: 0,
      longitude: 1,
    };
    const configMock = GuestExperienceConfig;
    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });
    const reduxDispatchMock = jest.fn();

    autocompleteGeolocationMock.mockReturnValueOnce({
      data: { locations: [locationCoordinatesMock] },
    });

    const findLocationDispatchMock = jest.fn();
    const argsMock: IAutocompleteUserLocationAsyncActionArgs = {
      location: locationMock,
      defaultSet: true,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      findLocationDispatch: findLocationDispatchMock,
      navigation: rootStackNavigationMock,
    };
    await autocompleteUserLocationDispatch(argsMock);
    expect(setSuggestedLocationsDispatchMock).toHaveBeenCalledWith(
      findLocationDispatchMock,
      [locationCoordinatesMock]
    );
    expect(setActiveSuggestedLocationDispatchMock).toHaveBeenCalledWith(
      findLocationDispatchMock,
      locationCoordinatesMock
    );
  });

  it('not dispatches set suggested locations', async () => {
    const locationMock: ILocationCoordinates = {
      zipCode: '00000',
      latitude: 0,
      longitude: 1,
    };
    const configMock = GuestExperienceConfig;
    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });
    const reduxDispatchMock = jest.fn();

    autocompleteGeolocationMock.mockReturnValueOnce({
      data: { locations: null },
    });

    const findLocationDispatchMock = jest.fn();
    const argsMock: IAutocompleteUserLocationAsyncActionArgs = {
      location: locationMock,
      defaultSet: true,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      findLocationDispatch: findLocationDispatchMock,
      navigation: rootStackNavigationMock,
    };
    await autocompleteUserLocationDispatch(argsMock);
    expect(setSuggestedLocationsDispatchMock).not.toHaveBeenCalled();
    expect(setActiveSuggestedLocationDispatchMock).not.toHaveBeenCalled();
  });

  it('not dispatches set active suggested location', async () => {
    const locationMock: ILocationCoordinates = {
      zipCode: '00000',
      latitude: 0,
      longitude: 1,
    };
    const configMock = GuestExperienceConfig;
    const reduxGetStateMock = jest.fn().mockReturnValue({ config: configMock });
    const reduxDispatchMock = jest.fn();

    autocompleteGeolocationMock.mockReturnValueOnce({
      data: { locations: [] },
    });

    const findLocationDispatchMock = jest.fn();
    const argsMock: IAutocompleteUserLocationAsyncActionArgs = {
      location: locationMock,
      defaultSet: true,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      findLocationDispatch: findLocationDispatchMock,
      navigation: rootStackNavigationMock,
    };
    await autocompleteUserLocationDispatch(argsMock);
    expect(setSuggestedLocationsDispatchMock).toHaveBeenCalledWith(
      findLocationDispatchMock,
      []
    );
    expect(setActiveSuggestedLocationDispatchMock).not.toHaveBeenCalled();
  });

  it.each([
    [undefined, [locationCoordinatesMock], false],
    [undefined, [], false],
    ['Error Found', [locationCoordinatesMock], false],
    ['Error Found', [], true],
  ])(
    'dispatches set location error message',
    async (
      messageMock: string | undefined,
      responseMock: ILocationCoordinates[],
      expected: boolean
    ) => {
      const queryMock = 'zip';
      const configMock = GuestExperienceConfig;
      const reduxGetStateMock = jest
        .fn()
        .mockReturnValue({ config: configMock });
      const reduxDispatchMock = jest.fn();
      const findLocationDispatchMock = jest.fn();

      autocompleteGeolocationMock.mockReturnValueOnce({
        data: { locations: responseMock },
      });

      const argsMock: IAutocompleteUserLocationAsyncActionArgs = {
        query: queryMock,
        notFoundErrorMessage: messageMock,
        reduxDispatch: reduxDispatchMock,
        reduxGetState: reduxGetStateMock,
        findLocationDispatch: findLocationDispatchMock,
        navigation: rootStackNavigationMock,
      };
      await autocompleteUserLocationDispatch(argsMock);

      if (expected) {
        expect(setLocationErrorMessageDispatchMock).toHaveBeenCalledWith(
          findLocationDispatchMock,
          messageMock
        );
      } else {
        expect(setLocationErrorMessageDispatchMock).not.toHaveBeenCalled();
      }
    }
  );
});
