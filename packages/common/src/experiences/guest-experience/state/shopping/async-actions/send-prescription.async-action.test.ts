// Copyright 2021 Prescryptive Health, Inc.

import { shoppingStackNavigationMock } from '../../../navigation/stack-navigators/shopping/__mocks__/shopping.stack-navigation.mock';
import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { handlePostLoginApiErrorsAction } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { sendPrescriptionDispatch } from '../dispatch/send-prescription.dispatch';
import {
  ISendPrescriptionAsyncActionArgs,
  sendPrescriptionAsyncAction,
} from './send-prescription.async-action';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/send-prescription.dispatch');
const sendPrescriptionDispatchMock = sendPrescriptionDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-post-login-error.dispatch'
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

describe('sendPrescriptionAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('calls data loading', async () => {
    const dataLoadingAsyncMock = jest.fn();
    dataLoadingActionMock.mockReturnValue(dataLoadingAsyncMock);

    const argsMock: ISendPrescriptionAsyncActionArgs = {
      ncpdp: 'ncpdp',
      prescriptionId: 'prescription-id',
      orderDate: new Date(),
      shoppingDispatch: jest.fn(),
      navigation: shoppingStackNavigationMock,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
    };
    await sendPrescriptionAsyncAction(argsMock);

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
    const argsMock: ISendPrescriptionAsyncActionArgs = {
      ncpdp: 'ncpdp',
      prescriptionId: 'prescription-id',
      orderDate: new Date(),
      shoppingDispatch: jest.fn(),
      navigation: shoppingStackNavigationMock,
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      blockchain: false,
    };
    await sendPrescriptionAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(jest.fn(), jest.fn());

    expect(sendPrescriptionDispatchMock).toHaveBeenCalledWith(argsMock);
  });

  it('handles errors', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const errorMock = new Error('Boom!');
    sendPrescriptionDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: ISendPrescriptionAsyncActionArgs = {
      ncpdp: 'ncpdp',
      prescriptionId: 'prescription-id',
      orderDate: new Date(),
      shoppingDispatch: jest.fn(),
      navigation: shoppingStackNavigationMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    };
    await sendPrescriptionAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);

    try {
      await asyncAction(reduxDispatchMock, reduxGetStateMock);
      fail('Expected exception but none thrown!');
    } catch (ex) {
      expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
        errorMock,
        reduxDispatchMock,
        shoppingStackNavigationMock
      );

      expect(ex).toEqual(errorMock);
    }
  });
});
