// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { Workflow } from '../../../../../models/workflow';
import { ILoginRequestBody } from '../../../../../models/api-request-body/login.request-body';
import { createAccountWithDeviceTokenDispatch } from '../dispatch/create-account-with-device-token.dispatch';
import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import {
  createAccountDeviceTokenAsyncAction,
  ICreateAccountDeviceTokenAsyncActionArgs,
} from './create-account-with-device-token.async-action';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../modal-popup/modal-popup.reducer.actions');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;

jest.mock('../dispatch/create-account-with-device-token.dispatch');
const createAccountWithDeviceTokenDispatchMock =
  createAccountWithDeviceTokenDispatch as jest.Mock;

const accountMock: ILoginRequestBody = {
  dateOfBirth: 'January-15-1947',
  firstName: 'fake firstName',
  lastName: 'fake lastName',
  accountRecoveryEmail: 'test@test.com',
};
const workflowMock: Workflow = 'prescriptionTransfer';

const createAccountwithDeviceTokenActionArgs: ICreateAccountDeviceTokenAsyncActionArgs =
  {
    account: accountMock,
    workflow: workflowMock,
    reduxDispatch: jest.fn(),
    reduxGetState: jest.fn(),
    navigation: rootStackNavigationMock,
  };

describe('createAccountDeviceTokenAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const dataLoadingAsyncMock = jest.fn();
    dataLoadingActionMock.mockReturnValue(dataLoadingAsyncMock);
  });

  it('calls dataLoadingAction', async () => {
    await createAccountDeviceTokenAsyncAction(
      createAccountwithDeviceTokenActionArgs
    );
    expect(dataLoadingActionMock).toBeCalledWith(
      expect.any(Function),
      createAccountwithDeviceTokenActionArgs
    );
  });

  it('dispatches createAccountWithDeviceTokenDispatch', async () => {
    await createAccountDeviceTokenAsyncAction(
      createAccountwithDeviceTokenActionArgs
    );
    const asyncAction = dataLoadingActionMock.mock.calls[0][0](
      createAccountwithDeviceTokenActionArgs
    );
    await asyncAction(jest.fn(), jest.fn());
    expect(createAccountWithDeviceTokenDispatchMock).toHaveBeenCalledWith(
      createAccountwithDeviceTokenActionArgs
    );
  });

  it('passes exceptions through', async () => {
    const reduxDispatchMock = jest.fn();
    const reduxGetStateMock = jest.fn();

    const errorMock = new ErrorBadRequest('Error');
    createAccountWithDeviceTokenDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    await createAccountDeviceTokenAsyncAction(
      createAccountwithDeviceTokenActionArgs
    );

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](
      createAccountwithDeviceTokenActionArgs
    );

    try {
      await asyncAction(reduxDispatchMock, reduxGetStateMock);
      fail('Expected exception but none thrown!');
    } catch (error) {
      expect(error).toEqual(errorMock);
    }
  });
});
