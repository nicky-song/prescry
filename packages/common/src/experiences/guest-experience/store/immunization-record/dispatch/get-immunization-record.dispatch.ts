// Copyright 2020 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { RootState } from '../../root-reducer';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { Dispatch } from 'react';
import { getImmunizationRecordResponseAction } from '../actions/get-immunization-record-response.action';
import { IGetImmunizationRecordActionType } from '../async-actions/get-immunization-record.async-action';
import { getImmunizationRecordDetails } from '../../../api/api-v1.get-immunization-record';

export const getImmunizationRecordDispatch = async (
  dispatch: Dispatch<IGetImmunizationRecordActionType>,
  getState: () => RootState,
  orderNumber: string
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;

  const response = await getImmunizationRecordDetails(
    api,
    orderNumber,
    settings.token,
    getEndpointRetryPolicy,
    settings.deviceToken
  );

  await tokenUpdateDispatch(dispatch, response.refreshToken);

  const { data } = response;
  await dispatch(getImmunizationRecordResponseAction(data.immunizationResult));
};
