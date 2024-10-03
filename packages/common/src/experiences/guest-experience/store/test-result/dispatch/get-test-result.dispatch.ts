// Copyright 2020 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getTestResult } from '../../../api/api-v1.get-test-result';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { IGetTestResultsActionType } from '../async-actions/get-test-result.async-action';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { getTestResultResponseAction } from '../actions/get-test-result-response-action';

export const getTestResultDispatch = async (
  dispatch: Dispatch<IGetTestResultsActionType>,
  getState: () => RootState,
  orderNumber?: string
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;

  const response = await getTestResult(
    api,
    settings.token,
    getEndpointRetryPolicy,
    settings.deviceToken,
    orderNumber
  );

  await tokenUpdateDispatch(dispatch, response.refreshToken);

  const { data } = response;
  await dispatch(getTestResultResponseAction(data));
};
