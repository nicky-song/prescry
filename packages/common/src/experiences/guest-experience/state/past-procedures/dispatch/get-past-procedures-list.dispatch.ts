// Copyright 2021 Prescryptive Health, Inc.

import { setPastProceduresDispatch } from './set-past-procedures.dispatch';
import { IGetPastProceduresListAsyncActionArgs } from '../async-actions/get-past-procedures.async-action';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { getPastProceduresList } from '../../../api/api-v1.get-past-procedures-list';

export const getPastProceduresListDispatch = async ({
  pastProceduresDispatch,
  reduxDispatch,
  reduxGetState,
}: IGetPastProceduresListAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;
  const response = await getPastProceduresList(
    api,
    settings.token,
    getEndpointRetryPolicy,
    settings.deviceToken
  );

  await tokenUpdateDispatch(reduxDispatch, response.refreshToken);

  const { data } = response;

  if (data.pastProcedures) {
    setPastProceduresDispatch(pastProceduresDispatch, data.pastProcedures);
  }
};
