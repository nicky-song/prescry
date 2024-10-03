// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { getPrescriptionInfoDispatch } from '../dispatch/get-prescription-info.dispatch';
import { handlePostLoginApiErrorsAction } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import {
  getPrescriptionInfoAsyncAction,
  IGetPrescriptionInfoAsyncActionArgs,
} from './get-prescription-info.async-action';
import { ErrorPhoneNumberMismatched } from '../../../../../errors/error-phone-number-mismatched';
import { ErrorConstants } from '../../../../../theming/constants';
import { navigateHomeScreenNoApiRefreshDispatch } from '../../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { rootStackNavigationMock } from './../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/get-prescription-info.dispatch');
const getPrescriptionInfoDispatchMock =
  getPrescriptionInfoDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-post-login-error.dispatch'
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch'
);
const navigateHomeScreenNoApiRefreshDispatchMock =
  navigateHomeScreenNoApiRefreshDispatch as jest.Mock;
describe('getPrescriptionInfoAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('calls data loading', async () => {
    const dataLoadingAsyncMock = jest.fn();
    dataLoadingActionMock.mockReturnValue(dataLoadingAsyncMock);

    const argsMock: IGetPrescriptionInfoAsyncActionArgs = {
      prescriptionId: 'prescription-id',
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPrescriptionInfoAsyncAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      argsMock
    );
    expect(dataLoadingAsyncMock).toHaveBeenCalledWith(
      argsMock.reduxDispatch,
      argsMock.reduxGetState
    );
  });

  it('dispatches get prescription info', async () => {
    const argsMock: IGetPrescriptionInfoAsyncActionArgs = {
      prescriptionId: 'prescription-id',
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
      blockchain: false,
    };
    await getPrescriptionInfoAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(jest.fn(), jest.fn());

    expect(getPrescriptionInfoDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('handles errors', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const errorMock = new Error('Boom!');
    getPrescriptionInfoDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetPrescriptionInfoAsyncActionArgs = {
      prescriptionId: 'prescription-id',
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPrescriptionInfoAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      reduxDispatchMock,
      rootStackNavigationMock
    );
  });

  it('navigate to homescreen with modal popup when error occurs with phone mismatch', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const errorMock = new ErrorPhoneNumberMismatched('phone mismatch');
    getPrescriptionInfoDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetPrescriptionInfoAsyncActionArgs = {
      prescriptionId: 'prescription-id',
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPrescriptionInfoAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(navigateHomeScreenNoApiRefreshDispatchMock).toHaveBeenCalledWith(
      reduxGetStateMock,
      rootStackNavigationMock,
      {
        modalContent: {
          modalTopContent: ErrorConstants.errorForGettingPrescription,
          showModal: true,
        },
      }
    );
  });

  it('navigate to homescreen with modal popup when error occurs with phone mismatch', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const errorMock = new ErrorPhoneNumberMismatched('phone mismatch');
    getPrescriptionInfoDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: IGetPrescriptionInfoAsyncActionArgs = {
      prescriptionId: 'prescription-id',
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      shoppingDispatch: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await getPrescriptionInfoAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(reduxDispatchMock, reduxGetStateMock);

    expect(navigateHomeScreenNoApiRefreshDispatchMock).toHaveBeenCalledWith(
      reduxGetStateMock,
      rootStackNavigationMock,
      {
        modalContent: {
          modalTopContent: ErrorConstants.errorForGettingPrescription,
          showModal: true,
        },
      }
    );
  });
});
