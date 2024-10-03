// Copyright 2022 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { handlePostLoginApiErrorsAction } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { getClaimAlertDispatch } from '../dispatch/get-claim-alert.dispatch';
import {
  getClaimAlertAsyncAction,
  IGetClaimAlertAsyncActionArgs,
} from './get-claim-alert.async-action';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

void dataLoadingActionMock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-post-login-error.dispatch'
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

void handlePostLoginApiErrorsActionMock;

jest.mock('../dispatch/get-claim-alert.dispatch');
const getClaimAlertDispatchMock = getClaimAlertDispatch as jest.Mock;

void getClaimAlertDispatchMock;

const reduxDispatchMock = jest.fn();

const reduxGetStateMock = jest.fn();

const identifierMock = 'identifier-mock';

describe('getClaimAlertAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('dispatches getClaimAlertDispatch', async () => {
    const argsMock: IGetClaimAlertAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      claimAlertDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      identifier: identifierMock,
    };

    await getClaimAlertAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);

    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(getClaimAlertDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('calls dataLoadingAction with expected arguments', async () => {
    const argsMock: IGetClaimAlertAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      claimAlertDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      identifier: identifierMock,
    };

    await getClaimAlertAsyncAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      argsMock
    );
  });

  it('handles errors', async () => {
    const errorMock = new Error('Boom!');

    getClaimAlertDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetClaimAlertAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      claimAlertDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      identifier: identifierMock,
    };

    await getClaimAlertAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);

    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      reduxDispatchMock,
      rootStackNavigationMock
    );
  });
});
