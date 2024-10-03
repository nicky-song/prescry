// Copyright 2021 Prescryptive Health, Inc.

import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { getMemberInfoDispatch } from '../dispatch/get-member-info.dispatch';
import { updateRecoveryEmailDispatch } from '../dispatch/update-recovery-email.dispatch';
import { updateRecoveryEmailAsyncAction } from './update-recovery-email.async-action';

jest.mock('../dispatch/update-recovery-email.dispatch');
const updateRecoveryEmailDispatchMock =
  updateRecoveryEmailDispatch as jest.Mock;

jest.mock('../dispatch/get-member-info.dispatch');
const getMemberInfoDispatchMock = getMemberInfoDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const getStateMock = jest.fn();
const dispatchMock = jest.fn();

const email = 'test@test.com';
const oldEmail = 'old@test.com';

describe('updateRecoveryEmailAsyncAction', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    updateRecoveryEmailDispatchMock.mockReset();
  });

  it('calls updateRecoveryEmailDispatch as expected', async () => {
    const asyncAction = updateRecoveryEmailAsyncAction({
      requestBody: { email, oldEmail },
      navigation: rootStackNavigationMock,
    });

    await asyncAction(dispatchMock, getStateMock);
    expect(updateRecoveryEmailDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      { email, oldEmail }
    );
    expect(getMemberInfoDispatchMock).toHaveBeenCalled();
  });

  it('hits catch statement if error is thrown', async () => {
    const errorMock = new Error('test error');

    updateRecoveryEmailDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    const asyncAction = updateRecoveryEmailAsyncAction({
      requestBody: { email, oldEmail },
      navigation: rootStackNavigationMock,
    });
    await asyncAction(dispatchMock, getStateMock);

    expect(handlePostLoginApiErrorsActionMock).toHaveBeenCalledWith(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
  });
});
