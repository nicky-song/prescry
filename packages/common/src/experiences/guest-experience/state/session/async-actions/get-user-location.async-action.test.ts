// Copyright 2021 Prescryptive Health, Inc.

import { ILocationCoordinates } from '../../../../../models/location-coordinates';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { getUserLocationDispatch } from '../dispatch/get-user-location.dispatch';
import {
  IGetUserLocationAsyncActionArgs,
  getUserLocationAsyncAction,
} from './get-user-location.async-action';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');

jest.mock('../dispatch/get-user-location.dispatch');
const getUserLocationDispatchMock = getUserLocationDispatch as jest.Mock;

const locationMock: ILocationCoordinates = {
  zipCode: '00000',
  latitude: 1,
  longitude: 1,
};

describe('getUserLocationAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches get location with default props', async () => {
    const argsMock: IGetUserLocationAsyncActionArgs = {
      sessionDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
    };
    await getUserLocationAsyncAction(argsMock);

    expect(getUserLocationDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('dispatches get location with expected props', async () => {
    const argsMock: IGetUserLocationAsyncActionArgs = {
      location: locationMock,
      sessionDispatch: jest.fn(),
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getUserLocationAsyncAction(argsMock);

    expect(getUserLocationDispatchMock).toHaveBeenCalledWith(argsMock);
  });
});
