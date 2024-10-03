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
import { IAppointmentResponse } from '../../../models/api-response/appointment.response';
import { ensureGetAppointmentDetailsResponse } from './ensure-api-response/ensure-get-appointment-details-response';

export const getAppointmentDetails = async (
  config: IApiConfig,
  appointmentId: string,
  authToken?: string,
  retryPolicy?: IRetryPolicy,
  deviceToken?: string
): Promise<IAppointmentResponse> => {
  const url = buildUrl(config, 'appointmentDetails', {
    ':id': appointmentId,
  });

  const response: Response = await call(
    url,
    undefined,
    'GET',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureGetAppointmentDetailsResponse(responseJson)) {
    return withRefreshToken<IAppointmentResponse>(responseJson, response);
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForGettingAppointmentDetails,
    APITypes.APPOINTMENT_DETAILS,
    errorResponse.code,
    errorResponse
  );
};
