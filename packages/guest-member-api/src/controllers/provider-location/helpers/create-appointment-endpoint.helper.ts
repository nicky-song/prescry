// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'node-fetch';
import { IBookingResponseError } from '@phx/common/src/models/booking/booking-error';
import { ICreateAppointmentRequest } from '../../../models/pharmacy-portal/appointment-create.request';
import { ICreateAppointmentResponse } from '../../../models/pharmacy-portal/appointment-create.response';
import { getDataFromUrl } from '../../../utils/get-data-from-url';
import { generateBearerToken } from '../helpers/oauth-api-helper';

export interface ICreateAppointmentEndpointResponse {
  errorCode?: number;
  message: string;
}
export async function createAppointmentEndpointHelper(
  pharmacyPortalApiUrl: string,
  createBookingPayload: ICreateAppointmentRequest,
  tenantId: string,
  clientId: string,
  clientSecret: string,
  scope: string
): Promise<ICreateAppointmentEndpointResponse> {
  const token: string = await generateBearerToken(
    tenantId,
    clientId,
    clientSecret,
    scope
  );

  const url = getCreateAppointmentEndpointUrl(pharmacyPortalApiUrl);

  const apiResponse: Response = await getDataFromUrl(
    url,
    createBookingPayload,
    'POST',
    { Authorization: `Bearer ${token}` }
  );
  if (apiResponse.ok) {
    const createAppointmentResponse: ICreateAppointmentResponse =
      await apiResponse.json();
    return {
      message: createAppointmentResponse.message,
    };
  }
  const createAppointmentError: IBookingResponseError =
    await apiResponse.json();
  return {
    errorCode: apiResponse.status,
    message: createAppointmentError.message,
  };
}

export function getCreateAppointmentEndpointUrl(pharmacyPortalApiUrl: string) {
  return `${pharmacyPortalApiUrl}/appointments`;
}
