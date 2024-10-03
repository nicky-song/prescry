// Copyright 2020 Prescryptive Health, Inc.

import { IFailureResponse } from '../../../models/api-response';
import { IAvailableSlot } from '../../../models/api-response/available-slots-response';
import { ErrorConstants } from '../../../theming/constants';
import {
  buildCommonHeaders,
  buildUrl,
  call,
  IApiConfig,
} from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import { APITypes, handleHttpErrors } from './api-v1-helper';
import { ensureAvailableSlotsResponse } from './ensure-api-response/ensure-available-slots-response';
import { IAvailableSlotsRequestBody } from '../../../models/api-request-body/available-slots.request-body';
import { withRefreshToken } from './with-refresh-token';
import { IMarkedDate } from '../../../components/member/appointment-calendar/appointment-calendar';

export interface ICalendarAvailabilityResponse {
  slots: IAvailableSlot[];
  markedDates: IMarkedDate;
  refreshToken?: string;
}

export const getAvailableSlots = async (
  config: IApiConfig,
  availableSlotRequestBody: IAvailableSlotsRequestBody,
  authToken?: string,
  deviceToken?: string,
  retryPolicy?: IRetryPolicy
): Promise<ICalendarAvailabilityResponse> => {
  const url = buildUrl(config, 'availableSlots', {});

  const response: Response = await call(
    url,
    availableSlotRequestBody,
    'POST',
    buildCommonHeaders(config, authToken, deviceToken),
    retryPolicy
  );

  const responseJson = await response.json();
  if (response.ok && ensureAvailableSlotsResponse(responseJson)) {
    const markedDates: IMarkedDate = {};
    responseJson.data.unAvailableDays.forEach((day: string) => {
      markedDates[day] = {
        disabled: true,
        disableTouchEvent: true,
      };
    });

    return withRefreshToken<ICalendarAvailabilityResponse>(
      {
        slots: responseJson.data.slots,
        markedDates,
      },
      response
    );
  }

  const errorResponse = responseJson as IFailureResponse;
  throw handleHttpErrors(
    response.status,
    ErrorConstants.errorInGettingAvailableSlots,
    APITypes.AVAILABLE_SLOTS,
    errorResponse.code,
    errorResponse
  );
};
