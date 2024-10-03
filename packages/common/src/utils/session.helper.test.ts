// Copyright 2021 Prescryptive Health, Inc.

import { IReduxContext } from '../experiences/guest-experience/context-providers/redux/redux.context';
import { useReduxContext } from '../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { ILocationCoordinates } from '../models/location-coordinates';
import {
  getLastZipCodeFromSettings,
  getUserLocationFromSettings,
} from './session.helper';

jest.mock(
  '../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);
const useReduxContextMock = useReduxContext as jest.Mock;

describe('getLastZipCodeFromSettings', () => {
  it('should return zipcode from getState settings', () => {
    const reduxGetStateMock = jest.fn();
    reduxGetStateMock.mockReturnValue({
      settings: { lastZipCode: 'unknown', isDeviceRestricted: false },
    });
    const reduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const lastZipCode = getLastZipCodeFromSettings(reduxGetStateMock);
    expect(lastZipCode).toEqual('unknown');
  });
});

describe('getUserLocationFromSettings', () => {
  it('should return user location from getState settings', () => {
    const reduxGetStateMock = jest.fn();
    const userLocationMock: ILocationCoordinates = {
      zipCode: '12345',
      latitude: 99,
      longitude: 99,
    };
    reduxGetStateMock.mockReturnValue({
      settings: {
        userLocation: userLocationMock,
      },
    });
    const reduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const userLocation = getUserLocationFromSettings(reduxGetStateMock);
    expect(userLocation).toEqual(userLocationMock);
  });
});
