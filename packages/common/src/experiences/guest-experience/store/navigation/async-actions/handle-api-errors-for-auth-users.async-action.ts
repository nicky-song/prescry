// Copyright 2021 Prescryptive Health, Inc.

import { Dispatch } from 'react';
import { ErrorInvalidAuthToken } from '../../../../../errors/error-invalid-auth-token';
import { ErrorRequireUserVerifyPin } from '../../../../../errors/error-require-user-verify-pin';
import { handleAuthenticationErrorAction } from '../../error-handling.actions';
import { setIdentityVerificationEmailFlagAction } from '../../identity-verification/actions/set-identity-verification-email-flag.action';
import { IDispatchPostLoginApiErrorActionsType } from '../dispatch/navigate-post-login-error.dispatch';
import { loginPinNavigateDispatch } from '../dispatch/sign-in/login-pin-navigate.dispatch';
import { RootStackNavigationProp } from './../../../navigation/stack-navigators/root/root.stack-navigator';

export const handleAuthUserApiErrorsAction = async (
  error: Error,
  dispatch: Dispatch<IDispatchPostLoginApiErrorActionsType>,
  navigation: RootStackNavigationProp
): Promise<void> => {
  if (error instanceof ErrorRequireUserVerifyPin) {
    await dispatch(
      setIdentityVerificationEmailFlagAction({
        recoveryEmailExists: !!error.isEmailExist,
      })
    );
    loginPinNavigateDispatch(navigation, {
      workflow: error.workflow,
    });
    return;
  }
  if (error instanceof ErrorInvalidAuthToken) {
    await handleAuthenticationErrorAction(dispatch, navigation);
    return;
  }
  throw error;
};
