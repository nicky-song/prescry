// Copyright 2022 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { Workflow } from '../../../../../models/workflow';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import {
  verifyPrescriptionAsyncAction,
  IVerifyPrescriptionAsyncActionArgs,
} from './verify-prescription.async-action';
import { verifyPrescriptionDispatch } from '../../prescription-verification/dispatch/verify-prescription.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock(
  '../../prescription-verification/dispatch/verify-prescription.dispatch'
);
const verifyPrescriptionDispatchMock = verifyPrescriptionDispatch as jest.Mock;

const accountMock = {
  dateOfBirth: 'January-15-1947',
  firstName: 'fake firstName',
  lastName: 'fake lastName',
  email: 'test@test.com',
  prescriptionId: 'prescription-id',
  isTermAccepted: true,
};
const workflowMock: Workflow = 'prescriptionInvite';

const blockchainMock = true;

const createAccountVerifyPrescriptionAsyncActionArgs: IVerifyPrescriptionAsyncActionArgs =
  {
    account: accountMock,
    workflow: workflowMock,
    navigation: rootStackNavigationMock,
    reduxDispatch: jest.fn(),
    reduxGetState: jest.fn(),
    blockchain: blockchainMock,
  };

describe('createAccountVerifyPrescriptionAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const dataLoadingAsyncMock = jest.fn();
    dataLoadingActionMock.mockReturnValue(dataLoadingAsyncMock);
  });

  it('calls dataLoadingAction', async () => {
    await verifyPrescriptionAsyncAction(
      createAccountVerifyPrescriptionAsyncActionArgs
    );
    expect(dataLoadingActionMock).toBeCalledWith(
      expect.any(Function),
      createAccountVerifyPrescriptionAsyncActionArgs
    );
  });

  it('dispatches verifyPrescriptionDispatch', async () => {
    await verifyPrescriptionAsyncAction(
      createAccountVerifyPrescriptionAsyncActionArgs
    );
    const asyncAction = dataLoadingActionMock.mock.calls[0][0](
      createAccountVerifyPrescriptionAsyncActionArgs
    );
    await asyncAction(jest.fn(), jest.fn());
    expect(verifyPrescriptionDispatchMock).toHaveBeenCalledWith(
      createAccountVerifyPrescriptionAsyncActionArgs
    );
  });

  it('passes exceptions through', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const errorMock = new ErrorBadRequest('Error');
    verifyPrescriptionDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    await verifyPrescriptionAsyncAction(
      createAccountVerifyPrescriptionAsyncActionArgs
    );

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](
      createAccountVerifyPrescriptionAsyncActionArgs
    );

    try {
      await asyncAction(reduxDispatchMock, reduxGetStateMock);
      fail('Expected exception but none thrown!');
    } catch (error) {
      expect(error).toEqual(errorMock);
    }
  });
});
