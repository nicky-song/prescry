// Copyright 2021 Prescryptive Health, Inc.

import { ErrorInvalidAuthToken } from '../../../../../errors/error-invalid-auth-token';
import { ErrorRequireUserVerifyPin } from '../../../../../errors/error-require-user-verify-pin';
import { handleAuthenticationErrorAction } from '../../error-handling.actions';
import { setIdentityVerificationEmailFlagAction } from '../../identity-verification/actions/set-identity-verification-email-flag.action';
import { loginPinNavigateDispatch } from '../dispatch/sign-in/login-pin-navigate.dispatch';
import { handleAuthUserApiErrorsAction } from './handle-api-errors-for-auth-users.async-action';
import { rootStackNavigationMock } from './../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('../dispatch/sign-in/login-pin-navigate.dispatch');
const loginPinNavigateDispatchMock = loginPinNavigateDispatch as jest.Mock;

jest.mock('../../error-handling.actions');
const handleAuthenticationErrorActionMock =
  handleAuthenticationErrorAction as jest.Mock;

describe('handleAuthUserApiErrorsAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles user verify pin error', async () => {
    const dispatchMock = jest.fn();

    const errorMock = new ErrorRequireUserVerifyPin(true);

    const setEmailFlagAction = setIdentityVerificationEmailFlagAction({
      recoveryEmailExists: true,
    });

    await handleAuthUserApiErrorsAction(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(setEmailFlagAction);
    expect(loginPinNavigateDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      {
        workflow: undefined,
      }
    );
  });

  it('handles invalid auth token error', async () => {
    const dispatchMock = jest.fn();

    const errorMock = new ErrorInvalidAuthToken('error');

    await handleAuthUserApiErrorsAction(
      errorMock,
      dispatchMock,
      rootStackNavigationMock
    );

    expect(handleAuthenticationErrorActionMock).toHaveBeenCalledWith(
      dispatchMock,
      rootStackNavigationMock
    );
  });
  it('throws error back for all other errors', async () => {
    const dispatchMock = jest.fn();

    const errorMock = new Error('error');

    try {
      await handleAuthUserApiErrorsAction(
        errorMock,
        dispatchMock,
        rootStackNavigationMock
      );
      fail('Expected exception but none thrown!');
    } catch (error) {
      expect(error).toEqual(errorMock);
    }
  });
});
