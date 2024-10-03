// Copyright 2021 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { ErrorMaxVerificationAttempt } from '../../../../../errors/error-max-verification-attempts';
import { IResetPinRequestBody } from '../../../../../models/api-request-body/reset-pin.request-body';
import { resetPin } from '../../../api/api-v1.reset-pin';
import { ICreatePinScreenRouteProps } from './../../../create-pin-screen/create-pin-screen';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { dispatchResetStackToPhoneLoginScreen } from '../../navigation/navigation-reducer.actions';
import { RootState } from '../../root-reducer';
import { accountTokenClearDispatch } from '../../settings/dispatch/account-token-clear.dispatch';
import {
  IUpdateSettingsAction,
  resetSettingsAction,
  updateDeviceTokenSettingsAction,
} from '../../settings/settings-reducer.actions';
import { Dispatch } from 'react';
import {
  IResetIdentityVerificationCodeSentAction,
  resetIdentityVerificationCodeSentAction,
} from '../actions/reset-identity-verification-code-sent.action';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { IAccountLockedScreenRouteProps } from '../../../screens/sign-in/account-locked/account-locked.screen';

export type ResetPinDispatchType =
  | IUpdateSettingsAction
  | IResetIdentityVerificationCodeSentAction;

export const resetPinDispatch = async (
  dispatch: Dispatch<ResetPinDispatchType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  resetPinRequestBody: IResetPinRequestBody
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;
  try {
    const response = await resetPin(
      api,
      resetPinRequestBody,
      settings.deviceToken,
      settings.token
    );
    if (response.status === 'success') {
      dispatch(resetIdentityVerificationCodeSentAction());
      await resetSettingsAction()(dispatch);
      await updateDeviceTokenSettingsAction(response.data.deviceToken)(
        dispatch
      );
      await dispatchResetStackToPhoneLoginScreen(navigation);
      const createPinScreenParams: ICreatePinScreenRouteProps = {};
      navigation.navigate('CreatePin', createPinScreenParams);
      return;
    }
  } catch (error) {
    dispatch(resetIdentityVerificationCodeSentAction());
    if (error instanceof ErrorBadRequest) {
      throw error;
    }
    if (error instanceof ErrorMaxVerificationAttempt) {
      guestExperienceCustomEventLogger(
        CustomAppInsightEvents.REACHED_MAX_VERIFICATION_CODE_ATTEMPTS,
        {}
      );
      if (getState().settings.token) {
        await accountTokenClearDispatch(dispatch);
      }
      const accountLockedScreenRouteProps: IAccountLockedScreenRouteProps = {
        accountLockedResponse: true,
      };
      navigation.navigate('AccountLocked', accountLockedScreenRouteProps);
      return;
    }
    internalErrorDispatch(navigation, error as Error);
  }
};
