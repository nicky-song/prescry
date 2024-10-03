// Copyright 2020 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { getProviderLocationDetailsDispatch } from '../dispatch/get-provider-location-details.dispatch';
import { getProviderLocationDetailsAsyncAction } from './get-provider-location-details.async-action';

jest.mock('../dispatch/get-provider-location-details.dispatch', () => ({
  getProviderLocationDetailsDispatch: jest.fn(),
}));
const getProviderLocationDetailsDispatchMock =
  getProviderLocationDetailsDispatch as jest.Mock;

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
const identifierMock = 'test-identifier';
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
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('requests getProviderLocationsDispatch', async () => {
    const dispatchMock = jest.fn();
    const asyncAction = getProviderLocationDetailsAsyncAction({
      navigation: rootStackNavigationMock,
      identifier: identifierMock,
    });
    await asyncAction(dispatchMock, getStateMock);

    expect(getProviderLocationDetailsDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      identifierMock
    );
  });

  it('dispatches error action on failure', async () => {
    const errorMock = Error('Boom!');
    getProviderLocationDetailsDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    const asyncAction = getProviderLocationDetailsAsyncAction({
      navigation: rootStackNavigationMock,
      identifier: identifierMock,
    });
    await asyncAction(dispatchMock, getStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
  });
});
