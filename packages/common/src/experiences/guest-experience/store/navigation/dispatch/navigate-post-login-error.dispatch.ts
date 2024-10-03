// Copyright 2018 Prescryptive Health, Inc.

import { internalErrorDispatch } from '../../error-handling/dispatch/internal-error.dispatch';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';
import { ErrorInternalServer } from '../../../../../errors/error-internal-server';
import { APITypes } from '../../../api/api-v1-helper';
import { ErrorApiResponse } from '../../../../../errors/error-api-response';
import { ISetIdentityVerificationEmailFlagAction } from '../../identity-verification/actions/set-identity-verification-email-flag.action';
import { Dispatch } from 'react';
import { handleAuthUserApiErrorsAction } from '../async-actions/handle-api-errors-for-auth-users.async-action';
import { RootStackNavigationProp } from './../../../navigation/stack-navigators/root/root.stack-navigator';

export type IDispatchPostLoginApiErrorActionsType =
  | IUpdateSettingsAction
  | ISetIdentityVerificationEmailFlagAction;

export const handlePostLoginApiErrorsAction = async (
  error: Error,
  dispatch: Dispatch<IDispatchPostLoginApiErrorActionsType>,
  navigation: RootStackNavigationProp
) => {
  try {
    await handleAuthUserApiErrorsAction(error, dispatch, navigation);
  } catch (error) {
    if (
      error instanceof ErrorInternalServer &&
      error.apiType &&
      (error.apiType === APITypes.AVAILABLE_SLOTS ||
        error.apiType === APITypes.ACCEPT_CONSENT ||
        error.apiType === APITypes.CREATE_BOOKING ||
        error.apiType === APITypes.PROVIDER_LOCATIONS ||
        error.apiType === APITypes.LOCK_SLOT ||
        error.apiType === APITypes.UNLOCK_SLOT)
    ) {
      navigation.navigate('SupportError');
      return;
    }

    if (error instanceof ErrorApiResponse) {
      navigation.navigate('SupportError');
      return;
    }
    internalErrorDispatch(navigation, error as Error);
  }
};
