// Copyright 2018 Prescryptive Health, Inc.

import { ErrorInvalidAuthToken } from '../../../../../errors/error-invalid-auth-token';
import { ErrorMaxPinAttempt } from '../../../../../errors/error-max-pin-attempt';
import { ErrorPhoneNumberMismatched } from '../../../../../errors/error-phone-number-mismatched';
import { ErrorRequireUserVerifyPin } from '../../../../../errors/error-require-user-verify-pin';
import { ErrorShowPinFeatureWelcomeScreen } from '../../../../../errors/error-show-pin-feature-welcome-screen';
import {
  ISetIdentityVerificationEmailFlagAction,
  setIdentityVerificationEmailFlagAction,
} from '../../identity-verification/actions/set-identity-verification-email-flag.action';

import { Dispatch } from 'react';
import { IDispatchContactInfoActionsType } from '../member-list-info-reducer.actions';
import { phoneNumberMismatchedErrorDispatch } from './phone-number-mismatched-error.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { loginPinNavigateDispatch } from '../../navigation/dispatch/sign-in/login-pin-navigate.dispatch';
import { handleAuthenticationErrorAction } from '../../error-handling.actions';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';

export const memberListInfoErrorDispatch = async (
  error: Error,
  dispatch: Dispatch<
    IDispatchContactInfoActionsType | ISetIdentityVerificationEmailFlagAction
  >,
  navigation: RootStackNavigationProp
) => {
  if (error instanceof ErrorMaxPinAttempt) {
    navigation.navigate('AccountLocked', {});
    return;
  }

  if (error instanceof ErrorShowPinFeatureWelcomeScreen) {
    navigation.navigate('PinFeatureWelcome', {});
    return;
  }

  if (error instanceof ErrorRequireUserVerifyPin) {
    await dispatch(
      setIdentityVerificationEmailFlagAction({
        recoveryEmailExists: error.isEmailExist || false,
      })
    );
    return loginPinNavigateDispatch(navigation, { workflow: error.workflow });
  }

  if (error instanceof ErrorPhoneNumberMismatched) {
    return phoneNumberMismatchedErrorDispatch(dispatch, navigation);
  }

  if (error instanceof ErrorInvalidAuthToken) {
    handleAuthenticationErrorAction(dispatch, navigation);
    return;
  }
  internalErrorDispatch(navigation, error);
};
