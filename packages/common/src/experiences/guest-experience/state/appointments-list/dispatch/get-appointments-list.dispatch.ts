// Copyright 2021 Prescryptive Health, Inc.

import { setCurrentAppointmentsDispatch } from './set-current-appointments.dispatch';
import { IGetAppointmentsListAsyncActionArgs } from '../async-actions/get-appointments-list.async-action';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { getAppointments } from '../../../../../experiences/guest-experience/api/api-v1.get-appointments';

export const getAppointmentsListDispatch = async ({
  appointmentListDetails,
  appointmentsListDispatch,
  reduxDispatch,
  reduxGetState,
}: IGetAppointmentsListAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const api = state.config.apis.guestExperienceApi;
  const settings = state.settings;

  const response = await getAppointments(
    api,
    appointmentListDetails,
    settings.token,
    getEndpointRetryPolicy,
    settings.deviceToken
  );

  await tokenUpdateDispatch(reduxDispatch, response.refreshToken);

  const { data } = response;

  setCurrentAppointmentsDispatch(
    appointmentsListDispatch,
    data.appointments ?? [],
    appointmentListDetails.start,
    appointmentListDetails.appointmentsType,
    appointmentListDetails.batchSize
  );
};
