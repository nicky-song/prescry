// Copyright 2020 Prescryptive Health, Inc.

import { IZipcodeParam } from '../../../../../components/member/lists/pharmacy-locations-list/pharmacy-locations-list';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';

import { getProviderLocationsDispatch } from '../dispatch/get-provider-locations.dispatch';
import { getProviderLocationsAsyncAction } from './get-provider-locations.async-action';

jest.mock('../dispatch/get-provider-locations.dispatch', () => ({
  getProviderLocationsDispatch: jest.fn(),
}));
const getProviderLocationsDispatchMock =
  getProviderLocationsDispatch as jest.Mock;

jest.mock(
  '../../navigation/dispatch/navigate-post-login-error.dispatch',
  () => ({
    handlePostLoginApiErrorsAction: jest.fn(),
  })
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';
const zipcodeParamMock = { zipcode: '98023', distance: 60 } as IZipcodeParam;
const defaultStateMock = {
  config: {
    apis: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
};
const getStateMock = jest.fn();

describe('getProviderLocationsAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('requests getProviderLocationsDispatch', async () => {
    const dispatchMock = jest.fn();
    const args = {
      navigation: appointmentsStackNavigationMock,
      zipcodeParam: zipcodeParamMock,
    };
    const asyncAction = getProviderLocationsAsyncAction(args);
    await asyncAction(dispatchMock, getStateMock);

    expect(getProviderLocationsDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      zipcodeParamMock
    );
  });

  it('dispathes error action on failure', async () => {
    const errorMock = Error('Boom!');
    getProviderLocationsDispatchMock.mockImplementation(() => {
      throw errorMock;
    });
    const args = {
      navigation: appointmentsStackNavigationMock,
      zipcodeParam: zipcodeParamMock,
    };
    const dispatchMock = jest.fn();
    const asyncAction = getProviderLocationsAsyncAction(args);
    await asyncAction(dispatchMock, getStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      appointmentsStackNavigationMock
    );
  });
});
