// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { addRecoveryEmailDispatch } from '../dispatch/add-recovery-email.dispatch';
import { addRecoveryEmailAsyncAction } from './add-recovery-email.async-action';
import { IAddRecoveryEmailAsyncAction } from './add-recovery-email.async-action';

jest.mock('../dispatch/add-recovery-email.dispatch');
const addRecoveryEmailDispatchMock = addRecoveryEmailDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const getStateMock = jest.fn();
const dispatchMock = jest.fn();

const email = 'test@test.com';

describe('addRecoveryEmailAsyncAction', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    addRecoveryEmailDispatchMock.mockReset();
  });

  it('calls addRecoveryEmailDispatch as expected', async () => {
    const addRecoveryEmailAsyncActionArgs: IAddRecoveryEmailAsyncAction = {
      email,
      navigation: rootStackNavigationMock,
    };
    const asyncAction = addRecoveryEmailAsyncAction(
      addRecoveryEmailAsyncActionArgs
    );

    await asyncAction(dispatchMock, getStateMock);
    expect(addRecoveryEmailDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      { email }
    );
  });

  it('hits catch statement if error is thrown', async () => {
    const errorMock = new Error('test error');

    addRecoveryEmailDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const addRecoveryEmailAsyncActionArgs: IAddRecoveryEmailAsyncAction = {
      email,
      navigation: rootStackNavigationMock,
    };
    const asyncAction = addRecoveryEmailAsyncAction(
      addRecoveryEmailAsyncActionArgs
    );
    await asyncAction(dispatchMock, getStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
  });
});
