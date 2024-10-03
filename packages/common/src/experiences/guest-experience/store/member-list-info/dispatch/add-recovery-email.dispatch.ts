// Copyright 2021 Prescryptive Health, Inc.

import { IAddRecoveryEmailRequestBody } from '../../../../../models/api-request-body/add-recovery-email.request-body';
import { addRecoveryEmail } from '../../../api/api-v1.add-recovery-email';
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
import { loadMemberDataDispatch } from './load-member-data.dispatch';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';

export type AddRecoveryEmailDispatchType =
  | IDispatchContactInfoActionsType
  | IUpdateSettingsAction
  | IDispatchPostLoginApiErrorActionsType;

export const addRecoveryEmailDispatch = async (
  dispatch: Dispatch<AddRecoveryEmailDispatchType>,
  getState: () => RootState,
  navigation: RootStackNavigationProp,
  addRecoveryEmailRequestBody: IAddRecoveryEmailRequestBody
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;
  try {
    const response = await addRecoveryEmail(
      api,
      addRecoveryEmailRequestBody,
      settings.deviceToken,
      settings.token
    );
    if (response.status === 'success') {
      await tokenUpdateDispatch(dispatch, response.refreshToken);
      dispatch(
        setIdentityVerificationEmailFlagAction({
          recoveryEmailExists: true,
        })
      );
      await loadMemberDataDispatch(dispatch, getState, navigation);
    }
  } catch (error) {
    await handlePostLoginApiErrorsAction(
      error as Error,
      dispatch,
      navigation
    );
  }
};
