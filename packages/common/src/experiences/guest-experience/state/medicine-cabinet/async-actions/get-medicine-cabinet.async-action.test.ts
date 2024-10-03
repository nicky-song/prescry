// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { handlePostLoginApiErrorsAction } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';

import { getMedicineCabinetDispatch } from '../dispatch/get-medicine-cabinet.dispatch';
import {
  getMedicineCabinetAsyncAction,
  IGetMedicineCabinetAsyncActionArgs,
} from './get-medicine-cabinet.async-action';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/get-medicine-cabinet.dispatch');
const getMedicineCabinetDispatchMock = getMedicineCabinetDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-post-login-error.dispatch'
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();
const loadingTextMock = 'Loading prescription mock';
describe('getMedicineCabinetAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('dispatches get medicine cabinet', async () => {
    const argsMock: IGetMedicineCabinetAsyncActionArgs = {
      page: 1,
      navigation: rootStackNavigationMock,
      medicineCabinetDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await getMedicineCabinetAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](
      argsMock,
      true,
      loadingTextMock
    );
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(getMedicineCabinetDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('Should call dataLoadingAction with expectd agrguments', async () => {
    const argsMock: IGetMedicineCabinetAsyncActionArgs = {
      page: 1,
      navigation: rootStackNavigationMock,
      medicineCabinetDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      loadingText: loadingTextMock,
    };
    await getMedicineCabinetAsyncAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      argsMock,
      true,
      loadingTextMock
    );
  });

  it('dispatches get medicine cabinet with page size', async () => {
    const argsMock: IGetMedicineCabinetAsyncActionArgs = {
      page: 1,
      navigation: rootStackNavigationMock,
      medicineCabinetDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await getMedicineCabinetAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](
      argsMock,
      true,
      loadingTextMock
    );
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(getMedicineCabinetDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('handles errors', async () => {
    const errorMock = new Error('Boom!');
    getMedicineCabinetDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetMedicineCabinetAsyncActionArgs = {
      page: 1,
      navigation: rootStackNavigationMock,
      medicineCabinetDispatch: jest.fn(),
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await getMedicineCabinetAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](
      argsMock,
      true,
      loadingTextMock
    );
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      reduxDispatchMock,
      rootStackNavigationMock
    );
  });
});
