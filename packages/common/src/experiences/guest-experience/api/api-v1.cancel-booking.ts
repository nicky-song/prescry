// Copyright 2020 Prescryptive Health, Inc.

import { ICancelBookingRequestBody } from '../../../models/api-request-body/cancel-booking.request-body';
import { IFailureResponse } from '../../../models/api-response';
import { ICancelBookingResponse } from '../../../models/api-response/cancel-booking-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';

export const cancelBooking = async (
  config: IApiConfig,
  cancelBookingRequestBody: ICancelBookingRequestBody,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<ICancelBookingResponse> => {
  const url = buildUrl(config, 'cancelBooking', {});

  const response: Response = await call(
    url,
    cancelBookingRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok) {
    return responseJson;
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorForCancelBooking,
    APITypes.CANCEL_BOOKING,
    errorResponse.code,
    errorResponse
  );
};
