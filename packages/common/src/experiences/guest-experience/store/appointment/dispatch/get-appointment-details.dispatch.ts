// Copyright 2020 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { RootState } from '../../root-reducer';
import { Dispatch } from 'react';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { IGetAppointmentDetailsActionType } from '../async-actions/get-appointment-details.async-action';
import { getAppointmentDetails } from '../../../api/api-v1.get-appointment-details';
import { getAppointmentDetailsResponseAction } from '../actions/get-appointment-details-response.action';

export const getAppointmentDetailsDispatch = async (
  dispatch: Dispatch<IGetAppointmentDetailsActionType>,
  getState: () => RootState,
  appointmentId: string
) => {
  const state = getState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;

  const response = await getAppointmentDetails(
    api,
    appointmentId,
    settings.token,
    getEndpointRetryPolicy,
    settings.deviceToken
  );

  await tokenUpdateDispatch(dispatch, response.refreshToken);

  const { data } = response;
  if (data.appointment) {
    await dispatch(getAppointmentDetailsResponseAction(data.appointment));
  }
};
