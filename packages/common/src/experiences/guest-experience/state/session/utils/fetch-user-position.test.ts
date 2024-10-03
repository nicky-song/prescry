// Copyright 2022 Prescryptive Health, Inc.

import { ErrorConstants } from '../../../api/api-response-messages';
import { setIsGettingUserLocationDispatch } from '../dispatch/set-is-getting-user-location.dispatch';
import { fetchUserPosition } from './fetch-user-position';

jest.mock('../dispatch/set-is-getting-user-location.dispatch');
const setIsGettingUserLocationDispatchMock =
  setIsGettingUserLocationDispatch as jest.Mock;

const geolocationMock = () => {
  const getCurrentPositionMock = jest.fn();

  const geolocation = {
    getCurrentPosition: getCurrentPositionMock,
  };

  Object.defineProperty(global.navigator, 'geolocation', {
    value: geolocation,
  });

  return { getCurrentPositionMock };
};

const { getCurrentPositionMock } = geolocationMock();

const handleUserPositionChangeMock = jest.fn();
const sessionDispatchMock = jest.fn();

describe('fetchUserPosition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls fetchUserPosition successfully when user permissions are set to allowed', () => {
    const coordsMock: GeolocationCoordinates = {
      latitude: 1,
      longitude: -1,
      accuracy: 1,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    };

    const geolocationPositionMock: GeolocationPosition = {
      coords: coordsMock,
      timestamp: 0,
    };

    getCurrentPositionMock.mockImplementationOnce(
      (geoSuccess, _geoError, _options) => {
        geoSuccess(geolocationPositionMock);
      }
    );

    fetchUserPosition(handleUserPositionChangeMock, sessionDispatchMock);

    expect(handleUserPositionChangeMock).toHaveBeenCalledWith(
      {
        longitude: coordsMock.longitude,
        latitude: coordsMock.latitude,
      },
      ''
    );
    expect(setIsGettingUserLocationDispatchMock).toHaveBeenNthCalledWith(
      1,
      sessionDispatchMock,
      true
    );
  });

  it('calls fetchUserPosition geoError when user permissions are set to rejected', () => {
    getCurrentPositionMock.mockImplementationOnce(
      (_geoSuccess, geoError, _options) => {
        geoError({
          PERMISSION_DENIED: 'PERMISSION_DENIED_MOCK',
        });
      }
    );

    fetchUserPosition(handleUserPositionChangeMock, sessionDispatchMock);

    expect(handleUserPositionChangeMock).toHaveBeenCalledWith(
      {},
      ErrorConstants.GEOLOCATION_DETECTION_FAILURE
    );
    expect(setIsGettingUserLocationDispatchMock).toHaveBeenNthCalledWith(
      1,
      sessionDispatchMock,
      true
    );
    expect(setIsGettingUserLocationDispatchMock).toHaveBeenNthCalledWith(
      2,
      sessionDispatchMock,
      false
    );
  });

  it('calls fetchUserPosition geoError when timeout elapses', () => {
    getCurrentPositionMock.mockImplementationOnce(
      (_geoSuccess, geoError, _options) => {
        geoError({
          TIMEOUT: 'TIMEOUT_MOCK',
        });
      }
    );

    fetchUserPosition(handleUserPositionChangeMock, sessionDispatchMock);

    expect(handleUserPositionChangeMock).toHaveBeenCalledWith(
      {},
      ErrorConstants.GEOLOCATION_DETECTION_FAILURE
    );

    expect(setIsGettingUserLocationDispatchMock).toHaveBeenNthCalledWith(
      1,
      sessionDispatchMock,
      true
    );
    expect(setIsGettingUserLocationDispatchMock).toHaveBeenNthCalledWith(
      2,
      sessionDispatchMock,
      false
    );
  });

  it('catches error and sets isGettingUserLocation to false', () => {
    getCurrentPositionMock.mockImplementationOnce(() => {
      throw Error;
    });

    fetchUserPosition(handleUserPositionChangeMock, sessionDispatchMock);

    expect(handleUserPositionChangeMock).toHaveBeenCalledWith(
      {},
      ErrorConstants.GEOLOCATION_DETECTION_FAILURE
    );
    expect(setIsGettingUserLocationDispatchMock).toHaveBeenNthCalledWith(
      1,
      sessionDispatchMock,
      true
    );
    expect(setIsGettingUserLocationDispatchMock).toHaveBeenNthCalledWith(
      2,
      sessionDispatchMock,
      false
    );
  });
});
