// Copyright 2020 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { withRefreshToken } from './with-refresh-token';
import { IAppointmentsResponse } from '../../../models/api-response/appointment.response';
import { ensureGetAppointmentsListResponse } from './ensure-api-response/ensure-get-appointments-list-response';
import { IAppointmentListDetails } from '../../../components/member/lists/appointments-list/appointments-list';

export const getAppointments = async (
  config: IApiConfig,
  appointmentListDetails: IAppointmentListDetails,
  authToken?: string,
  retryPolicy?: IRetryPolicy,
  deviceToken?: string
): Promise<IAppointmentsResponse> => {
  const url = buildUrl(config, 'appointments', {});
  const response: Response = await call(
    `${url}?start=${appointmentListDetails.start}&type=${appointmentListDetails.appointmentsType}`,
    undefined,
    'GET',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureGetAppointmentsListResponse(responseJson)) {
    return withRefreshToken<IAppointmentsResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingAppointmentDetails,
    APITypes.APPOINTMENTS_LIST,
    errorResponse.code,
    errorResponse
  );
};
