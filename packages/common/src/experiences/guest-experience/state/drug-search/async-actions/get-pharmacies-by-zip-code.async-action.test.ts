// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { handlePostLoginApiErrorsAction } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { getPharmaciesByZipCodeDispatch } from '../dispatch/get-pharmacies-by-zip-code.dispatch';
import {
  getPharmaciesByZipCodeAsyncAction,
  IGetPharmaciesByZipCodeAsyncActionArgs,
} from './get-pharmacies-by-zip-code.async-action';

import { setInvalidZipErrorMessageDispatch } from '../dispatch/set-invalid-zip-error-message.dispatch';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { setPharmaciesByZipCodeDispatch } from '../dispatch/set-pharmacies-by-zip-code.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/get-pharmacies-by-zip-code.dispatch');
const gePharmaciesByZipCodeDispatchMock =
  getPharmaciesByZipCodeDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-post-login-error.dispatch'
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

jest.mock('../dispatch/set-invalid-zip-error-message.dispatch');
const setInvalidZipErrorMessageDispatchMock =
  setInvalidZipErrorMessageDispatch as jest.Mock;

jest.mock('../dispatch/set-pharmacies-by-zip-code.dispatch');
const setPharmaciesByZipCodeDispatchMock =
  setPharmaciesByZipCodeDispatch as jest.Mock;

describe('getPharmaciesByZipCodeAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('calls data loading', async () => {
    const dataLoadingAsyncMock = jest.fn();
    dataLoadingActionMock.mockReturnValue(dataLoadingAsyncMock);

    const argsMock: IGetPharmaciesByZipCodeAsyncActionArgs = {
      zipCode: '98005',
      isUnauthExperience: true,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      drugSearchDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPharmaciesByZipCodeAsyncAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      argsMock
    );
    expect(dataLoadingAsyncMock).toHaveBeenCalledWith(
      argsMock.reduxDispatch,
      argsMock.reduxGetState
    );
  });

  it('dispatches pharmacy search response', async () => {
    const argsMock: IGetPharmaciesByZipCodeAsyncActionArgs = {
      zipCode: '98005',
      start: '20',
      isUnauthExperience: true,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      drugSearchDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPharmaciesByZipCodeAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(jest.fn(), jest.fn());

    expect(gePharmaciesByZipCodeDispatchMock).toHaveBeenCalledWith(argsMock);
    expect(setInvalidZipErrorMessageDispatchMock).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      undefined
    );
  });

  it('handles ErrorBadRequest', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const argsMock: IGetPharmaciesByZipCodeAsyncActionArgs = {
      zipCode: '98005',
      start: '20',
      isUnauthExperience: true,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      drugSearchDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };

    const badErrorMock = new ErrorBadRequest('Error');
    gePharmaciesByZipCodeDispatchMock.mockImplementation(() => {
      throw badErrorMock;
    });

    await getPharmaciesByZipCodeAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(reduxDispatchMock, reduxGetStateMock);
    expect(setInvalidZipErrorMessageDispatch).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      'Error'
    );
    expect(setPharmaciesByZipCodeDispatchMock).toHaveBeenCalledWith(
      argsMock.drugSearchDispatch,
      [],
      false
    );
    expect(handlePostLoginApiErrorsActionMock).not.toBeCalled();
  });

  it('handles errors', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const errorMock = new Error('Error');
    gePharmaciesByZipCodeDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetPharmaciesByZipCodeAsyncActionArgs = {
      zipCode: '98005',
      isUnauthExperience: true,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      drugSearchDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPharmaciesByZipCodeAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(reduxDispatchMock, reduxGetStateMock);
    expect(setPharmaciesByZipCodeDispatchMock).not.toBeCalled();
    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      reduxDispatchMock,
      rootStackNavigationMock
    );
  });
});
