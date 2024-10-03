// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../../store/modal-popup/modal-popup.reducer.actions';
import { handlePostLoginApiErrorsAction } from '../../../store/navigation/dispatch/navigate-post-login-error.dispatch';
import { transferPrescriptionDispatch } from '../dispatch/transfer-prescription.dispatch';
import {
  ITransferPrescriptionAsyncActionArgs,
  transferPrescriptionAsyncAction,
} from './transfer-prescription.async-action';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../../store/modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/transfer-prescription.dispatch');
const transferPrescriptionDispatchMock =
  transferPrescriptionDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/navigate-post-login-error.dispatch'
);
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

describe('transferPrescriptionAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dataLoadingActionMock.mockReturnValue(jest.fn());
  });

  it('calls data loading', async () => {
    const dataLoadingAsyncMock = jest.fn();
    dataLoadingActionMock.mockReturnValue(dataLoadingAsyncMock);

    const argsMock: ITransferPrescriptionAsyncActionArgs = {
      transferPrescriptionRequestBody: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
      },
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await transferPrescriptionAsyncAction(argsMock);

    expect(dataLoadingActionMock).toHaveBeenCalledWith(
      expect.any(Function),
      argsMock
    );
    expect(dataLoadingAsyncMock).toHaveBeenCalledWith(
      argsMock.reduxDispatch,
      argsMock.reduxGetState
    );
  });

  it('dispatches transfer prescription', async () => {
    const argsMock: ITransferPrescriptionAsyncActionArgs = {
      transferPrescriptionRequestBody: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
      },
      reduxDispatch: jest.fn(),
      reduxGetState: jest.fn(),
      navigation: rootStackNavigationMock,
    };
    await transferPrescriptionAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);
    await asyncAction(jest.fn(), jest.fn());

    expect(transferPrescriptionDispatchMock).toHaveBeenCalledWith(argsMock);
  });
  it('handles errors', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const errorMock = new Error('Boom!');
    transferPrescriptionDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const argsMock: ITransferPrescriptionAsyncActionArgs = {
      transferPrescriptionRequestBody: {
        sourceNcpdp: 'source-mock-ncpdp',
        destinationNcpdp: 'dest-mock-ncpdp',
        ndc: 'mock-ndc',
        daysSupply: 30,
        quantity: 5,
      },
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
      navigation: rootStackNavigationMock,
    };
    await transferPrescriptionAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](argsMock);

    try {
      await asyncAction(reduxDispatchMock, reduxGetStateMock);
      fail('Expected exception but none thrown!');
    } catch (ex) {
      expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
        errorMock,
        reduxDispatchMock,
        rootStackNavigationMock
      );

      expect(ex).toEqual(errorMock);
    }
  });
});
