// Copyright 2020 Prescryptive Health, Inc.

import { getAvailableSlots } from '../../../api/api-v1.get-available-slots';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import {
  ISetCalendarStatusAction,
  setCalendarStatusAction,
} from '../actions/set-calendar-status.action';
import { IAvailableSlotsRequestBody } from '../../../../../models/api-request-body/available-slots.request-body';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { IUpdateSettingsAction } from '../../settings/settings-reducer.actions';

export const getAvailabilityDispatch = async (
  dispatch: Dispatch<ISetCalendarStatusAction | IUpdateSettingsAction>,
  getState: () => RootState,
  availableSlotRequestBody: IAvailableSlotsRequestBody
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;
  const response = await getAvailableSlots(
    api,
    availableSlotRequestBody,
    settings.token,
    settings.deviceToken,
    getEndpointRetryPolicy
  );
  await dispatch(setCalendarStatusAction(response));
  await tokenUpdateDispatch(dispatch, response.refreshToken);
};
