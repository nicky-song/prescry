// Copyright 2021 Prescryptive Health, Inc.

import { pastProceduresStackNavigationMock } from '../../../navigation/stack-navigators/past-procedures/__mocks__/past-procedures.stack-navigation.mock';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { handlePostLoginApiErrorsAction } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { getPastProceduresListDispatch } from '../dispatch/get-past-procedures-list.dispatch';
import {
  getPastProceduresAsyncAction,
  IGetPastProceduresListAsyncActionArgs,
} from './get-past-procedures.async-action';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/get-past-procedures-list.dispatch');
const getPastProceduresListDispatchMock =
  getPastProceduresListDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-post-login-error.dispatch'
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

describe('getPastProceduresAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('calls data loading', async () => {
    const dataLoadingAsyncMock = jest.fn();
    dataLoadingActionMock.mockReturnValue(dataLoadingAsyncMock);

    const argsMock: IGetPastProceduresListAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      navigation: pastProceduresStackNavigationMock,
      pastProceduresDispatch: jest.fn(),
    };
    await getPastProceduresAsyncAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      argsMock
    );
    expect(dataLoadingAsyncMock).toHaveBeenCalledWith(
      argsMock.reduxDispatch,
      argsMock.reduxGetState
    );
  });

  it('dispatches get past procedures list', async () => {
    const argsMock: IGetPastProceduresListAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      navigation: pastProceduresStackNavigationMock,
      pastProceduresDispatch: jest.fn(),
    };
    await getPastProceduresAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(jest.fn(), jest.fn());

    expect(getPastProceduresListDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('handles errors', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const errorMock = new Error('Error');
    getPastProceduresListDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetPastProceduresListAsyncActionArgs = {
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      navigation: pastProceduresStackNavigationMock,
      pastProceduresDispatch: jest.fn(),
    };
    await getPastProceduresAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      reduxDispatchMock,
      pastProceduresStackNavigationMock
    );
  });
});
