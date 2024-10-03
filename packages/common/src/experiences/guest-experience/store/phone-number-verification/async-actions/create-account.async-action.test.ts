// Copyright 2021 Prescryptive Health, Inc.

import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';
import { createAccountDispatch } from '../dispatch/create-account.dispatch';
import { ICreateAccount } from '../../../../../models/create-account';
import { Workflow } from '../../../../../models/workflow';
import {
  createAccountAsyncAction,
  ICreateAccountAsyncActionArgs,
} from './create-account.async-action';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../../modal-popup/modal-popup.reducer.actions');
jest.mock('../dispatch/create-account.dispatch');
const dataLoadingActionMock = dataLoadingAction as jest.Mock;
const createAccountDispatchMock = createAccountDispatch as jest.Mock;
const accountMock: ICreateAccount = {
  firstName: 'Johnny',
  lastName: 'AppleSeed',
  email: 'test@test.com',
  dateOfBirth: 'January-01-2010',
  phoneNumber: '+1PHONE',
  isTermAccepted: true,
};
const workflowMock: Workflow = 'prescriptionTransfer';
const codeMock = '123456';
const createAccountActionArgs: ICreateAccountAsyncActionArgs = {
  account: accountMock,
  workflow: workflowMock,
  code: codeMock,
  navigation: rootStackNavigationMock,
};

describe('createAccountAsyncAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls dataLoadingAction', async () => {
    const argsMock: ICreateAccountAsyncActionArgs = {
      account: accountMock,
      code: codeMock,
      workflow: workflowMock,
      navigation: rootStackNavigationMock,
    };

    await createAccountAsyncAction(argsMock);

    expect(dataLoadingActionMock).toBeCalledWith(
      expect.any(Function),
      argsMock
    );
  });

  it('dispatches createAccountDispatch', async () => {
    const getStateMock = jest.fn();
    const dispatchMock = jest.fn();
    const argsMock: ICreateAccountAsyncActionArgs = {
      account: accountMock,
      code: codeMock,
      workflow: workflowMock,
      navigation: rootStackNavigationMock,
    };
    await createAccountAsyncAction(argsMock);

    const asyncAction = dataLoadingActionMock.mock.calls[0][0](
      createAccountActionArgs
    );
    await asyncAction(dispatchMock, getStateMock);

    expect(createAccountDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      argsMock
    );
  });
});
