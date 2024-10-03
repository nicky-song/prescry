// Copyright 2021 Prescryptive Health, Inc.

import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { sendVerificationCode } from '../../../api/api-v1.send-verification-code';
import {
  ISendVerificationCodeRequestBody,
  VerificationTypes,
} from '../../../../../models/api-request-body/send-verification-code.request-body';
import { TooManyRequestError } from '../../../../../errors/error-too-many-requests';
import { handleTwilioErrorAction } from '../../error-handling.actions';
import { ISetMissingAccountErrorMessageAction } from '../../support-error/support-error.reducer.actions';
import {
  ISetIdentityVerificationCodeSentAction,
  setIdentityVerificationCodeSentAction,
} from '../actions/set-identity-verification-code-sent.action';

import { ErrorInternalServer } from '../../../../../errors/error-internal-server';
import {
  IResetIdentityVerificationCodeSentAction,
  resetIdentityVerificationCodeSentAction,
} from '../actions/reset-identity-verification-code-sent.action';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../guest-experience-logger.middleware';
import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export type SendVerificationCodeDispatchType =
  | ISetMissingAccountErrorMessageAction
  | ISetIdentityVerificationCodeSentAction
  | IResetIdentityVerificationCodeSentAction;

export const sendVerificationCodeDispatch = async (
  dispatch: Dispatch<SendVerificationCodeDispatchType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  verificationType: VerificationTypes,
  resendCode?: boolean
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;
  try {
    const response = await sendVerificationCode(
      api,
      { verificationType } as ISendVerificationCodeRequestBody,
      settings.deviceToken,
      settings.token
    );
    if (response.status === 'success') {
      if (resendCode) {
        await dispatch(
          setIdentityVerificationCodeSentAction({
            isVerificationCodeSent: true,
          })
        );
      }
      if (!resendCode) {
        await dispatch(resetIdentityVerificationCodeSentAction());
      }

      navigation.navigate('VerifyIdentityVerificationCode');
    }
  } catch (error) {
    if (error instanceof TooManyRequestError) {
      guestExperienceCustomEventLogger(
        CustomAppInsightEvents.REQUESTED_VERIFICATION_CODE_MAX_ATTEMPTS,
        {}
      );
      handleTwilioErrorAction(dispatch, navigation, error.message);
      return;
    }

    if (error instanceof ErrorInternalServer) {
      internalErrorDispatch(navigation, error);
      return;
    }
    throw error;
  }
};
