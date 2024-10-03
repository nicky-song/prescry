// Copyright 2020 Prescryptive Health, Inc.

import { getTestResultDispatch } from '../dispatch/get-test-result.dispatch';
import { getTestResultAsyncAction } from './get-test-result.async-action';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { pastProceduresStackNavigationMock } from '../../../navigation/stack-navigators/past-procedures/__mocks__/past-procedures.stack-navigation.mock';

jest.mock('../dispatch/get-test-result.dispatch', () => ({
  getTestResultDispatch: jest.fn(),
}));
const getTestResultDispatchMock = getTestResultDispatch as jest.Mock;

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
};
const getStateMock = jest.fn();

describe('getTestResultsAsyncAction', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('requests getTestResultsDispatch', async () => {
    const dispatchMock = jest.fn();
    const orderNumber = '1234';
    await getTestResultAsyncAction({
      navigation: pastProceduresStackNavigationMock,
      orderNumber
    })(
      dispatchMock,
      getStateMock
    );

    expect(getTestResultDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      orderNumber
    );
  });

  it('dispatches error action on failure', async () => {
    const errorMock = Error('Boom!');
    getTestResultDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const dispatchMock = jest.fn();
    const orderNumber = '1234';
    await getTestResultAsyncAction({
      navigation: pastProceduresStackNavigationMock,
      orderNumber
    })(
      dispatchMock,
      getStateMock
    );

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      pastProceduresStackNavigationMock
    );
  });
});
