// Copyright 2020 Prescryptive Health, Inc.

import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { acceptConsent } from '../../../api/api-v1.accept-consent';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';

export const acceptConsentDispatch = async (
  dispatch: Dispatch<IUpdateSettingsAction>,
  getState: () => RootState
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;

  const response = await acceptConsent(
    api,
    getEndpointRetryPolicy,
    settings.token,
    settings.deviceToken,
    state.serviceType.type
  );
  await tokenUpdateDispatch(dispatch, response.refreshToken);
};
