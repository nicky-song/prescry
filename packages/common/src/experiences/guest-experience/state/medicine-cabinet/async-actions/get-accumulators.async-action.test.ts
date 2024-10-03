// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { handlePostLoginApiErrorsAction } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { getAccumulatorsDispatch } from '../dispatch/get-accumulators.dispatch';
import {
  getAccumulatorsAsyncAction,
  IGetAccumulatorAsyncActionArgs,
} from './get-accumulators.async-action';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/get-accumulators.dispatch');
const getAccumulatorsDispatchMock = getAccumulatorsDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-post-login-error.dispatch'
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();

describe('getAccumulatorsAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('dispatches get accumulators', async () => {
    const argsMock: IGetAccumulatorAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      medicineCabinetDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await getAccumulatorsAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(getAccumulatorsDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('handles errors', async () => {
    const errorMock = new Error('Boom!');
    getAccumulatorsDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetAccumulatorAsyncActionArgs = {
      navigation: rootStackNavigationMock,
      medicineCabinetDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await getAccumulatorsAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      reduxDispatchMock,
      rootStackNavigationMock
    );
  });
});
