// Copyright 2022 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { handlePostLoginApiErrorsAction } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { getClaimHistoryDispatch } from '../dispatch/get-claim-history.dispatch';
import {
  getClaimHistoryAsyncAction,
  IGetClaimHistoryAsyncActionArgs,
} from './get-claim-history.async-action';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/get-claim-history.dispatch');
const getClaimHistoryDispatchMock = getClaimHistoryDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-post-login-error.dispatch'
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();
const loadingTextMock = 'loadingTextMock';

describe('getClaimHistoryAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('dispatches get claim history', async () => {
    const argsMock: IGetClaimHistoryAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      medicineCabinetDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await getClaimHistoryAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(getClaimHistoryDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('Should call dataLoadingAction with expectd agrguments', async () => {
    const argsMock: IGetClaimHistoryAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      medicineCabinetDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      loadingText: loadingTextMock,
    };
    await getClaimHistoryAsyncAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      argsMock,
      true,
      loadingTextMock
    );
  });

  it('handles errors', async () => {
    const errorMock = new Error('Boom!');
    getClaimHistoryDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetClaimHistoryAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      medicineCabinetDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await getClaimHistoryAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      reduxDispatchMock,
      rootStackNavigationMock
    );
  });
});
