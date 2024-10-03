// Copyright 2021 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { ErrorMaxVerificationAttempt } from '../../../../../errors/error-max-verification-attempts';
import { IVerifyIdentityRequestBody } from '../../../../../models/api-request-body/verify-identity.request-body';
import { verifyIdentity } from '../../../api/api-v1.verify-identity';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { RootState } from '../../root-reducer';
import { accountTokenClearDispatch } from '../../settings/dispatch/account-token-clear.dispatch';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';
import { Dispatch } from 'react';

import {
  ISetIdentityVerificationDataAction,
  setIdentityVerificationDataAction,
} from '../actions/set-identity-verification-data.action';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { IAccountLockedScreenRouteProps } from '../../../screens/sign-in/account-locked/account-locked.screen';

export type IdentityVerificationDispatchType =
  | IUpdateSettingsAction
  | ISetIdentityVerificationDataAction;

export const identityVerificationDispatch = async (
  navigation: RootStackNavigationProp,
  dispatch: Dispatch<IdentityVerificationDispatchType>,
  getState: () => RootState,
  identityVerificationRequestBody: IVerifyIdentityRequestBody
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;
  try {
    const response = await verifyIdentity(
      api,
      identityVerificationRequestBody,
      settings.deviceToken,
      settings.token
    );
    if (response.status === 'success') {
      dispatch(
        setIdentityVerificationDataAction({
          maskedPhoneNumber: response.data.maskedPhoneNumber,
          maskedEmail: response.data.maskedEmailAddress,
        })
      );
      navigation.navigate('VerifyIdentitySendCode');
    }
  } catch (error) {
    if (error instanceof ErrorBadRequest) {
      throw error;
    }
    if (error instanceof ErrorMaxVerificationAttempt) {
      guestExperienceCustomEventLogger(
        CustomAppInsightEvents.REACHED_MAX_IDENTITY_VERIFICATION_ATTEMPTS,
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
