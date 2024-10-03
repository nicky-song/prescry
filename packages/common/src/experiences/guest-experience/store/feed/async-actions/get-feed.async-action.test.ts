// Copyright 2020 Prescryptive Health, Inc.

import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

import { getFeedDispatch } from '../dispatch/get-feed.dispatch';
import { getFeedAsyncAction } from './get-feed.async-action';
import { setFeedApiInProgressAction } from '../actions/set-feed-api-in-progress.action';

jest.mock('../dispatch/get-feed.dispatch', () => ({
  getFeedDispatch: jest.fn(),
}));
const getFeedDispatchMock = getFeedDispatch as jest.Mock;

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
const defaultStateMock = {
  config: {
    apis: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
  feed: {
    isFeedApiInProgress: false,
  },
};
const getStateMock = jest.fn();

describe('getFeedAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('requests getFeedDispatch', async () => {
    const dispatchMock = jest.fn();
    const asyncAction = getFeedAsyncAction({
      navigation: rootStackNavigationMock,
    });
    await asyncAction(dispatchMock, getStateMock);

    expect(getFeedDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      undefined
    );
    const expectedSetAction = setFeedApiInProgressAction(true);
    const expectedResetAction = setFeedApiInProgressAction(false);
    expect(dispatchMock).toHaveBeenCalledTimes(2);
    expect(dispatchMock).toHaveBeenNthCalledWith(1, expectedSetAction);
    expect(dispatchMock).toHaveBeenNthCalledWith(2, expectedResetAction);
  });

  it('Does not request getFeedDispatch if one call is already in progress', async () => {
    const dispatchMock = jest.fn();
    const stateWithFeedInProgressMock = {
      config: {
        apis: {},
      },
      settings: {
        deviceToken: deviceTokenMock,
        token: authTokenMock,
      },
      feed: {
        isFeedApiInProgress: true,
      },
    };
    getStateMock.mockReturnValueOnce(stateWithFeedInProgressMock);
    const asyncAction = getFeedAsyncAction({
      navigation: rootStackNavigationMock,
    });
    await asyncAction(dispatchMock, getStateMock);

    expect(getFeedDispatchMock).not.toHaveBeenCalled();
    expect(dispatchMock).not.toBeCalled();
  });
  it('dispathes error action on failure', async () => {
    const errorMock = Error('Boom!');
    getFeedDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    const asyncAction = getFeedAsyncAction({
      navigation: rootStackNavigationMock,
      refreshToken: false,
    });
    await asyncAction(dispatchMock, getStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
    expect(dispatchMock).toHaveBeenCalledTimes(2);
  });
});
