// Copyright 2018 Prescryptive Health, Inc.

import { ErrorInvalidAuthToken } from '../../../errors/error-invalid-auth-token';
import { ErrorMaxPinAttempt } from '../../../errors/error-max-pin-attempt';
import { ErrorRequireUserRegistration } from '../../../errors/error-require-user-registration';
import { ErrorRequireUserSetPin } from '../../../errors/error-require-user-set-pin';
import { ErrorRequireUserVerifyPin } from '../../../errors/error-require-user-verify-pin';
import { ErrorConstants } from '../../../theming/constants';
import { handleCommonErrorAction } from './error-handling.actions';
import { IDispatchContactInfoActionsType } from './member-list-info/member-list-info-reducer.actions';
import { dispatchResetStackToLoginScreen } from './navigation/navigation-reducer.actions';
import { RootState } from './root-reducer';
import { IGetTestResultsActionType } from './test-result/async-actions/get-test-result.async-action';
import { ISetVerificationCodeErrorStateAction } from './phone-number-verification/actions/phone-number-verification.actions';
import { ICreatePinScreenRouteProps } from './../create-pin-screen/create-pin-screen';
import { IProcessInviteCodeActionType } from './invite-code/dispatch/process-invite-code-and-navigate.dispatch';
import { loginPinNavigateDispatch } from './navigation/dispatch/sign-in/login-pin-navigate.dispatch';
import { deepLinkIfPathNameDispatch } from './start-experience/dispatch/deep-link-if-path-name.dispatch';
import { Dispatch } from 'react';
import { phoneNumberLoginNavigateDispatch } from './navigation/dispatch/sign-in/phone-number-login-navigate.dispatch';
import { RootStackNavigationProp } from '../navigation/stack-navigators/root/root.stack-navigator';
import { IDispatchInitializePrescriptionsActionTypes } from './prescriptions/prescriptions-reducer.actions';
import {
  ISetIdentityVerificationEmailFlagAction,
  setIdentityVerificationEmailFlagAction,
} from './identity-verification/actions/set-identity-verification-email-flag.action';

export type IDispatchAnyDeepLinkLocationActionsType =
  | IGetTestResultsActionType
  | ISetVerificationCodeErrorStateAction
  | IDispatchInitializePrescriptionsActionTypes
  | IProcessInviteCodeActionType;

export type IDispatchInitialScreenActionsType =
  | IDispatchInitializePrescriptionsActionTypes
  | IDispatchContactInfoActionsType
  | IDispatchAnyDeepLinkLocationActionsType;

export const dispatchLoginIfNoDeviceToken = async (
  dispatch: Dispatch<IDispatchInitialScreenActionsType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp
) => {
  const { settings } = getState();
  const deviceToken =
    settings.deviceToken && settings.deviceToken.trim().length > 0;

  if (!deviceToken) {
    const validDeepLink = await deepLinkIfPathNameDispatch(
      dispatch,
      getState,
      navigation,
      false
    );
    if (validDeepLink) {
      return true;
    }

    phoneNumberLoginNavigateDispatch(navigation);
    return true;
  }
  return false;
};

export const dispatchErrorIfDeviceRestricted = (
  getState: () => RootState,
  navigation: RootStackNavigationProp
) => {
  const state = getState();
  if (state.settings.isDeviceRestricted) {
    const errorMessage = ErrorConstants.errorUseMobileBrowser(
      state.config.supportEmail
    );
    handleCommonErrorAction(navigation, errorMessage, new Error(errorMessage));
    return true;
  }

  return false;
};

export const handleKnownAuthenticationErrorAction = (
  dispatch: Dispatch<ISetIdentityVerificationEmailFlagAction>,
  navigation: RootStackNavigationProp,
  error: Error
): boolean => {
  if (error instanceof ErrorRequireUserVerifyPin) {
    dispatch(
      setIdentityVerificationEmailFlagAction({
        recoveryEmailExists: error.isEmailExist || false,
      })
    );
    loginPinNavigateDispatch(navigation, { workflow: error.workflow });
    return true;
  }

  if (error instanceof ErrorRequireUserSetPin) {
    const createPinScreenParams: ICreatePinScreenRouteProps = {
      workflow: error.workflow,
    };
    navigation.navigate('CreatePin', createPinScreenParams);
    return true;
  }

  if (
    error instanceof ErrorRequireUserRegistration ||
    error instanceof ErrorInvalidAuthToken
  ) {
    dispatchResetStackToLoginScreen(navigation);
    return true;
  }

  if (error instanceof ErrorMaxPinAttempt) {
    navigation.navigate('AccountLocked', {});
    return true;
  }

  return false;
};
