// Copyright 2021 Prescryptive Health, Inc.

import { IUpdateRecoveryEmailRequestBody } from '../../../../../models/api-request-body/update-recovery-email.request-body';
import { updateRecoveryEmail } from '../../../api/api-v1.update-recovery-email';
import { setIdentityVerificationEmailFlagAction } from '../../identity-verification/actions/set-identity-verification-email-flag.action';
import {
  handlePostLoginApiErrorsAction,
  IDispatchPostLoginApiErrorActionsType,
} from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { RootState } from '../../root-reducer';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';
import { Dispatch } from 'react';
import { IDispatchContactInfoActionsType } from '../member-list-info-reducer.actions';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { loadMemberDataDispatch } from './load-member-data.dispatch';

export type UpdateRecoveryEmailDispatchType =
  | IDispatchContactInfoActionsType
  | IUpdateSettingsAction
  | IDispatchPostLoginApiErrorActionsType;

export const updateRecoveryEmailDispatch = async (
  dispatch: Dispatch<UpdateRecoveryEmailDispatchType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  updateRecoveryEmailRequestBody: IUpdateRecoveryEmailRequestBody
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;
  try {
    const response = await updateRecoveryEmail(
      api,
      updateRecoveryEmailRequestBody,
      settings.deviceToken,
      settings.token
    );
    if (response.status === 'success') {
      await tokenUpdateDispatch(dispatch, response.refreshToken);
      await dispatch(
        setIdentityVerificationEmailFlagAction({
          recoveryEmailExists: true,
        })
      );
      await loadMemberDataDispatch(dispatch, getState, navigation);
      return;
    }
  } catch (error) {
    await handlePostLoginApiErrorsAction(
      error as Error,
      dispatch,
      navigation
    );
  }
};
